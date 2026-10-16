import { useRef } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Quote } from 'lucide-react';
import site, { asset } from '../config';
import Stars from '../components/Stars';
import SectionHeader from '../components/SectionHeader';
import './Reviews.css';

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');

export default function Reviews({ id }) {
  const { reviews, videos } = site;
  const track = useRef(null);

  const scroll = (dir) => {
    const el = track.current;
    if (!el) return;
    const card = el.querySelector('li');
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  };

  return (
    <section id={id} className="section section--tint" aria-labelledby={`${id}-title`}>
      <div className="container">
        <div className="reviews__head">
          <SectionHeader id={`${id}-title`} eyebrow={reviews.eyebrow} title={reviews.title} align="left" />
          {reviews.summary && (
            <div className="reviews__summary card">
              <strong>{reviews.summary.rating}</strong>
              <div>
                <Stars rating={reviews.summary.rating} size={18} />
                <span>
                  {reviews.summary.count}+ {reviews.summary.source}
                </span>
                {reviews.summary.url && (
                  <a href={reviews.summary.url} target="_blank" rel="noreferrer">
                    Read reviews <ExternalLink aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="reviews__carousel">
          <ul ref={track} className="reviews__track" aria-label="Customer reviews" tabIndex={0}>
            {reviews.items.map((r) => (
              <li key={r.name} className="review card">
                <Quote className="review__quote-icon" aria-hidden="true" />
                <Stars rating={r.rating} />
                <blockquote>{r.quote}</blockquote>
                <div className="review__author">
                  {r.photo ? (
                    <img src={asset(r.photo)} alt="" width="48" height="48" loading="lazy" />
                  ) : (
                    <span className="review__avatar" aria-hidden="true">
                      {initials(r.name)}
                    </span>
                  )}
                  <span>
                    <strong>{r.name}</strong>
                    {[r.location, r.system].filter(Boolean).join(' · ')}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <div className="reviews__nav">
            <button type="button" onClick={() => scroll(-1)} aria-label="Previous reviews">
              <ChevronLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scroll(1)} aria-label="Next reviews">
              <ChevronRight aria-hidden="true" />
            </button>
          </div>
        </div>

        {videos?.items?.length > 0 && (
          <ul className="reviews__videos">
            {videos.items.map((v) => (
              <li key={v.youtubeId ?? v}>
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${v.youtubeId ?? v}`}
                  title={v.title ?? 'Customer video'}
                  loading="lazy"
                  allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
