import site, { asset } from '../config';
import SectionHeader from '../components/SectionHeader';
import './Partners.css';

export default function Partners({ id }) {
  const { partners } = site;
  return (
    <section id={id} className="section partners" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader id={`${id}-title`} eyebrow={partners.eyebrow} title={partners.title} subtitle={partners.subtitle} />
        <div className="partners__groups">
          {partners.groups.map((g) => (
            <div key={g.title} className="partners__group">
              <h3>{g.title}</h3>
              <ul>
                {g.items.map((b) => (
                  <li key={b.name} className="partners__item">
                    {b.logo ? <img src={asset(b.logo)} alt={b.name} loading="lazy" /> : <span>{b.name}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
