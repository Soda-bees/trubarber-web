import { motion } from "framer-motion";
import React from "react";

interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
}

const BottomToTopAnimation: React.FC<ScrollAnimationProps> = ({ children, className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }} 
      whileInView={{ opacity: 1, y: 0 }} 
      viewport={{ once: false, amount: 0.5 }} 
      transition={{
        duration: 0.6, 
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default BottomToTopAnimation;
