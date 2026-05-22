import React from 'react';
import { motion } from 'framer-motion';
import {
  FaCode, FaPython, FaServer, FaBrain,
} from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import './Experience.css';
import useApiData from '../hooks/useApiData';

const DEFAULT_TIMELINE = [
  {
    year:  '2021',
    icon:  <FaCode />,
    title: 'Started Web Development',
    org:   'Self-Taught',
    desc:  'Dived into HTML, CSS, JavaScript and began building responsive websites from scratch. Fell in love with the craft of creating interactive experiences on the web.',
    tags:  ['HTML', 'CSS', 'JavaScript', 'Bootstrap'],
    side:  'left',
  },
  {
    year:  '2022',
    icon:  <FaPython />,
    title: 'Mastered Python & Django',
    org:   'Backend Development',
    desc:  'Deep-dived into Python development and the Django framework. Built REST APIs, worked with ORMs, implemented authentication systems, and deployed production apps.',
    tags:  ['Python', 'Django', 'REST API', 'PostgreSQL'],
    side:  'right',
  },
  {
    year:  '2023',
    icon:  <FaServer />,
    title: 'Built Full Stack Projects',
    org:   'Freelance & Personal',
    desc:  'Combined React frontend with Django backend to build complete full-stack applications including Hospital Management System and e-commerce platforms.',
    tags:  ['React', 'Django', 'Full Stack', 'Docker'],
    side:  'left',
  },
  {
    year:  '2024',
    icon:  <FaBrain />,
    title: 'Entered Data Science & ML',
    org:   'Data Engineering',
    desc:  'Transitioned into data science, mastering machine learning workflows, data analysis pipelines, and building production-grade ML systems for fraud detection and analytics.',
    tags:  ['ML', 'Pandas', 'Scikit-learn', 'NumPy'],
    side:  'right',
  },
];

const ICON_NAME_MAP = {
  FaCode,
  FaPython,
  FaServer,
  FaBrain,
};

const TimelineItem = ({ item, index }) => {
  const isLeft = item.side === 'left';

  return (
    <motion.div
      className={`timeline-item timeline-item--${item.side}`}
      initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      {/* Content card */}
      <div className="timeline-card glass-card">
        <div className="timeline-card__header">
          <span className="timeline-card__org">{item.org}</span>
          <span className="timeline-card__year">{item.year}</span>
        </div>
        <h3 className="timeline-card__title">{item.title}</h3>
        <p className="timeline-card__desc">{item.desc}</p>
        <div className="timeline-card__tags">
          {item.tags.map(t => (
            <span key={t} className="timeline-card__tag">{t}</span>
          ))}
        </div>
      </div>

      {/* Center dot */}
      <div className="timeline-dot">
        <div className="timeline-dot__icon">{item.icon}</div>
        <div className="timeline-dot__pulse" />
      </div>

      {/* Empty spacer (opposite side) */}
      <div className="timeline-spacer" />
    </motion.div>
  );
};

const Experience = () => {
  const { data: experienceData } = useApiData('/experience/', [], { pollIntervalMs: 15000, refetchOnFocus: true });
  const hasApiExperience = Array.isArray(experienceData) && experienceData.length > 0;
  const experience = hasApiExperience
    ? experienceData.map((item, index) => {
        const IconComponent = ICON_NAME_MAP[item.icon_name] || FaCode;
        return {
          year: item.year,
          icon: <IconComponent />,
          title: item.title,
          org: item.organization || 'Experience',
          desc: item.description || '',
          tags: Array.isArray(item.tags) ? item.tags : [],
          side: item.side || (index % 2 === 0 ? 'left' : 'right'),
        };
      })
    : DEFAULT_TIMELINE;

  return (
    <section className="experience section" id="experience">
      <div className="container">
        <SectionTitle
          eyebrow="My Journey"
          title="Experience Timeline"
          subtitle="The milestones that shaped me into the developer and data scientist I am today."
        />

        <div className="timeline">
          {/* Vertical line */}
          <div className="timeline__line">
            <motion.div
              className="timeline__line-fill"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </div>

          {experience.map((item, i) => (
            <TimelineItem key={`${item.year}-${i}`} item={item} index={i} />
          ))}
        </div>
      </div>

      <div className="experience__blob" />
    </section>
  );
};

export default Experience;
