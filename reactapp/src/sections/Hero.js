import React, { useCallback, useMemo } from 'react';
import { TypeAnimation } from 'react-type-animation';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FaChevronDown, FaGithub, FaLinkedin } from 'react-icons/fa';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import './Hero.css';
import useApiData from '../hooks/useApiData';

const Hero = () => {
  const refreshOptions = { pollIntervalMs: 15000, refetchOnFocus: true };
  const { data: aboutData } = useApiData('/about/', null, refreshOptions);
  const { data: socialData } = useApiData('/social/', [], refreshOptions);
  const about = aboutData && aboutData.id ? aboutData : null;

  const normalizeList = (value, fallback = []) => {
    if (Array.isArray(value) && value.length) {
      return value
        .map((item) => {
          if (typeof item === 'string') return item;
          if (item && typeof item.label === 'string') return item.label;
          if (item && typeof item.title === 'string') return item.title;
          return '';
        })
        .filter(Boolean);
    }
    if (typeof value === 'string') {
      const parsed = value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
      return parsed.length ? parsed : fallback;
    }
    return fallback;
  };

  const defaultRoles = [
    'Data Scientist',
    'Full Stack Web Developer',
    'Python Developer',
    'ML Engineer',
  ];
  const roles = about?.role_line
    ? about.role_line
        .split(/[·,/|]/)
        .map((item) => item.trim())
        .filter(Boolean)
    : defaultRoles;
  const roleSequence = roles.flatMap((role) => [role, 1800]);
  const greeting = "Hello, World! I'm";
  const displayName = about?.name || 'Mohtashim Usmani';
  const nameParts = displayName.split(' ');
  const firstName = nameParts[0] || displayName;
  const lastName = nameParts.slice(1).join(' ');
  const subCopy = about?.bio_paragraph_1
    || 'I build intelligent systems and beautiful interfaces — turning data into decisions and ideas into products.';
  const githubUrl = socialData?.find((item) => item.platform === 'github')?.url || 'https://github.com';
  const linkedinUrl = socialData?.find((item) => item.platform === 'linkedin')?.url || 'https://linkedin.com';
  const isAvailable = about?.is_available ?? true;

  const codeTags = normalizeList(about?.code_tags, ['import sklearn', 'npm run build', 'django runserver']);
  const randomRange = (min, max) => Math.random() * (max - min) + min;
  const codeTagStyles = useMemo(() => {
    return codeTags.map(() => {
      const top = `${Math.round(randomRange(8, 78))}%`;
      const left = `${Math.round(randomRange(0, 80))}%`;
      const duration = `${randomRange(10, 18).toFixed(2)}s`;
      const delay = `${randomRange(-10, 0).toFixed(2)}s`;
      const floatX = `${randomRange(-28, 28).toFixed(1)}px`;
      const floatY = `${randomRange(-22, 22).toFixed(1)}px`;
      const rotate = `${randomRange(-3, 3).toFixed(1)}deg`;
      return {
        top,
        left,
        animationDuration: duration,
        animationDelay: delay,
        '--float-x': floatX,
        '--float-y': floatY,
        '--float-rotate': rotate,
      };
    });
  }, [codeTags]);

  /* ── tsParticles ── */
  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesOptions = {
    background:    { color: { value: 'transparent' } },
    fpsLimit:      60,
    interactivity: {
      events: {
        onHover: { enable: true, mode: 'repulse' },
        onClick: { enable: true, mode: 'push'    },
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 },
        push:    { quantity: 3                   },
      },
    },
    particles: {
      color: { value: ['#720137', '#590054', '#FF1744', '#AA00FF'] },
      links: {
        color:   '#720137',
        distance: 140,
        enable:   true,
        opacity:  0.18,
        width:    1,
      },
      collisions: { enable: false },
      move: {
        direction: 'none',
        enable:    true,
        outModes:  { default: 'bounce' },
        random:    false,
        speed:     0.8,
        straight:  false,
      },
      number: { density: { enable: true, area: 900 }, value: 60 },
      opacity: { value: 0.35, random: { enable: true, minimumValue: 0.1 } },
      shape:   { type: 'circle' },
      size:    { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  /* ── Animation variants ── */
  const containerVariants = {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.3 } },
  };

  const itemVariants = {
    hidden:  { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  return (
    <section className="hero" id="hero">

      {/* ── Particles ── */}
      <Particles
        id="tsparticles"
        className="hero__particles"
        init={particlesInit}
        options={particlesOptions}
      />

      {/* ── Animated blobs ── */}
      <div className="hero__blob hero__blob--1" />
      <div className="hero__blob hero__blob--2" />
      <div className="hero__blob hero__blob--3" />

      {/* ── Grid overlay ── */}
      <div className="hero__grid" />

      {/* ── Scan line ── */}
      <div className="hero__scanline" />

      {/* ── Content ── */}
      <div className="container hero__container">
        <motion.div
          className="hero__content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div className="hero__badge" variants={itemVariants}>
            <span className="hero__badge-dot" />
            <span>{isAvailable ? 'Available for hire' : 'Currently unavailable'}</span>
          </motion.div>

          {/* Greeting */}
          <motion.p className="hero__greeting" variants={itemVariants}>
            {greeting}
          </motion.p>

          {/* Name */}
          <motion.h1 className="hero__name" variants={itemVariants}>
            <span className="hero__name-first">{firstName}</span>
             <br />
            <span className="hero__name-last">{lastName || ''}</span>
          </motion.h1>

          {/* Typing effect */}
          <motion.div className="hero__role" variants={itemVariants}>
            <span className="hero__role-prefix">&gt;_ </span>
            <TypeAnimation
              sequence={roleSequence}
              wrapper="span"
              speed={50}
              repeat={Infinity}
              className="hero__role-text"
            />
          </motion.div>

          {/* Sub copy */}
          <motion.p className="hero__sub" variants={itemVariants}>
            {subCopy}
          </motion.p>

          {/* Buttons removed as requested */}

          {/* Social links */}
          <motion.div className="hero__socials" variants={itemVariants}>
            <a href={githubUrl} target="_blank" rel="noreferrer" className="hero__social-link" aria-label="GitHub">
              <FaGithub />
            </a>
            <a href={linkedinUrl} target="_blank" rel="noreferrer" className="hero__social-link" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <div className="hero__social-line" />
          </motion.div>
        </motion.div>

        {/* ── Right decoration ── */}
        <motion.div
          className="hero__decoration"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <div className="hero__orb">
            <div className="hero__orb-inner">
              <span className="hero__orb-text">MU</span>
            </div>
            <div className="hero__orb-ring hero__orb-ring--1" />
            <div className="hero__orb-ring hero__orb-ring--2" />
            <div className="hero__orb-ring hero__orb-ring--3" />
            {/* Orbiting dot */}
            <div className="hero__orb-dot hero__orb-dot--1" />
            <div className="hero__orb-dot hero__orb-dot--2" />
          </div>

          {/* Floating code snippet */}
          {codeTags.map((tag, index) => {
            const position = codeTagStyles[index % codeTagStyles.length];
            return (
              <div
                key={`${tag}-${index}`}
                className="hero__code-tag"
                style={position}
              >
                <code>{tag}</code>
              </div>
            );
          })}
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        className="hero__scroll"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 0.6 }}
      >
        <span className="hero__scroll-label">Scroll Down</span>
        <Link to="about" smooth duration={700} offset={-80}>
          <div className="hero__scroll-icon">
            <FaChevronDown />
          </div>
        </Link>
      </motion.div>
    </section>
  );
};

export default Hero;
