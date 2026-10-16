import { useState } from 'react';
import { CircleCheck, MapPin } from 'lucide-react';
import site, { asset } from '../config';
import { kw } from '../lib/format';
import SectionHeader from '../components/SectionHeader';
import './Projects.css';

export default function Projects({ id }) {
  const { projects } = site;
  const [filter, setFilter] = useState(projects.filters[0]);
  const showAll = filter === projects.filters[0];
  const items = projects.items.filter((p) => showAll || p.category === filter);
  // Only offer filters that have at least one project.
  const filters = projects.filters.filter((f, i) => i === 0 || projects.items.some((p) => p.category === f));

  return (
    <section id={id} className="section" aria-labelledby={`${id}-title`}>
      <div className="container">
        <SectionHeader id={`${id}-title`} eyebrow={projects.eyebrow} title={projects.title} subtitle={projects.subtitle} />

        <div className="projects__filters" role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button key={f} type="button" aria-pressed={f === filter} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        <ul className="projects__grid">
          {items.map((p) => (
            <li key={p.title} className="project card">
              <div className="project__media">
                <img src={asset(p.image)} alt={`${p.title} in ${p.location}`} width="800" height="500" loading="lazy" />
                <span className="chip project__kw">{kw(p.capacityKw)}</span>
                <span className="chip project__cat">{p.category}</span>
              </div>
              <div className="project__body">
                <h3>{p.title}</h3>
                <p className="project__loc">
                  <MapPin aria-hidden="true" />
                  {p.location}
                </p>
                {p.result && (
                  <p className="project__result">
                    <CircleCheck aria-hidden="true" />
                    {p.result}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
