import { BadgeCheck } from 'lucide-react';
import site from '../config';
import { useInView } from '../hooks/useInView';
import { useCountUp } from '../hooks/useCountUp';
import { number } from '../lib/format';
import './Trust.css';

function Stat({ value, suffix = '', decimals = 0, label, start }) {
  const current = useCountUp(value, start);
  return (
    <li className="trust__stat">
      <strong>
        {number(current, decimals)}
        {suffix}
      </strong>
      <span>{label}</span>
    </li>
  );
}

export default function Trust({ id }) {
  const { trust } = site;
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <section id={id} className="trust" aria-label="Our track record">
      <div className="container">
        <ul ref={ref} className="trust__stats">
          {trust.stats.map((s) => (
            <Stat key={s.label} {...s} start={inView} />
          ))}
        </ul>
        <ul className="trust__badges">
          {trust.badges.map((b) => (
            <li key={b}>
              <BadgeCheck aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
