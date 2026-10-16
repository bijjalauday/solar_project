import { useEffect, useRef, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import site, { asset, enabledSections, telHref, whatsappHref } from '../config';
import { useScrollSpy } from '../hooks/useScrollSpy';
import SocialIcon from '../components/SocialIcon';
import './Header.css';

export function Brand({ light = false }) {
  const { brand } = site;
  const logo = brand.headerLogo ?? { image: brand.logoMark, showName: true };
  return (
    <a className={`brand${light ? ' brand--light' : ''}`} href="#home" aria-label={`${brand.name} – home`}>
      <img className="brand__mark" src={asset(logo.image)} alt="" width="48" height="45" />
      {logo.showName && (
        <span className="brand__text">
          <span className="brand__name">{brand.name}</span>
          <span className="brand__tagline">{brand.tagline}</span>
        </span>
      )}
    </a>
  );
}

export default function Header() {
  const sections = enabledSections();
  const navItems = sections.filter((s) => s.inNav);
  // Watch every section, so scrolling through one that isn't in the menu clears the highlight.
  const active = useScrollSpy(sections.map((s) => s.id));
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const { header, contact } = site;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    const onResize = () => window.innerWidth >= 1180 && setOpen(false);
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  const close = () => setOpen(false);
  const toggle = () => {
    // The menu sits just under the header, which moves when the top bar scrolls away.
    const bottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
    menuRef.current?.style.setProperty('--menu-top', `${Math.max(0, bottom)}px`);
    setOpen((v) => !v);
  };

  return (
    <>
      <header ref={headerRef} className={`header${scrolled ? ' header--scrolled' : ''}`}>
        <div className="container header__inner">
          <Brand />

          <nav className="nav" aria-label="Main">
            <ul>
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} aria-current={active === item.id ? 'true' : undefined}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <a className="header__call" href={telHref(contact.phone)} aria-label={`Call ${contact.phone}`}>
              <Phone aria-hidden="true" />
            </a>
            <a className="btn btn--primary btn--sm header__cta" href={header.cta.href}>
              {header.cta.label}
            </a>
            <button
              type="button"
              className="header__toggle"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={toggle}
            >
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      {/* Outside <header>: its backdrop-filter would otherwise trap position:fixed. */}
      <div ref={menuRef} id="mobile-menu" className={`mobile-menu${open ? ' is-open' : ''}`} hidden={!open}>
        <nav aria-label="Mobile">
          <ul>
            {navItems.map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} onClick={close} aria-current={active === item.id ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mobile-menu__actions">
          <a className="btn btn--primary btn--block" href={header.cta.href} onClick={close}>
            {header.cta.label}
          </a>
          <div className="mobile-menu__row">
            <a className="btn btn--secondary" href={telHref(contact.phone)}>
              <Phone aria-hidden="true" /> Call
            </a>
            <a
              className="btn btn--whatsapp"
              href={whatsappHref(contact.whatsapp, contact.whatsappMessage)}
              target="_blank"
              rel="noreferrer"
            >
              <SocialIcon platform="whatsapp" /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
