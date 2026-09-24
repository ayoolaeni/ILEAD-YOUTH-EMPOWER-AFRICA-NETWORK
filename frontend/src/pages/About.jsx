import { Link } from 'react-router-dom';
import { ArrowRight, Eye, Target, Users } from 'lucide-react';
import { Img, PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { Icon, DonateBand } from '../components/Blocks.jsx';
import useMeta from '../lib/useMeta.js';
import { site } from '../data/site.js';
import { objectives, structure } from '../data/content.js';

export default function About() {
  useMeta('About us', 'Learn about iLead Youth Empower Africa Network: our story since 2018, our vision and mission, our objectives and how we are governed.', '/about');

  return (
    <>
      <PageHero eyebrow="About us" title={<>Empowering Africa’s young people <em className="accent">through education</em></>}>
        A non-governmental, non-sectarian organisation transforming African societies through a holistic approach to education and the strategic use of media.
      </PageHero>

      {/* STORY */}
      <section className="section">
        <div className="container split">
          <Reveal className="split__media">
            <div className="frame frame--wide">
              <Img name="earlier-01" alt="Children and volunteers gathered at an iLead community outreach" sizes="(max-width: 860px) 100vw, 560px" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Our story</p>
            <h2>Who is <em className="accent">iLead?</em></h2>
            <p className="lead" style={{ margin: '22px 0 18px' }}>
              iLead Youth Empower Africa Network is committed to the development of children and young people, building
              capacity, promoting leadership and providing humanitarian services to underprivileged communities across Africa.
            </p>
            <p>
              Since our inception in {site.founded}, we have grown into a vibrant network of passionate people united by one
              belief: young people, empowered through education, can change their communities. Through our flagship Global
              Youth Initiative, we have reached underserved rural communities across six states in Nigeria, providing essential
              educational materials and support to more than 3,200 primary and secondary school students.
            </p>
            <p>
              Beyond improving access to learning resources, the initiative has strengthened educational outcomes, nurtured
              leadership potential and inspired a new generation of young people to become active agents of positive change.
            </p>
          </Reveal>
        </div>
      </section>

      {/* MAIN OBJECTIVE */}
      <section className="section section--ink">
        <div className="container container--narrow" style={{ textAlign: 'center' }}>
          <Reveal>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Main objective</p>
            <h2 style={{ marginBottom: 26 }}>Education for the <em className="accent">whole person</em></h2>
            <p style={{ fontSize: '1.25rem', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              We strive to provide a holistic approach to education that combines academic, personal and career development,
              helping young people reach their full potential. We also expose students to the right ethics and values, and to
              new ideas and innovations that help them make a positive impact in their communities.
            </p>
          </Reveal>
        </div>
      </section>

      {/* VISION / MISSION */}
      <section className="section">
        <div className="container">
          <div className="duo">
            <Reveal className="statement" style={{ '--c': 'var(--orange)' }}>
              <span className="icon-badge"><Eye aria-hidden="true" /></span>
              <h3>Vision statement</h3>
              <p>To inspire, educate and empower young boys and girls, guiding them to become leaders of character, substantial contributors to, and respected representatives of their local, national and international communities.</p>
            </Reveal>
            <Reveal className="statement" delay={0.1} style={{ '--c': 'var(--sky)' }}>
              <span className="icon-badge"><Target aria-hidden="true" /></span>
              <h3>Mission statement</h3>
              <p>To foster a leadership network among young people by engaging in humanitarian service and providing a streamlined learning platform, cultivating the skills needed to deliver exceptional service across diverse communities in Africa.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* OBJECTIVES */}
      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="Specific objectives" title={<>What we have committed <em className="accent">to achieve</em></>} />
          <div className="pillars">
            {objectives.map((o, i) => (
              <Reveal key={o.title} delay={(i % 2) * 0.1} className="pillar">
                <span className="icon-badge" style={{ '--c': ['var(--orange)', 'var(--sky)', 'var(--green)', 'var(--navy)'][i % 4] }}>
                  <Icon name={o.icon} />
                </span>
                <h3>{o.title}</h3>
                <ul>{o.items.map((t) => <li key={t}>{t}</li>)}</ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* GOVERNANCE */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Governance" title={<>Transparent and <em className="accent">accountable</em></>} center>
            iLead operates under a governance structure designed for effective leadership, sound decision-making and efficient programme delivery.
          </SectionHead>
          <Reveal className="org">
            <div className="org__node org__node--top">
              <h3>{structure.board.title}</h3>
              <p>{structure.board.text}</p>
            </div>
            <span className="org__link" />
            <div className="org__node org__node--exec">
              <h3>{structure.exec.title}</h3>
              <p>{structure.exec.text}</p>
            </div>
            <span className="org__link" />
            <div className="org__depts">
              {structure.departments.map((d) => <span key={d}>{d}</span>)}
            </div>
            <span className="org__link" />
            <div className="org__node">
              <h3>{structure.grassroots.title}</h3>
              <p>{structure.grassroots.text}</p>
            </div>
            <p className="org__side"><Users aria-hidden="true" /> {structure.advisory}</p>
          </Reveal>
        </div>
      </section>

      {/* FACTS */}
      <section className="section section--white">
        <div className="container">
          <SectionHead eyebrow="At a glance" title="Registration & credentials" />
          <Reveal>
            <dl className="facts">
              <div className="fact"><dt>Organisation</dt><dd>{site.name}</dd></div>
              <div className="fact"><dt>CAC registration</dt><dd>{site.cac}</dd></div>
              <div className="fact"><dt>Registered</dt><dd>{site.registered}</dd></div>
              <div className="fact"><dt>Founded</dt><dd>{site.founded}</dd></div>
              <div className="fact"><dt>Founder / Convener</dt><dd>Joshua Okolo</dd></div>
              <div className="fact"><dt>Outreaches / States</dt><dd>7 / 6</dd></div>
              <div className="fact"><dt>Students reached</dt><dd>3,200+</dd></div>
              <div className="fact"><dt>Office</dt><dd style={{ fontSize: '1rem' }}>{site.address.join(', ')}</dd></div>
            </dl>
          </Reveal>
          <div style={{ marginTop: 36 }}>
            <Link to="/team" className="link-arrow">Meet our team and Advisory Board <ArrowRight aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <DonateBand />
    </>
  );
}
