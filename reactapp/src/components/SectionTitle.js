import React from 'react';
import { motion } from 'framer-motion';
import './SectionTitle.css';

const SectionTitle = ({ eyebrow, title, subtitle }) => (
  <motion.div
    className="section-title"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6 }}
  >
    {eyebrow && <span className="section-title__eyebrow">{eyebrow}</span>}
    <h2 className="section-title__heading">{title}</h2>
    {subtitle && <p className="section-title__subtitle">{subtitle}</p>}
    <div className="section-title__line">
      <span className="section-title__line-inner" />
    </div>
  </motion.div>
);

export default SectionTitle;
