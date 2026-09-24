import { Facebook, Instagram, Linkedin, Twitter, Youtube } from 'lucide-react';
import { site } from '../data/site.js';

const icons = { facebook: Facebook, instagram: Instagram, youtube: Youtube, linkedin: Linkedin, twitter: Twitter };

/** Round social icons for every profile listed in site.social. */
export default function SocialLinks({ style, linkStyle }) {
  return (
    <div className="socials" style={style}>
      {site.social.map((s) => {
        const Icon = icons[s.key];
        return (
          <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label} style={linkStyle}>
            <Icon aria-hidden="true" />
          </a>
        );
      })}
    </div>
  );
}
