import { Link } from 'react-router-dom';
import { ArrowRight, BadgeCheck, CalendarDays, MapPinned, Newspaper, Users, Eye, Target, Check } from 'lucide-react';
import { Img, Reveal, SectionHead, Counter } from '../components/ui.jsx';
import { ProgramsGrid, GetInvolved, PressFeature } from '../components/Blocks.jsx';
import useMeta from '../lib/useMeta.js';
import { site, stats } from '../data/site.js';
import { leadership } from '../data/team.js';

export default function Home() {
  useMeta('', 'iLead Youth Empower Africa Network is a registered Nigerian NGO empowering children and young leaders through education, media and humanitarian service. 3,200+ students reached across six states.', '/');

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="container hero__grid">
          <div>
            <Reveal y={16}>
              <p className="eyebrow">Registered NGO · Lagos, Nigeria</p>
              <h1>
                Building a generation <em className="accent">for excellence.</em>
              </h1>
              <p className="lead">
                iLead Youth Empower Africa Network champions education, leadership and humanitarian service for children and
                young people in underserved African communities.
              </p>
              <div className="hero__cta">
                <Link to="/donate" className="btn btn--primary">Donate today <ArrowRight className="arrow" aria-hidden="true" /></Link>
                <Link to="/projects" className="btn btn--ghost">See our work</Link>
              </div>
            </Reveal>
            <ul className="trust">
              <li><BadgeCheck aria-hidden="true" /> CAC registered · {site.cac}</li>
              <li><CalendarDays aria-hidden="true" /> Serving communities since {site.founded}</li>
              <li><MapPinned aria-hidden="true" /> Active in 6 Nigerian states</li>
              <li><Newspaper aria-hidden="true" /> Featured in Tribune Online</li>
            </ul>
          </div>

          <Reveal delay={0.15} y={30}>
            <div className="mosaic">
              <div className="mosaic__cell mosaic__a">
                <Img name="mie-05" alt="A volunteer helping a pupil with a learning book at an iLead school outreach" eager sizes="(max-width: 920px) 60vw, 320px" style={{ objectPosition: '50% 30%' }} />
              </div>
              <div className="mosaic__cell mosaic__b">
                <Img name="mie-11" alt="A pupil holding up her new book beside a volunteer" eager sizes="(max-width: 920px) 40vw, 260px" style={{ objectPosition: '40% 40%' }} />
              </div>
              <div className="mosaic__cell mosaic__c">
                <Img name="mie-03" alt="Volunteers and pupils posing together after the outreach" sizes="(max-width: 920px) 40vw, 260px" style={{ objectPosition: '50% 35%' }} />
              </div>
              <div className="mosaic__badge">
                <span className="mosaic__badge-icon"><Users aria-hidden="true" /></span>
                <div><strong>3,200+</strong><span>students reached</span></div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* IMPACT NUMBERS */}
      <section className="stats" aria-label="Our impact in numbers">
        <span className="stripe" />
        <div className="container stats__grid">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat__num"><Counter to={s.value} suffix={s.suffix} plain={s.plain} /></div>
              <div className="stat__label">{s.label}</div>
              <div className="stat__note">{s.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="section">
        <div className="container split">
          <Reveal className="split__media">
            <div className="frame frame--tall">
              <Img name="about-classroom" alt="Pupils in a classroom during an iLead education outreach" sizes="(max-width: 860px) 100vw, 560px" style={{ objectPosition: '38% 50%' }} />
            </div>
            <div className="float-card"><strong>7</strong>school outreaches delivered so far across six states.</div>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">Who we are</p>
            <h2>A network of young people who believe <em className="accent">education changes everything.</em></h2>
            <p className="lead" style={{ margin: '22px 0 0' }}>
              iLead is a non-governmental, non-sectarian community organisation. We use a holistic approach to education and the
              strategic power of media to build capacity, promote leadership and deliver humanitarian service to underprivileged
              communities across Africa.
            </p>
            <ul className="checks">
              <li><Check aria-hidden="true" /> Stationery and learning materials for over 3,200 pupils</li>
              <li><Check aria-hidden="true" /> Leadership and character training for young people</li>
              <li><Check aria-hidden="true" /> Transparent governance with an independent Advisory Board</li>
            </ul>
            <Link to="/about" className="link-arrow">Read our story <ArrowRight aria-hidden="true" /></Link>
          </Reveal>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="What we do" title={<>Four ways we <em className="accent">empower</em> communities</>}>
            From the classroom to the community, our programmes work together so children and young leaders can thrive.
          </SectionHead>
          <ProgramsGrid />
        </div>
      </section>

      {/* FEATURED OUTREACH */}
      <section className="section">
        <div className="container">
          <Reveal className="feature">
            <div className="feature__text">
              <p className="eyebrow">Latest outreach</p>
              <h2>#MakeItEasy school outreach</h2>
              <div className="tags"><span>Ajeromi LGA, Ajegunle</span><span>Learning materials</span><span>Volunteer-led</span></div>
              <p>
                Our volunteers went into the community with one goal: to make learning easier for children who need it most.
                Pupils left with branded #MakeItEasy books, encouragement and a reminder that someone believes in them.
              </p>
              <div><Link to="/projects" className="btn btn--primary">See the photos &amp; videos <ArrowRight className="arrow" aria-hidden="true" /></Link></div>
            </div>
            <div className="feature__media">
              <Img name="mie-04" alt="Pupils and volunteers holding up #MakeItEasy books" sizes="(max-width: 900px) 50vw, 300px" />
              <Img name="mie-09" alt="Pupils in blue uniforms holding their books" sizes="(max-width: 900px) 50vw, 300px" style={{ objectPosition: '50% 30%' }} />
              <Img name="mie-13" alt="A volunteer with children showing their new books" sizes="(max-width: 900px) 50vw, 300px" style={{ objectPosition: '50% 30%' }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* IN THE PRESS */}
      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="In the news" title={<>Our work, <em className="accent">in the headlines</em></>} />
          <PressFeature />
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="section section--white">
        <div className="container">
          <SectionHead eyebrow="Vision & mission" title={<>Where we are going, and <em className="accent">how we get there</em></>} center />
          <div className="duo">
            <Reveal className="statement" style={{ '--c': 'var(--orange)' }}>
              <span className="icon-badge"><Eye aria-hidden="true" /></span>
              <h3>Our vision</h3>
              <p>To inspire, educate and empower young boys and girls, guiding them to become leaders of character, substantial contributors to, and respected representatives of their local, national and international communities.</p>
            </Reveal>
            <Reveal className="statement" delay={0.1} style={{ '--c': 'var(--sky)' }}>
              <span className="icon-badge"><Target aria-hidden="true" /></span>
              <h3>Our mission</h3>
              <p>To foster a leadership network among young people by engaging in humanitarian service and providing a streamlined learning platform, cultivating the skills needed to deliver exceptional service across diverse communities in Africa.</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TEAM PREVIEW */}
      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Leadership" title={<>The people <em className="accent">behind iLead</em></>} center>
            A committed team of professionals and young leaders, guided by an independent Advisory Board.
          </SectionHead>
          <div className="team-mini">
            {leadership.map((m, i) => (
              <Reveal key={m.id} delay={i * 0.06} className="mini">
                <Link to="/team" aria-label={`${m.name}, ${m.role}`}>
                  <div className="mini__photo"><Img name={m.photo} alt="" sizes="180px" style={{ objectPosition: m.position }} /></div>
                  <strong>{m.name}</strong>
                  <span>{m.role}</span>
                </Link>
              </Reveal>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link to="/team" className="btn btn--ghost">Meet the full team <ArrowRight className="arrow" aria-hidden="true" /></Link>
          </div>
        </div>
      </section>

      <GetInvolved />
    </>
  );
}
