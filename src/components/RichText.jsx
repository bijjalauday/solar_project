import { Fragment } from 'react';
import { fillTokens } from '../config';

/**
 * Renders a JSON string with {{tokens}} filled in, plus two tiny bits of markup:
 * **bold** and [link text](href).
 */
export default function RichText({ text }) {
  const parts = fillTokens(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const external = /^https?:/.test(link[2]);
      return (
        <a key={i} href={link[2]} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
          {link[1]}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
