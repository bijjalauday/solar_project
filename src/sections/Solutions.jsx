import { ArrowRight, CircleCheck } from 'lucide-react';
import site, { asset } from '../config';
import { useQuote } from '../context/quote';
import { scrollToSection } from '../lib/scroll';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import './Solutions.css';

export default function Solutions({ id }) {
  const { solutions } = site;
  const { prefillLead } = useQuote();

  const ask = (item) => {
    prefillLead({ interest: item.interest });
    scrollToSection('contact');
  };

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader id={`${id}-title`} {...solutions} />
        <div className="solutions__grid">
          {solutions.items.map((item, i) => (
            <Reveal as="article" key={item.id} delay={i * 80} className="solution card">
              <div className="solution__media">
                <img src={asset(item.image)} alt="" width="800" height="500" loading="lazy" />
                <span className="chip solution__capacity">{item.capacity}</span>
              </div>
              <div className="solution__body">
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <ul className="check-list">
                  {item.points.map((p) => (
                    <li key={p}>
                      <CircleCheck aria-hidden="true" />
                      {p}
                    </li>
                  ))}
                </ul>
                <button type="button" className="link-arrow solution__cta" onClick={() => ask(item)}>
                  Get a quote <ArrowRight aria-hidden="true" />
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
