import { useEffect, useRef, useState } from 'react';
import { CircleCheck, Mail, MapPin, Phone, ShieldCheck, UserRound, X } from 'lucide-react';
import site, { fillTokens, formatAddress, legalDocuments, mailHref, telHref } from '../config';
import RichText from './RichText';
import './LegalDialog.css';

const docFromHash = () => legalDocuments.find((d) => `#${d.id}` === window.location.hash) ?? null;

function Block({ block }) {
  if (typeof block === 'string') {
    return (
      <p>
        <RichText text={block} />
      </p>
    );
  }
  if (block.list) {
    return (
      <ul className="legal__list">
        {block.list.map((item) => (
          <li key={item}>
            <RichText text={item} />
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

function ContactCard({ doc }) {
  const { contact } = site;
  const person = doc.contactPerson ? site.legal?.[doc.contactPerson] : null;
  const email = person?.email ?? contact.email;
  const phone = fillTokens(person?.phone ?? contact.phone);
  return (
    <div className="legal__card">
      {person && (
        <p className="legal__card-row">
          <UserRound aria-hidden="true" />
          <span>
            <strong>{person.name}</strong>
            {person.designation}, {site.brand.legalName}
          </span>
        </p>
      )}
      <p className="legal__card-row">
        <Mail aria-hidden="true" />
        <a href={mailHref(email)}>{email}</a>
      </p>
      <p className="legal__card-row">
        <Phone aria-hidden="true" />
        <a href={telHref(phone)}>{phone}</a>
      </p>
      <p className="legal__card-row">
        <MapPin aria-hidden="true" />
        <span>{formatAddress(contact.address)}</span>
      </p>
    </div>
  );
}

/** Privacy policy / terms in a modal, opened by links to `#privacy-policy`, `#terms`, … */
export default function LegalDialog() {
  const [doc, setDoc] = useState(docFromHash);
  const dialogRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    const onHash = () => setDoc(docFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (doc) {
      if (!dialog.open) dialog.showModal();
      bodyRef.current?.scrollTo(0, 0);
    } else if (dialog.open) {
      dialog.close();
    }
  }, [doc]);

  const close = () => dialogRef.current?.close();

  // Fired for the close button, Esc and backdrop clicks: drop the hash so Back/refresh don't reopen it.
  const onClose = () => {
    if (doc && window.location.hash === `#${doc.id}`) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setDoc(null);
  };

  const goTo = (sectionId) => {
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    document.getElementById(sectionId)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const sectionId = (s) => `legal-${doc.id}-${s}`;
  const others = doc ? legalDocuments.filter((d) => d.id !== doc.id) : [];

  return (
    <dialog
      ref={dialogRef}
      className="legal"
      aria-labelledby="legal-title"
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      {doc && (
        <div className="legal__panel">
          <header className="legal__head">
            <div>
              <span className="eyebrow">{site.brand.name}</span>
              <h2 id="legal-title">{doc.title}</h2>
              <p>Last updated: {doc.lastUpdated}</p>
            </div>
            <button type="button" className="legal__close" onClick={close} aria-label={`Close ${doc.title}`}>
              <X aria-hidden="true" />
            </button>
          </header>

          <div className="legal__body" ref={bodyRef}>
            <p className="legal__intro">
              <RichText text={doc.intro} />
            </p>

            {doc.highlights?.length > 0 && (
              <section className="legal__glance" aria-labelledby="legal-glance">
                <h3 id="legal-glance">
                  <ShieldCheck aria-hidden="true" /> At a glance
                </h3>
                <ul>
                  {doc.highlights.map((h) => (
                    <li key={h}>
                      <CircleCheck aria-hidden="true" />
                      <RichText text={h} />
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <nav className="legal__toc" aria-label="Contents">
              <h3>Contents</h3>
              <ol>
                {doc.sections.map((s) => (
                  <li key={s.id}>
                    <button type="button" onClick={() => goTo(sectionId(s.id))}>
                      {s.title}
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={() => goTo(sectionId('contact'))}>
                    {doc.contactTitle}
                  </button>
                </li>
              </ol>
            </nav>

            {doc.sections.map((s, i) => (
              <section key={s.id} id={sectionId(s.id)} className="legal__section">
                <h3>
                  <span className="legal__num">{i + 1}</span>
                  {s.title}
                </h3>
                {s.content.map((block, j) => (
                  <Block key={j} block={block} />
                ))}
              </section>
            ))}

            <section id={sectionId('contact')} className="legal__section">
              <h3>
                <span className="legal__num">{doc.sections.length + 1}</span>
                {doc.contactTitle}
              </h3>
              <p>
                <RichText text={doc.contactText} />
              </p>
              <ContactCard doc={doc} />
            </section>

            {others.length > 0 && (
              <p className="legal__also">
                See also:{' '}
                {others.map((d, i) => (
                  <span key={d.id}>
                    {i > 0 && ' · '}
                    <a href={`#${d.id}`}>{d.title}</a>
                  </span>
                ))}
              </p>
            )}
          </div>
        </div>
      )}
    </dialog>
  );
}
