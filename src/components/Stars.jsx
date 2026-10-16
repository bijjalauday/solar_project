import { Star } from 'lucide-react';

export default function Stars({ rating = 5, size = 16 }) {
  const filled = Math.round(rating);
  return (
    <span className="stars" role="img" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} width={size} height={size} aria-hidden="true" className={i <= filled ? 'star star--on' : 'star'} />
      ))}
    </span>
  );
}
