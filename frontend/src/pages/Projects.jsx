import { useState } from 'react';
import { Img, PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { DonateBand, PressFeature } from '../components/Blocks.jsx';
import Gallery from '../components/Gallery.jsx';
import useMeta from '../lib/useMeta.js';
import { outreach2026, outreachEarlier, videos } from '../data/content.js';
import { videoSrc, posterSrc } from '../lib/media.js';

const TABS = [
  { id: 'latest', label: '#MakeItEasy outreach', items: outreach2026 },
  { id: 'earlier', label: 'Earlier outreaches', items: outreachEarlier },
];

export default function Projects() {
  useMeta('Projects', 'Photos and videos from iLead’s school outreaches across Nigeria, including the latest #MakeItEasy outreach in Ajegunle, Lagos.', '/projects');
  const [tab, setTab] = useState('latest');
  const current = TABS.find((t) => t.id === tab);

  return (
    <>
      <PageHero eyebrow="Our projects" title={<>Seeing is <em className="accent">believing</em></>}>
        Every outreach starts with a simple idea: a child who has what they need to learn can go on to lead. Here is what that looks like on the ground.
      </PageHero>

      <section className="section">
        <div className="container">
          <div className="split" style={{ marginBottom: 'clamp(40px,6vw,72px)' }}>
            <Reveal>
              <p className="eyebrow">Latest outreach</p>
              <h2>#MakeItEasy <em className="accent">School Outreach</em></h2>
              <p className="lead" style={{ margin: '22px 0 0' }}>
                Held in Ajeromi Local Government Area, Ajegunle, Lagos, this outreach supports children from low-income families to stay
                in school. It brought together mentorship, leadership training, workshops, motivational talks and the distribution of
                school materials, including branded #MakeItEasy books, for the young people who will lead tomorrow.
              </p>
            </Reveal>
            <Reveal delay={0.1} className="split__media">
              <div className="frame frame--wide">
                <Img name="mie-07" alt="The iLead outreach team in #MakeItEasy shirts" eager sizes="(max-width: 860px) 100vw, 560px" style={{ objectPosition: '50% 40%' }} />
              </div>
            </Reveal>
          </div>

          <div role="tablist" aria-label="Photo galleries" className="tabs">
            {TABS.map((t) => (
              <button key={t.id} role="tab" type="button" className="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)}>
                {t.label}
              </button>
            ))}
          </div>
          <div role="tabpanel">
            <Gallery key={current.id} items={current.items} />
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="In the news" title={<>Covered by <em className="accent">the press</em></>} />
          <PressFeature />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Videos" title={<>Hear it from <em className="accent">the field</em></>} />
          <div className="videos">
            {videos.map((v, i) => (
              <Reveal key={v.name} delay={i * 0.07} className="video">
                <video controls preload="none" playsInline poster={posterSrc(v.name)} aria-label={v.title}>
                  <source src={videoSrc(v.name)} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
                <div className="video__body"><h3>{v.title}</h3><p>{v.caption}</p></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <DonateBand />
    </>
  );
}
