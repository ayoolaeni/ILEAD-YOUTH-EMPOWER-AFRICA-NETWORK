import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { imgProps } from '../lib/media.js';

/** Responsive <img> for any generated media name. */
export function Img({ name, alt, sizes, eager = false, className, style }) {
  const p = imgProps(name, sizes);
  return (
    <img
      {...p}
      alt={alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchpriority={eager ? 'high' : undefined}
      decoding="async"
      className={className}
      style={style}
    />
  );
}

/** Fade/slide in when scrolled into view (disabled for reduced-motion users). */
export function Reveal({ children, delay = 0, y = 26, as = 'div', className, ...rest }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;
  if (reduce) return <Comp className={className} {...rest}>{children}</Comp>;
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 0.7, 0.2, 1] }}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/** Counts up to `to` the first time it scrolls into view. */
export function Counter({ to, suffix = '', plain = false }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (reduce || typeof IntersectionObserver === 'undefined') {
      setN(to);
      return undefined;
    }
    let raf;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const dur = 1600;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          setN(Math.round(to * eased));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [to, reduce]);

  return (
    <span ref={ref}>
      {plain ? n : n.toLocaleString('en-NG')}
      {suffix && <small>{suffix}</small>}
    </span>
  );
}

/** Decorative ring of figures, echoing the iLead logo. */
export function Rings({ className }) {
  const colors = ['#f28c1a', '#3f9b2e', '#1f9bd8', '#3d5a86'];
  const dots = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return { x: 260 + Math.cos(a) * 220, y: 260 + Math.sin(a) * 220, c: colors[i % 4] };
  });
  return (
    <svg className={className} viewBox="0 0 520 520" aria-hidden="true" focusable="false">
      <circle cx="260" cy="260" r="250" fill="none" stroke="#fff" strokeWidth="2" />
      <circle cx="260" cy="260" r="180" fill="none" stroke="#fff" strokeWidth="2" strokeDasharray="4 10" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r="14" fill={d.c} />
      ))}
    </svg>
  );
}

export function PageHero({ eyebrow, title, children }) {
  return (
    <section className="page-hero on-dark">
      <Rings className="rings" />
      <div className="container">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
        {children && <p>{children}</p>}
      </div>
    </section>
  );
}

export function SectionHead({ eyebrow, title, children, center = false }) {
  return (
    <Reveal className={`section-head${center ? ' section-head--center' : ''}`}>
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      {children && <p>{children}</p>}
    </Reveal>
  );
}
