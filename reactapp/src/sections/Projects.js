import React from 'react';
import { motion } from 'framer-motion';
import Tilt from 'react-parallax-tilt';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import SectionTitle from '../components/SectionTitle';
import './Projects.css';
import useApiData from '../hooks/useApiData';

const DEFAULT_PROJECTS = [
  {
    number:  '01',
    title:   'Fraud Detection ML System',
    desc:    'End-to-end machine learning pipeline for real-time financial fraud detection using ensemble models. Achieves 97.8% accuracy with sub-100ms inference time.',
    tech:    ['Python', 'Scikit-learn', 'XGBoost', 'Pandas', 'FastAPI', 'PostgreSQL'],
    github:  'https://github.com',
    demo:    'https://example.com',
    accent:  '#FF1744',
    badge:   'Machine Learning',
  },
  {
    number:  '02',
    title:   'AI Portfolio Website',
    desc:    'This cinematic full-stack portfolio built with React and Django, featuring AI-driven content generation and interactive data visualizations.',
    tech:    ['React', 'Django', 'Python', 'Framer Motion', 'PostgreSQL'],
    github:  'https://github.com',
    demo:    'https://example.com',
    accent:  '#E040FB',
    badge:   'Full Stack',
  },
  {
    number:  '03',
    title:   'Hospital Management System',
    desc:    'Comprehensive web application for managing patient records, appointments, staff scheduling, and billing with real-time notifications.',
    tech:    ['Django', 'React', 'PostgreSQL', 'REST API', 'Bootstrap'],
    github:  'https://github.com',
    demo:    'https://example.com',
    accent:  '#00BCD4',
    badge:   'Web App',
  },
  {
    number:  '04',
    title:   'FinTech Analytics Dashboard',
    desc:    'Interactive financial analytics platform with real-time data streaming, predictive modeling, and custom KPI reporting for portfolio management.',
    tech:    ['Python', 'Pandas', 'Plotly', 'Django', 'React', 'WebSocket'],
    github:  'https://github.com',
    demo:    'https://example.com',
    accent:  '#FFD600',
    badge:   'Analytics',
  },
];

const ProjectCard = ({ project, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ delay: index * 0.12, duration: 0.6 }}
  >
    <Tilt
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      perspective={1200}
      glareEnable
      glareMaxOpacity={0.08}
      glareColor={project.accent}
      glarePosition="all"
      scale={1.02}
      transitionSpeed={1500}
    >
      <div className="project-card glass-card" style={{ '--project-accent': project.accent }}>

        {/* Top row */}
        <div className="project-card__top">
          <span className="project-card__number">{project.number}</span>
          <span className="project-card__badge">{project.badge}</span>
        </div>

        {/* Accent line */}
        <div className="project-card__accent-line" />

        {/* Title */}
        <h3 className="project-card__title">{project.title}</h3>

        {/* Description */}
        <p className="project-card__desc">{project.desc}</p>

        {/* Tech stack */}
        <div className="project-card__tech">
          {project.tech.map(t => (
            <span key={t} className="project-card__tech-tag">{t}</span>
          ))}
        </div>

        {/* Buttons */}
        <div className="project-card__actions">
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card__btn project-card__btn--outline"
          >
            <FaGithub /> GitHub
          </a>
          <a
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="project-card__btn project-card__btn--primary"
          >
            <FaExternalLinkAlt /> Live Demo
          </a>
        </div>

        {/* Glow corner */}
        <div className="project-card__corner-glow" />
      </div>
    </Tilt>
  </motion.div>
);

const Projects = () => {
  const { data: projectsData } = useApiData('/projects/', [], { pollIntervalMs: 15000, refetchOnFocus: true });
  const hasApiProjects = Array.isArray(projectsData) && projectsData.length > 0;
  const projects = hasApiProjects
    ? projectsData.map((project, index) => {
        const tech = Array.isArray(project.tech_stack)
          ? project.tech_stack
          : typeof project.tech_stack === 'string'
            ? project.tech_stack.split(/[,|]/).map((item) => item.trim()).filter(Boolean)
            : [];
        return {
          number: project.number || String(index + 1).padStart(2, '0'),
          title: project.title,
          desc: project.description,
          tech,
          github: project.github_url || 'https://github.com',
          demo: project.live_url || 'https://example.com',
          accent: project.accent || (project.is_featured ? '#E040FB' : '#FF1744'),
          badge: project.badge || (project.is_featured ? 'Featured' : 'Project'),
        };
      })
    : DEFAULT_PROJECTS;

  return (
    <section className="projects section" id="projects">
      <div className="container">
        <SectionTitle
          eyebrow="What I've Built"
          title="Featured Projects"
          subtitle="A selection of projects that showcase my skills across ML, full-stack, and data engineering."
        />
        <div className="projects__grid">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} />
          ))}
        </div>
      </div>

      <div className="projects__blob--1" />
      <div className="projects__blob--2" />
    </section>
  );
};

export default Projects;
