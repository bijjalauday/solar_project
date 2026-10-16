import site from '../config';
import Icon from '../components/Icon';
import SectionHeader from '../components/SectionHeader';
import Reveal from '../components/Reveal';
import './Process.css';

export default function Process({ id }) {
  const { process } = site;
  return (
    <section id={id} className="section section--tint" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader id={`${id}-title`} eyebrow={process.eyebrow} title={process.title} subtitle={process.subtitle} />
        <ol className="process">
          {process.steps.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 90} className="process__step">
              <div className="process__marker">
                <span className="process__icon">
                  <Icon name={step.icon} />
                </span>
                <span className="process__num">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
