import { useEffect } from 'react';
import { Phone } from 'lucide-react';
import site, { telHref, whatsappHref } from '../config';
import SocialIcon from '../components/SocialIcon';
import './FloatingActions.css';

export default function FloatingActions() {
  const { floatingActions, contact, header } = site;

  useEffect(() => {
    document.body.classList.add('has-mobile-bar');
    return () => document.body.classList.remove('has-mobile-bar');
  }, []);

  const wa = whatsappHref(contact.whatsapp, contact.whatsappMessage);
  return (
    <>
      {/* desktop: floating round buttons */}
      <div className="fab">
        {floatingActions.call && (
          <a className="fab__btn fab__btn--call" href={telHref(contact.phone)} aria-label={`Call ${contact.phone}`}>
            <Phone aria-hidden="true" />
          </a>
        )}
        {floatingActions.whatsapp && (
          <a className="fab__btn fab__btn--wa" href={wa} target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp">
            <SocialIcon platform="whatsapp" size={28} />
          </a>
        )}
      </div>

      {/* mobile: bottom action bar */}
      <div className="mobile-bar">
        {floatingActions.call && (
          <a href={telHref(contact.phone)}>
            <Phone aria-hidden="true" />
            Call
          </a>
        )}
        {floatingActions.whatsapp && (
          <a href={wa} target="_blank" rel="noreferrer">
            <SocialIcon platform="whatsapp" />
            WhatsApp
          </a>
        )}
        <a className="mobile-bar__cta" href={header.cta.href}>
          {header.cta.label}
        </a>
      </div>
    </>
  );
}
