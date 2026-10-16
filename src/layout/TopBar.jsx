import { Clock, Mail, Phone, ShieldCheck } from 'lucide-react';
import site, { mailHref, telHref } from '../config';
import './TopBar.css';

export default function TopBar() {
  const { topBar, contact } = site;
  if (!topBar?.enabled) return null;
  return (
    <div className="topbar">
      <div className="container topbar__inner">
        <p className="topbar__message">
          <ShieldCheck aria-hidden="true" />
          {topBar.message}
        </p>
        <ul className="topbar__contact">
          <li>
            <a href={telHref(contact.phone)}>
              <Phone aria-hidden="true" />
              {contact.phone}
            </a>
          </li>
          <li className="topbar__optional">
            <a href={mailHref(contact.email)}>
              <Mail aria-hidden="true" />
              {contact.email}
            </a>
          </li>
          <li className="topbar__optional topbar__hours">
            <Clock aria-hidden="true" />
            {contact.hours}
          </li>
        </ul>
      </div>
    </div>
  );
}
