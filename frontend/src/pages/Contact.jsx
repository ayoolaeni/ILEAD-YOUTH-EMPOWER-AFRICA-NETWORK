import { MapPin, Phone, Mail } from 'lucide-react';
import { PageHero, Reveal } from '../components/ui.jsx';
import ContactForm from '../components/ContactForm.jsx';
import SocialLinks from '../components/SocialLinks.jsx';
import useMeta from '../lib/useMeta.js';
import { site } from '../data/site.js';

export default function Contact() {
  useMeta('Contact us', 'Get in touch with iLead Youth Empower Africa Network to volunteer, partner, sponsor an outreach or ask a question.', '/contact');
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`;

  return (
    <>
      <PageHero eyebrow="Contact us" title={<>Let’s build something <em className="accent">together</em></>}>
        Whether you want to volunteer, partner, sponsor an outreach or simply ask a question, we would love to hear from you.
      </PageHero>

      <section className="section">
        <div className="container contact-grid">
          <Reveal><ContactForm /></Reveal>

          <Reveal delay={0.1}>
            <div className="info-cards">
              <a className="info" href={mapLink} target="_blank" rel="noopener noreferrer">
                <span className="icon-badge" style={{ '--c': 'var(--orange)' }}><MapPin aria-hidden="true" /></span>
                <div><h3>Visit us</h3><p>{site.address.join(', ')}</p></div>
              </a>
              <div className="info">
                <span className="icon-badge" style={{ '--c': 'var(--green)' }}><Phone aria-hidden="true" /></span>
                <div>
                  <h3>Call us</h3>
                  <p>{site.phones.map((p, i) => <span key={p.tel}>{i > 0 && <br />}<a href={`tel:${p.tel}`}>{p.label}</a></span>)}</p>
                </div>
              </div>
              <div className="info">
                <span className="icon-badge" style={{ '--c': 'var(--sky)' }}><Mail aria-hidden="true" /></span>
                <div><h3>Email us</h3><p><a href={`mailto:${site.email}`}>{site.email}</a></p></div>
              </div>
              <div className="info" style={{ alignItems: 'center' }}>
                <div style={{ flex: 1 }}><h3>Follow our work</h3><p>Photos and stories from every outreach.</p></div>
                <SocialLinks style={{ margin: 0, flexWrap: 'wrap' }} linkStyle={{ background: 'var(--ink)' }} />
              </div>
            </div>
            <div className="map">
              <iframe title={`Map showing ${site.address.join(', ')}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
