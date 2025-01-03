import { motion } from "framer-motion";
import React from "react";

interface ZoomScrollProps {
    src: string;
    alt?: string;
    className?: string;
    containerClassName?: string;
    key?: number
}

const AnimatedImage: React.FC<ZoomScrollProps> = ({
    src,
    className,
    containerClassName,
    key
}) => {
    return (
        <div className={`${containerClassName} overflow-hidden`}>
            <motion.img
                key={key}
                src={src}
                initial={{ opacity: 0, scale: 1.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: 0.9,
                    ease: "easeInOut",
                }}
                viewport={{ once: false, amount: 0.5 }}
                className={`${className} object-cover `}
            />
        </div>
    );
};

export default AnimatedImage;
