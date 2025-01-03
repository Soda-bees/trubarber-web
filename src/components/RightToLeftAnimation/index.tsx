import { motion } from "framer-motion";
import React from "react";

interface ScrollAnimationProps {
    children: React.ReactNode;
    className?: string;
    delay?: number
}

const RightToLeftAnimation: React.FC<ScrollAnimationProps> = ({ children, className, delay }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{
                duration: 0.6,
                delay:delay,
                ease: "easeOut",
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default RightToLeftAnimation;