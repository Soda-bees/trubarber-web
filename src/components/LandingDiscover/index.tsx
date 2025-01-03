import React from "react";
import images from "../../services/config/images";
import useNavigate from "../ScrollToTopNavigate";
import { motion, AnimatePresence } from "framer-motion";
import RightToLeftAnimation from "../RightToLeftAnimation";
import LeftToRightAnimation from "../LeftToRightAnimation";
import AnimatedImage from "../AnimatedImage";

type Props = {};

const LandingDiscover = (props: Props) => {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col lg:flex-row w-full">
      <AnimatedImage
        src={images.landingDiscoverImg}
        containerClassName="lg:w-[50%] lg:h-full max-h-[70vh] w-[100%]"
        className="w-full h-full"
      />
      <div className=" flex flex-col items-start justify-evenly ">
        <div className="">
          <RightToLeftAnimation className="text-xl mt-4 md:text-4xl xl:text-7xl  md:text-start  text-center font-semibold lg:pl-7 ">
            Discover Easy Online Barber Booking
          </RightToLeftAnimation>

          <RightToLeftAnimation className="text-sm md:text-lg lg:text-xl  text-center md:text-start lg:pl-7 mt-4" delay={0.2}>
            Experience the convenience of booking your next haircut online with
            just a few simple steps. Find your perfect barber and schedule your
            appointment hassle-free!
          </RightToLeftAnimation>
          <RightToLeftAnimation delay={0.4}>
            <div
              onClick={() => navigate('/barbers')}
              className="border flex flex-row items-center justify-between w-[90%] ml-4 lg:w-[70%] bg-black py-1 lg:py-2 px-5 rounded-2xl cursor-pointer mt-5 active:opacity-50">
              <div className=" text-xl py-2 lg:text-lg font-medium text-white ">
                Find your Barber
              </div>
              <img src={images.buttonArrow} className="w-[4%] md:w-[2%]" />
            </div>
          </RightToLeftAnimation>

        </div>
        <LeftToRightAnimation delay={0.6}>

          <img
            src={images.TRUBARBER}
            className="mt-20 lg:mt ml-2 pb-6 w-[97%] flex justify-center"
          />
        </LeftToRightAnimation>
      </div>
    </div >
  );
};

export default LandingDiscover;
