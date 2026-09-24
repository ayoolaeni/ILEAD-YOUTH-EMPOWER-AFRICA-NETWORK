import { PageHero } from '../components/ui.jsx';
import useMeta from '../lib/useMeta.js';
import { site } from '../data/site.js';

export default function Privacy() {
  useMeta('Privacy policy', 'How iLead Youth Empower Africa Network collects, uses and protects your personal information.', '/privacy');
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy">
        How we handle the information you share with us.
      </PageHero>
      <section className="section">
        <div className="container container--narrow prose">
          <p><strong>Last updated:</strong> September 2026</p>
          <p>
            {site.name} (“iLead”, “we”) respects your privacy. This page explains what personal information this website collects and how we use it.
          </p>

          <h2>What we collect</h2>
          <ul>
            <li><strong>Contact form:</strong> your name, email address, optional phone number, the type of enquiry and your message.</li>
            <li><strong>Newsletter:</strong> your email address.</li>
            <li><strong>Technical data:</strong> for security and to prevent spam, our server briefly records your IP address when you submit a form.</li>
          </ul>

          <h2>How we use it</h2>
          <ul>
            <li>To reply to your enquiry, volunteer offer, partnership or donation query.</li>
            <li>To send occasional updates about our work, if you subscribed. You can ask us to stop at any time.</li>
            <li>To keep the website secure and free of spam.</li>
          </ul>

          <h2>Sharing and storage</h2>
          <p>
            We do not sell or rent your information. Messages are delivered to our team by email and stored on our web server, which is
            hosted in a secured environment. We only share information where the law requires it.
          </p>

          <h2>Cookies and tracking</h2>
          <p>This website does not use advertising or tracking cookies.</p>

          <h2>Your rights</h2>
          <p>
            Under the Nigeria Data Protection Act 2023 you may ask to access, correct or delete the personal information we hold about
            you. Email us at <a href={`mailto:${site.email}`}>{site.email}</a> and we will respond promptly.
          </p>

          <h2>Photos of children</h2>
          <p>
            Photographs and videos of our outreaches are published to show our work. If you are a parent or guardian and would like an image
            removed, please contact us and we will take it down.
          </p>

          <h2>Contact</h2>
          <p>{site.name}, {site.address.join(', ')}. Email: <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
        </div>
      </section>
    </>
  );
}
