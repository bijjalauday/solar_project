import { useEffect } from 'react';
import site, { enabledSections } from './config';
import { QuoteProvider } from './context/QuoteProvider';
import TopBar from './layout/TopBar';
import Header from './layout/Header';
import Footer from './layout/Footer';
import FloatingActions from './layout/FloatingActions';
import LegalDialog from './components/LegalDialog';
import Hero from './sections/Hero';
import Trust from './sections/Trust';
import Solutions from './sections/Solutions';
import Calculator from './sections/Calculator';
import Simulator from './sections/Simulator';
import Process from './sections/Process';
import Financing from './sections/Financing';
import WhyUs from './sections/WhyUs';
import Projects from './sections/Projects';
import Partners from './sections/Partners';
import Reviews from './sections/Reviews';
import Faq from './sections/Faq';
import Contact from './sections/Contact';

// Maps the ids used in site.json `sections.order` to components.
const SECTIONS = {
  home: Hero,
  trust: Trust,
  solutions: Solutions,
  calculator: Calculator,
  'how-solar-works': Simulator,
  process: Process,
  financing: Financing,
  'why-us': WhyUs,
  projects: Projects,
  partners: Partners,
  reviews: Reviews,
  faq: Faq,
  contact: Contact,
};

const toVar = (key) => `--${key.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`)}`;

/** Publishes site.json `theme` colours as CSS variables (navyDeep -> --navy-deep). */
function ThemeVars() {
  const vars = Object.entries(site.theme)
    .filter(([key]) => !key.startsWith('_'))
    .map(([key, value]) => `${toVar(key)}:${value};`)
    .join('');
  return <style>{`:root{${vars}}`}</style>;
}

export default function App() {
  useEffect(() => {
    document.title = site.seo.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', site.seo.description);
  }, []);

  return (
    <QuoteProvider>
      <ThemeVars />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <TopBar />
      <Header />
      <main id="main">
        {enabledSections().map(({ id }) => {
          const Section = SECTIONS[id];
          return Section ? <Section key={id} id={id} /> : null;
        })}
      </main>
      <Footer />
      <FloatingActions />
      <LegalDialog />
    </QuoteProvider>
  );
}
