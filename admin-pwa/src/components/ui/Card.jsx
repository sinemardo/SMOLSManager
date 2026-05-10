import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true, padding = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' } : {}}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 ${padding ? 'p-5' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
