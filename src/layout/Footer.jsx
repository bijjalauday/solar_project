import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import site, { asset, enabledSections, formatAddress, mailHref, telHref } from '../config';
import SocialIcon from '../components/SocialIcon';
import './Footer.css';

export default function Footer() {
  const { brand, contact, socials, footer, solutions } = site;
  const links = enabledSections().filter((s) => s.inNav);
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <img
            className="footer__logo"
            src={asset(brand.logo)}
            alt={`${brand.name} – ${brand.tagline}`}
            width="320"
            height="112"
            loading="lazy"
          />
          <p>{footer.about}</p>
          <ul className="footer__social" aria-label="Social media">
            {socials.map((s) => (
              <li key={s.platform}>
                <a href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}>
                  <SocialIcon platform={s.platform} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="footer__col" aria-label="Footer">
          <h2>Quick links</h2>
          <ul>
            {links.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2>Solutions</h2>
          <ul>
            {solutions.items.map((s) => (
              <li key={s.id}>
                <a href="#solutions">{s.title}</a>
              </li>
            ))}
          </ul>
        </div>

        <div className="footer__col footer__contact">
          <h2>Contact</h2>
          <ul>
            <li>
              <Phone aria-hidden="true" />
              <a href={telHref(contact.phone)}>{contact.phone}</a>
            </li>
            <li>
              <Mail aria-hidden="true" />
              <a href={mailHref(contact.email)}>{contact.email}</a>
            </li>
            <li>
              <MapPin aria-hidden="true" />
              <a href={contact.mapLink} target="_blank" rel="noreferrer">
                {formatAddress(contact.address)}
              </a>
            </li>
            <li>
              <Clock aria-hidden="true" />
              <span>{contact.hours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p>
            © {year} {brand.legalName.replace(/\.$/, '')}. All rights reserved.
          </p>
          <ul>
            {footer.legalLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
