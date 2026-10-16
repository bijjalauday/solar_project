import { useInView } from '../hooks/useInView';

/** Fades/slides its children in the first time they scroll into view. */
export default function Reveal({ as: Tag = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' is-visible' : ''}${className ? ` ${className}` : ''}`}
      style={delay ? { '--delay': `${delay}ms`, ...style } : style}
      {...rest}
    >
      {children}
    </Tag>
  );
}
