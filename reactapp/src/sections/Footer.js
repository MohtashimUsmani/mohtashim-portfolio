import React from 'react';
import { Link } from 'react-scroll';
import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart, FaCode, FaEnvelope } from 'react-icons/fa';
import useApiData from '../hooks/useApiData';
import './Footer.css';

const LINKS = [
  { label: 'About',      to: 'about'      },
  { label: 'Skills',     to: 'skills'     },
  { label: 'Projects',   to: 'projects'   },
  { label: 'Experience', to: 'experience' },
  { label: 'Contact',    to: 'contact'    },
];

const SOCIALS = [
  { icon: <FaGithub />,   href: 'https://github.com',   label: 'GitHub'   },
  { icon: <FaLinkedin />, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: <FaTwitter />,  href: 'https://twitter.com',  label: 'Twitter'  },
];

const SOCIAL_ICON_MAP = {
  github: <FaGithub />,
  linkedin: <FaLinkedin />,
  twitter: <FaTwitter />,
  email: <FaEnvelope />,
};

const Footer = () => {
  const refreshOptions = { pollIntervalMs: 15000, refetchOnFocus: true };
  const { data: aboutData } = useApiData('/about/', null, refreshOptions);
  const { data: socialData } = useApiData('/social/', [], refreshOptions);
  const about = aboutData && aboutData.id ? aboutData : null;
  const socials = Array.isArray(socialData) && socialData.length
    ? socialData.map((item) => ({
        icon: SOCIAL_ICON_MAP[item.platform] || <FaCode />,
        href: item.platform === 'email' ? `mailto:${item.url.replace(/^mailto:/, '')}` : item.url,
        label: item.label || item.platform_display,
      }))
    : SOCIALS;
  const tagline = about?.role_line || 'Data Scientist · Full Stack Developer · Python Developer';
  const statusLabel = about?.is_available ? 'Open to opportunities' : 'Currently unavailable';
  const brandName = about?.name || 'Mohtashim Usmani';
  const contactEmail = about?.email || 'mohtashimusmani09@gmail.com';

  return (
    <footer className="footer">
      {/* Glow top line */}
      <div className="footer__top-line" />

      <div className="container footer__inner">

        {/* ── Brand ── */}
        <div className="footer__brand">
          <div className="footer__logo">
            <FaCode className="footer__logo-icon" />
            <span className="footer__logo-text">{brandName}</span>
          </div>
          <p className="footer__tagline">{tagline}</p>
          <div className="footer__status">
            <span className="footer__status-dot" />
            <span>{statusLabel}</span>
          </div>
        </div>

        {/* ── Nav links ── */}
        <nav className="footer__nav">
          <p className="footer__nav-title">Navigation</p>
          <ul className="footer__nav-list">
            {LINKS.map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  smooth
                  duration={700}
                  offset={-80}
                  className="footer__nav-link"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* ── Socials ── */}
        <div className="footer__connect">
          <p className="footer__nav-title">Connect</p>
          <div className="footer__socials">
            {socials.map(({ icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label={label}
                whileHover={{ scale: 1.15, y: -3 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                {icon}
              </motion.a>
            ))}
          </div>
          <p className="footer__contact-cta">
            Want to work together?<br />
            <a href={`mailto:${contactEmail}`} className="footer__email">
              {contactEmail}
            </a>
          </p>
        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {new Date().getFullYear()} {brandName}. All rights reserved.
          </p>
          <p className="footer__made">
            Built with <FaHeart className="footer__heart" /> using React &amp; Django
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
