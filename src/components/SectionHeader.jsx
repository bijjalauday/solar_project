import Reveal from './Reveal';

export default function SectionHeader({ eyebrow, title, subtitle, align = 'center', id, light = false }) {
  return (
    <Reveal className={`section-header${align === 'left' ? ' section-header--left' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title" id={id} style={light ? { color: '#fff' } : undefined}>
        {title}
      </h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </Reveal>
  );
}
