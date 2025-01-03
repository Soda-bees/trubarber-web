import React from "react";
import images from "../../services/config/images";
import { motion, AnimatePresence } from "framer-motion";
import LeftToRightAnimation from "../LeftToRightAnimation";
import RightToLeftAnimation from "../RightToLeftAnimation";
import BottomToTopAnimation from "../BottomToTopAnimation";
import AnimatedImage from "../AnimatedImage";


type Props = {};

const BarberServiceDisplay = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center bg-black w-full py-20">
      <BottomToTopAnimation className="text-3xl sm:text-4xl md:text-5xl text-white w-[90%] md:w-[90%] lg:w-[60%] xl:w-[45%] text-center ">
        Effortlessly Book&nbsp;
        <span className="font-bold">Barber Services</span>&nbsp;Online
      </BottomToTopAnimation>

      <div className="flex flex-col md:flex-row justify-between items-center w-full px-5 sm:px-[8%] md:px-[3%] lg:px-[2%] mt-10 md:space-y-0 gap-4">
        <LeftToRightAnimation className="relative w-full md:w-1/2 lg:w-[88%]">
          {/* <div className={`w-full h-[300px] sm:h-[400px] lg:h-[500px] overflow-hidden`}>
            <motion.img
              src={images.haircutDisplayPicture}
              initial={{ opacity: 0, scale: 1.4 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1.5,
                ease: "easeInOut",
              }}
              viewport={{ once: false, amount: 0.5 }}
              className={`w-full h-full object-cover `}
            />
          </div> */}
          <AnimatedImage
            src={images.haircutDisplayPicture}
            containerClassName="w-full h-[300px] sm:h-[400px] lg:h-[500px]"
            className="w-full h-full"
          />
          {/* <img
            src={images.haircutDisplayPicture}
            className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
          /> */}
          <div className="absolute bottom-2 text-white px-5 sm:px-7">
            <LeftToRightAnimation delay={0.5} className="text-2xl sm:text-3xl lg:text-5xl font-semibold w-[90%] sm:w-[70%] lg:w-[60%] mb-4 lg:mb-7">
              Top-Quality Haircut Services
            </LeftToRightAnimation>
            <LeftToRightAnimation delay={0.8} className="flex flex-row justify-between items-center w-full">
              <div className="text-sm sm:text-base lg:text-lg font-light w-[90%] sm:w-[70%] lg:w-[60%]">
                Get the perfect look with our expert haircut services, tailored
                to your style and needs.
              </div>
              <div>
                <img
                  src={images.Arrow}
                  className="rotate-180 w-[40px] sm:w-[60px] lg:w-[80%] cursor-pointer"
                />
              </div>
            </LeftToRightAnimation>

          </div>
        </LeftToRightAnimation>
        <RightToLeftAnimation className="relative w-full md:w-1/2 lg:w-[88%]">
          {/* <img
            src={images.beardDisplayPicture}
            className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
          /> */}
          <AnimatedImage
            src={images.beardDisplayPicture}
            containerClassName="w-full h-[300px] sm:h-[400px] lg:h-[500px]"
            className="w-full h-full"
          />
          <div className="absolute bottom-2 text-white px-5 sm:px-7">
            <LeftToRightAnimation delay={0.6} className="text-2xl sm:text-3xl lg:text-5xl font-semibold w-[90%] sm:w-[70%] lg:w-[60%] mb-4 lg:mb-7">
              Exceptional Beard Services
            </LeftToRightAnimation>
            <LeftToRightAnimation delay={0.8} className="flex flex-row justify-between items-center w-full">
              <div className="text-sm sm:text-base lg:text-lg font-light w-[90%] sm:w-[70%] lg:w-[60%]">
                Achieve the perfect beard with our expert grooming services.
              </div>
              <div>
                <img
                  src={images.Arrow}
                  className="rotate-180 w-[40px] sm:w-[60px] lg:w-[80%] cursor-pointer"
                />
              </div>
            </LeftToRightAnimation>

          </div>
        </RightToLeftAnimation>
      </div>
    </div>
  );
};

export default BarberServiceDisplay;
