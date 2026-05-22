import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaCode } from 'react-icons/fa';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home',       to: 'hero'       },
  { label: 'About',      to: 'about'      },
  { label: 'Skills',     to: 'skills'     },
  { label: 'Projects',   to: 'projects'   },
  { label: 'Experience', to: 'experience' },
  { label: 'Contact',    to: 'contact'    },
];

const Navbar = () => {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  /* ── Scroll handler ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ── Lock body scroll when menu open ── */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navVariants = {
    hidden:  { y: -80, opacity: 0 },
    visible: { y: 0,   opacity: 1, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const menuVariants = {
    hidden:  { x: '100%', opacity: 0 },
    visible: { x: 0,      opacity: 1, transition: { duration: 0.35, ease: 'easeOut' } },
    exit:    { x: '100%', opacity: 0, transition: { duration: 0.28, ease: 'easeIn'  } },
  };

  const itemVariants = {
    hidden:  { opacity: 0, x: 30 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.07, duration: 0.3 } }),
  };

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="navbar__inner container">

        {/* ── Logo ── */}
        <Link to="hero" smooth duration={700} className="navbar__logo">
          <FaCode className="navbar__logo-icon" />
          <span className="navbar__logo-text">
            <span className="navbar__logo-first">MU</span>
            <span className="navbar__logo-dot">.</span>
          </span>
        </Link>

        {/* ── Desktop links ── */}
        <ul className="navbar__links">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                smooth
                duration={700}
                offset={-80}
                spy
                onSetActive={() => setActiveSection(to)}
                className={`navbar__link ${activeSection === to ? 'navbar__link--active' : ''}`}
              >
                {label}
                <span className="navbar__link-bar" />
              </Link>
            </li>
          ))}
        </ul>

        {/* ── CTA ── */}
        <a
          href="#contact"
          className="navbar__cta"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          Hire Me
        </a>

        {/* ── Hamburger ── */}
        <button
          className="navbar__hamburger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="navbar__mobile"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <ul className="navbar__mobile-links">
              {NAV_LINKS.map(({ label, to }, i) => (
                <motion.li
                  key={to}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <Link
                    to={to}
                    smooth
                    duration={700}
                    offset={-80}
                    className="navbar__mobile-link"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="navbar__mobile-num">0{i + 1}.</span>
                    {label}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
