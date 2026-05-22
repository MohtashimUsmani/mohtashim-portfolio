import React from 'react';
import { motion } from 'framer-motion';
import './GlowButton.css';

/**
 * GlowButton — two variants: "primary" (filled) and "outline"
 * Props: variant, children, onClick, href, icon
 */
const GlowButton = ({
  variant = 'primary',
  children,
  onClick,
  href,
  icon,
  className = '',
  ...rest
}) => {
  const Tag    = href ? 'a' : 'button';
  const props  = href ? { href, target: '_blank', rel: 'noopener noreferrer' } : { onClick };

  return (
    <motion.div
      className={`glow-btn-wrapper ${className}`}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
    >
      <Tag className={`glow-btn glow-btn--${variant}`} {...props} {...rest}>
        {icon && <span className="glow-btn__icon">{icon}</span>}
        <span className="glow-btn__label">{children}</span>
        <span className="glow-btn__shine" />
      </Tag>
    </motion.div>
  );
};

export default GlowButton;
