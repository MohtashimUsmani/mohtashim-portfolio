import React from 'react';
import { motion } from 'framer-motion';
import {
  FaPython, FaReact, FaDatabase, FaBrain,
  FaChartLine, FaCode
} from 'react-icons/fa';
import { SiDjango } from 'react-icons/si';
import SectionTitle from '../components/SectionTitle';
import useApiData from '../hooks/useApiData';
import './About.css';

const DEFAULT_STATS = [
  { value: '3+',  label: 'Years Experience' },
  { value: '15+', label: 'Projects Built'   },
  { value: '5+',  label: 'ML Models'        },
  { value: '10+', label: 'Tech Stack'        },
];

const DEFAULT_HIGHLIGHTS = [
  { iconKey: 'python',   label: 'Python Expert'        },
  { iconKey: 'ml',       label: 'Machine Learning'     },
  { iconKey: 'react',    label: 'React Frontend'       },
  { iconKey: 'django',   label: 'Django Backend'       },
  { iconKey: 'database', label: 'Database Design'      },
  { iconKey: 'chart',    label: 'Data Analytics'       },
];

const ICON_MAP = {
  python: <FaPython />,
  ml: <FaBrain />,
  react: <FaReact />,
  django: <SiDjango />,
  database: <FaDatabase />,
  chart: <FaChartLine />,
  code: <FaCode />,
};

const About = () => {
  const { data: aboutData } = useApiData('/about/', null, { pollIntervalMs: 15000, refetchOnFocus: true });
  const about = aboutData && aboutData.id ? aboutData : null;
  const stats = about?.stats?.length
    ? [...about.stats].sort((a, b) => a.order - b.order)
    : DEFAULT_STATS;
  const aboutBody = about
    ? [about.bio_paragraph_1, about.bio_paragraph_2, about.bio_paragraph_3].filter(Boolean).join('\n\n')
    : "I'm Mohtashim Usmani — a Data Scientist, Full Stack Web Developer, and Python enthusiast with a deep passion for building intelligent systems.\n\nFrom training machine learning models to architecting full-stack web applications with Django and React, I bridge the gap between data and user experience. I thrive at the intersection of AI and software engineering.\n\nI'm always learning, always building — whether it's a fraud detection system, a data analytics dashboard, or an AI-powered portfolio.";

  const highlights = DEFAULT_HIGHLIGHTS;

  const paragraphs = aboutBody.split(/\n+/).filter(Boolean);

  const cardVariants = {
    hidden:  { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1, y: 0,
      transition: { delay: i * 0.1, duration: 0.55 }
    }),
  };

  return (
    <section className="about section" id="about">
      <div className="container">
        <SectionTitle
          eyebrow="Who I Am"
          title="About Me"
          subtitle="Passionate about turning complex data into actionable insights and building full-stack applications that make a difference."
        />

        <div className="about__grid">

          {/* ── Left: Bio ── */}
          <motion.div
            className="about__bio glass-card"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.65 }}
          >
            <div className="about__bio-tag">
              <FaCode className="about__bio-icon" />
              <span>Bio</span>
            </div>
            <h3 className="about__bio-heading">
              Building the Future with<br />
              <span className="about__bio-highlight">Data &amp; Code</span>
            </h3>
            {paragraphs.map((text, index) => (
              <p className="about__bio-text" key={`about-paragraph-${index}`}>
                {text}
              </p>
            ))}
            {/* Highlights grid */}
            <div className="about__highlights">
              {highlights.map(({ iconKey, icon, label }, i) => (
                <motion.div
                  key={label || i}
                  className="about__highlight-item"
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <span className="about__highlight-icon">{ICON_MAP[iconKey] || icon || <FaCode />}</span>
                  <span className="about__highlight-label">{label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Right: Stats ── */}
          <div className="about__right">
            {/* Stats */}
            <div className="about__stats">
              {stats.map(({ value, label }, i) => (
                <motion.div
                  key={label || i}
                  className="about__stat glass-card"
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05, y: -4 }}
                >
                  <span className="about__stat-value">{value}</span>
                  <span className="about__stat-label">{label}</span>
                </motion.div>
              ))}
            </div>

            {/* Terminal card */}
            <motion.div
              className="about__terminal glass-card"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.3 }}
            >
              <div className="about__terminal-bar">
                <span className="about__terminal-dot about__terminal-dot--red"   />
                <span className="about__terminal-dot about__terminal-dot--yellow"/>
                <span className="about__terminal-dot about__terminal-dot--green" />
                <span className="about__terminal-title">mohtashim@portfolio ~</span>
              </div>
              <div className="about__terminal-body">
                <p><span className="t-prompt">$</span> python --version</p>
                <p className="t-output">Python 3.11.4</p>
                <p><span className="t-prompt">$</span> cat skills.json</p>
                <p className="t-output">{'{'}</p>
                <p className="t-output">&nbsp;&nbsp;"role": "Data Scientist",</p>
                <p className="t-output">&nbsp;&nbsp;"stack": ["Django","React","ML"],</p>
                <p className="t-output">&nbsp;&nbsp;"available": <span className="t-green">true</span></p>
                <p className="t-output">{'}'}</p>
                <p><span className="t-prompt">$</span> <span className="t-cursor">█</span></p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Decorative blobs */}
      <div className="about__blob about__blob--1" />
      <div className="about__blob about__blob--2" />
    </section>
  );
};

export default About;
