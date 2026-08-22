import React from 'react';
import { Link } from 'react-router-dom';
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaGlobe,
  FaLink,
  FaUsers,
  FaWhatsapp,
} from 'react-icons/fa';
import { collectBusinessSocialLinks, platformMeta } from '../../utils/businessSocial';

const ICONS = {
  hub: FaUsers,
  facebook: FaFacebook,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
  globe: FaGlobe,
  link: FaLink,
  tiktok: FaGlobe,
};

/**
 * Social links for a business: WWA Social Hub + any sites the business added
 * (Facebook, Instagram, carservicesltd.com, etc.).
 */
const BusinessSocialLinks = ({
  business,
  social = null,
  title = 'Social & websites',
  className = '',
}) => {
  const links = collectBusinessSocialLinks(business, social);
  if (!links.length) return null;

  return (
    <div className={className}>
      {title ? (
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2 text-left">
          {title}
        </p>
      ) : null}
      <ul className="flex flex-wrap gap-2">
        {links.map((item) => {
          const meta = platformMeta(item.platform);
          const Icon = ICONS[meta.icon] || FaLink;
          const label = item.label || meta.label;
          const chipClass =
            item.platform === 'wwa_hub'
              ? 'border-indigo-200 bg-indigo-50 text-indigo-800 hover:bg-indigo-100'
              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50';

          const content = (
            <>
              <Icon className="h-3.5 w-3.5 shrink-0 opacity-80" />
              <span className="truncate max-w-[10rem]">{label}</span>
            </>
          );

          if (item.internal) {
            return (
              <li key={`${item.platform}-${item.url}`}>
                <Link
                  to={item.url}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${chipClass}`}
                >
                  {content}
                </Link>
              </li>
            );
          }

          return (
            <li key={`${item.platform}-${item.url}`}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${chipClass}`}
              >
                {content}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BusinessSocialLinks;
