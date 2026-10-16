import { useId, useState } from 'react';
import { CircleCheck, Clock, LoaderCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import site, { formatAddress, mailHref, telHref, whatsappHref } from '../config';
import { useQuote } from '../context/quote';
import SectionHeader from '../components/SectionHeader';
import SocialIcon from '../components/SocialIcon';
import RichText from '../components/RichText';
import './Contact.css';

const EMPTY = { name: '', phone: '', email: '', location: '', bill: '', interest: '', message: '', company: '' };

function validate(v) {
  const errors = {};
  if (v.name.trim().length < 2) errors.name = 'Please enter your name.';
  const digits = v.phone.replace(/\D/g, '').replace(/^(91|0)(?=\d{10}$)/, '');
  if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = 'Enter a valid 10-digit mobile number.';
  if (v.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = 'Enter a valid email address.';
  if (!v.location.trim()) errors.location = 'Please tell us your area / city.';
  return errors;
}

function buildMessage(v) {
  return [
    `New solar enquiry – ${site.brand.name}`,
    `Name: ${v.name}`,
    `Mobile: ${v.phone}`,
    v.email && `Email: ${v.email}`,
    `Location: ${v.location}`,
    v.interest && `Interested in: ${v.interest}`,
    v.bill && `Monthly bill: ₹${v.bill}`,
    v.message && `Message: ${v.message}`,
  ]
    .filter(Boolean)
    .join('\n');
}

function LeadForm({ initial }) {
  const { contactSection, leadForm, contact } = site;
  const uid = useId();
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | sending | done | error

  const set = (key) => (e) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (values.company) return; // honeypot: bots fill hidden fields
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length) {
      document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus();
      return;
    }
    if (leadForm.mode === 'endpoint' && leadForm.endpoint) {
      setState('sending');
      try {
        const { company: _honeypot, ...payload } = values;
        const res = await fetch(leadForm.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ ...payload, source: window.location.href }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setState('done');
      } catch {
        setState('error');
      }
      return;
    }
    window.open(whatsappHref(contact.whatsapp, buildMessage(values)), '_blank', 'noopener');
    setState('done');
  };

  if (state === 'done') {
    return (
      <div className="lead__done" role="status">
        <CircleCheck aria-hidden="true" />
        <h3>{leadForm.successTitle}</h3>
        <p>{leadForm.successText}</p>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => {
            setValues(EMPTY);
            setState('idle');
          }}
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const field = (key, label, props = {}) => (
    <div className="field">
      <label htmlFor={`${uid}-${key}`}>
        {label}
        {props.required && <span aria-hidden="true"> *</span>}
      </label>
      <input
        id={`${uid}-${key}`}
        className="input"
        value={values[key]}
        onChange={set(key)}
        aria-invalid={errors[key] ? 'true' : undefined}
        aria-describedby={errors[key] ? `${uid}-${key}-err` : undefined}
        {...props}
      />
      {errors[key] && (
        <span id={`${uid}-${key}-err`} className="field-error">
          {errors[key]}
        </span>
      )}
    </div>
  );

  return (
    <form className="lead" onSubmit={onSubmit} noValidate>
      <div className="lead__row">
        {field('name', 'Full name', { autoComplete: 'name', required: true })}
        {field('phone', 'Mobile number', {
          type: 'tel',
          inputMode: 'tel',
          autoComplete: 'tel',
          required: true,
          placeholder: '10-digit mobile',
        })}
      </div>
      <div className="lead__row">
        {field('email', 'Email', { type: 'email', autoComplete: 'email', placeholder: 'Optional' })}
        {field('location', 'Area / City', {
          autoComplete: 'address-level2',
          required: true,
          placeholder: 'e.g. Kondapur, Hyderabad',
        })}
      </div>
      <div className="lead__row">
        <div className="field">
          <label htmlFor={`${uid}-interest`}>Solar for</label>
          <select id={`${uid}-interest`} className="input" value={values.interest} onChange={set('interest')}>
            <option value="">Select an option</option>
            {contactSection.interestOptions.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
        {field('bill', 'Monthly electricity bill (₹)', { inputMode: 'numeric', placeholder: 'e.g. 4000' })}
      </div>
      <div className="field">
        <label htmlFor={`${uid}-message`}>Message</label>
        <textarea
          id={`${uid}-message`}
          className="input"
          rows="3"
          value={values.message}
          onChange={set('message')}
          placeholder="Roof type, preferred time to call, anything else…"
        />
      </div>
      <div className="lead__hp" aria-hidden="true">
        <label htmlFor={`${uid}-company`}>Company</label>
        <input id={`${uid}-company`} tabIndex={-1} autoComplete="off" value={values.company} onChange={set('company')} />
      </div>

      {state === 'error' && (
        <p className="field-error" role="alert">
          Sorry, something went wrong. Please call us on {contact.phone} or try again.
        </p>
      )}

      <button className="btn btn--primary btn--block" type="submit" disabled={state === 'sending'}>
        {state === 'sending' ? (
          <LoaderCircle className="spin" aria-hidden="true" />
        ) : leadForm.mode === 'whatsapp' ? (
          <SocialIcon platform="whatsapp" />
        ) : (
          <Send aria-hidden="true" />
        )}
        {leadForm.mode === 'whatsapp' ? 'Send enquiry on WhatsApp' : 'Request free site survey'}
      </button>
      {leadForm.consentText && (
        <p className="lead__privacy">
          <RichText text={leadForm.consentText} />
        </p>
      )}
    </form>
  );
}

export default function Contact({ id }) {
  const { contactSection, contact } = site;
  const { lead } = useQuote();
  const { version, ...initial } = lead;

  return (
    <section id={id} className="section section--tint" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader
          id={`${id}-title`}
          eyebrow={contactSection.eyebrow}
          title={contactSection.title}
          subtitle={contactSection.subtitle}
        />
        <div className="contact">
          <aside className="contact__info">
            <ul className="contact__list">
              <li>
                <span className="contact__icon">
                  <Phone aria-hidden="true" />
                </span>
                <span>
                  <small>Call us</small>
                  <a href={telHref(contact.phone)}>{contact.phone}</a>
                </span>
              </li>
              <li>
                <span className="contact__icon">
                  <SocialIcon platform="whatsapp" />
                </span>
                <span>
                  <small>WhatsApp</small>
                  <a href={whatsappHref(contact.whatsapp, contact.whatsappMessage)} target="_blank" rel="noreferrer">
                    {contact.whatsapp}
                  </a>
                </span>
              </li>
              <li>
                <span className="contact__icon">
                  <Mail aria-hidden="true" />
                </span>
                <span>
                  <small>Email</small>
                  <a href={mailHref(contact.email)}>{contact.email}</a>
                </span>
              </li>
              <li>
                <span className="contact__icon">
                  <MapPin aria-hidden="true" />
                </span>
                <span>
                  <small>Office</small>
                  <a href={contact.mapLink} target="_blank" rel="noreferrer">
                    {formatAddress(contact.address)}
                  </a>
                </span>
              </li>
              <li>
                <span className="contact__icon">
                  <Clock aria-hidden="true" />
                </span>
                <span>
                  <small>Working hours</small>
                  {contact.hours}
                </span>
              </li>
            </ul>
            {contact.mapEmbedUrl && (
              <iframe
                className="contact__map"
                src={contact.mapEmbedUrl}
                title={`Map showing ${site.brand.name} office`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </aside>

          <div className="contact__form card">
            <LeadForm key={version} initial={initial} />
          </div>
        </div>
      </div>
    </section>
  );
}
