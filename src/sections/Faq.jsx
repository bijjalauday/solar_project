import { Phone, Plus } from 'lucide-react';
import site, { telHref, whatsappHref } from '../config';
import SectionHeader from '../components/SectionHeader';
import SocialIcon from '../components/SocialIcon';
import './Faq.css';

export default function Faq({ id }) {
  const { faq, contact } = site;
  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container faq">
        <div className="faq__aside">
          <SectionHeader id={`${id}-title`} eyebrow={faq.eyebrow} title={faq.title} subtitle={faq.subtitle} align="left" />
          <div className="faq__help">
            <a className="btn btn--navy" href={telHref(contact.phone)}>
              <Phone aria-hidden="true" /> {contact.phone}
            </a>
            <a
              className="btn btn--whatsapp"
              href={whatsappHref(contact.whatsapp, contact.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <SocialIcon platform="whatsapp" /> WhatsApp us
            </a>
          </div>
        </div>

        <div className="faq__list">
          {faq.items.map((item) => (
            <details key={item.q} name="faq" className="faq__item">
              <summary>
                <span>{item.q}</span>
                <Plus aria-hidden="true" />
              </summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
