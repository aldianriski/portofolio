'use client';

import { motion } from 'framer-motion';
import { ThemeToggle } from './theme-toggle';

export function FloatingThemeToggle() {
  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, duration: 0.3 }}
    >
      <ThemeToggle />
    </motion.div>
  );
}
