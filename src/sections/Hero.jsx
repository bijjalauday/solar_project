import { ArrowRight, CircleCheck, Sun } from 'lucide-react';
import site, { asset } from '../config';
import Icon from '../components/Icon';
import Stars from '../components/Stars';
import Reveal from '../components/Reveal';
import './Hero.css';

export default function Hero({ id }) {
  const { hero, reviews } = site;
  return (
    <section id={id} className="hero" aria-labelledby="hero-title">
      <div className="container hero__grid">
        <div className="hero__copy">
          <p className="hero__eyebrow">
            <Sun aria-hidden="true" />
            {hero.eyebrow}
          </p>
          <h1 id="hero-title" className="hero__title">
            {hero.titleLead}{' '}
            <span className="hero__highlight">
              {hero.titleHighlight}
              <svg viewBox="0 0 200 14" preserveAspectRatio="none" aria-hidden="true">
                <path d="M3 10 C 50 3, 120 2, 197 8" />
              </svg>
            </span>{' '}
            {hero.titleTail}
          </h1>
          <p className="hero__subtitle">{hero.subtitle}</p>

          <div className="hero__ctas">
            <a className="btn btn--primary" href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowRight aria-hidden="true" />
            </a>
            <a className="btn btn--secondary" href={hero.secondaryCta.href}>
              {hero.secondaryCta.label}
            </a>
          </div>

          <ul className="hero__highlights">
            {hero.highlights.map((h) => (
              <li key={h}>
                <CircleCheck aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero__visual">
          <div className="hero__image">
            <img src={asset(hero.image)} alt={hero.imageAlt} width="800" height="500" fetchPriority="high" />
          </div>

          {reviews?.summary && (
            <div className="hero__rating">
              <Stars rating={reviews.summary.rating} size={14} />
              <span>
                <strong>{reviews.summary.rating}</strong> · {reviews.summary.count}+ {reviews.summary.source}
              </span>
            </div>
          )}

          {hero.savingsCard && (
            <div className="hero__savings">
              <span className="hero__savings-label">{hero.savingsCard.label}</span>
              <div className="hero__savings-values">
                <span className="hero__before">{hero.savingsCard.before}</span>
                <ArrowRight aria-hidden="true" />
                <span className="hero__after">{hero.savingsCard.after}</span>
              </div>
              <span className="hero__savings-note">{hero.savingsCard.note}</span>
            </div>
          )}
        </div>
      </div>

      <div className="container">
        <ul className="hero__offers">
          {hero.offers.map((o, i) => (
            <Reveal as="li" key={o.title} delay={i * 90} className="hero__offer">
              <span className="icon-tile">
                <Icon name={o.icon} />
              </span>
              <span>
                <strong>{o.title}</strong>
                <span>{o.text}</span>
              </span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
