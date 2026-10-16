import site from '../config';
import Icon from '../components/Icon';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import './WhyUs.css';

export default function WhyUs({ id }) {
  const { whyUs } = site;
  return (
    <section id={id} className="section section--tint" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader id={`${id}-title`} eyebrow={whyUs.eyebrow} title={whyUs.title} subtitle={whyUs.subtitle} />
        <div className="why__grid">
          {whyUs.features.map((f, i) => (
            <Reveal as="article" key={f.title} delay={(i % 3) * 80} className="why__card card">
              <span className="icon-tile">
                <Icon name={f.icon} />
              </span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal as="ul" className="why__warranties" aria-label="Warranties">
          {whyUs.warranties.map((w) => (
            <li key={w.label}>
              <strong>
                {w.years}
                <span>yrs</span>
              </strong>
              {w.label}
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
