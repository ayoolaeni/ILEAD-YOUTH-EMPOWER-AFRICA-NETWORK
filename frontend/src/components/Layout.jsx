import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { site, nav } from '../data/site.js';
import NewsletterForm from './NewsletterForm.jsx';
import SocialLinks from './SocialLinks.jsx';

function Brand() {
  return (
    <Link to="/" className="brand" aria-label={`${site.name} home`}>
      <img src="/media/logo.webp" alt="" width="52" height="52" />
      <span className="brand__text">
        <span className="brand__name">iLead</span>
        <span className="brand__sub">Youth Empower Africa</span>
      </span>
    </Link>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <>
      <div className="topbar">
        <div className="container">
          <span className="topbar__badge"><ShieldCheck aria-hidden="true" /> Registered NGO · CAC {site.cac}</span>
          <div className="topbar__group">
            <a href={`tel:${site.phones[0].tel}`}><Phone aria-hidden="true" />{site.phones[0].label}</a>
            <a href={`mailto:${site.email}`}><Mail aria-hidden="true" />{site.email}</a>
          </div>
        </div>
      </div>
      <header className={`header${scrolled ? ' is-scrolled' : ''}`}>
        <div className="container header__inner">
          <Brand />
          <button
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="site-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
          <nav id="site-nav" className={`nav${open ? ' is-open' : ''}`} aria-label="Main">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => `nav__link${isActive ? ' is-active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/donate" className="btn btn--primary btn--sm"><Heart aria-hidden="true" /> Donate</Link>
          </nav>
        </div>
      </header>
    </>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <span className="stripe" />
      <div className="container footer__top">
        <div>
          <div className="footer__brand">
            <img src="/media/logo.webp" alt="" width="56" height="56" loading="lazy" />
            <strong>iLead Youth<br />Empower Africa</strong>
          </div>
          <p>{site.tagline}. A registered, non-governmental and non-sectarian organisation empowering children and young leaders across Africa.</p>
          <SocialLinks />
        </div>

        <div>
          <h3>Explore</h3>
          <ul>
            {[...nav, { to: '/donate', label: 'Donate' }].map((n) => (
              <li key={n.to}><Link to={n.to}>{n.label}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h3>Get in touch</h3>
          <ul className="footer__contact">
            <li><MapPin aria-hidden="true" /><span>{site.address.join(', ')}</span></li>
            {site.phones.map((p) => (
              <li key={p.tel}><Phone aria-hidden="true" /><a href={`tel:${p.tel}`}>{p.label}</a></li>
            ))}
            <li><Mail aria-hidden="true" /><a href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
        </div>

        <div>
          <h3>Stay in the loop</h3>
          <p>Occasional updates on our outreaches and how your support is used.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {site.name}. CAC {site.cac}. All rights reserved.</span>
        <nav aria-label="Legal"><Link to="/privacy">Privacy policy</Link></nav>
      </div>
    </footer>
  );
}

export default function Layout({ children }) {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <Header />
      <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  );
}
