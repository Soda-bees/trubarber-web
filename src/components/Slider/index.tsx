import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import Header from "../Header";

type Props = {};

const Slider = (props: Props) => {
  const [sliderImages, setSliderImages] = useState<{ image: string }[]>([
    { image: images.landingBG },
    { image: images.landingBG2 },
    { image: images.landingBG3 },
    { image: images.landingBG4 },
  ]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handleChangeActiveIndex = (index: number) => {
    if (index < sliderImages.length - 1) {
      setActiveIndex(index + 1);
    } else {
      setActiveIndex(0); 
    }
  };

  const handleReverseActiveIndex = (index: number) => {
    if (index > 0) {
      setActiveIndex(index - 1);
    } else {
      setActiveIndex(sliderImages.length - 1); 
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex < sliderImages.length - 1 ? prevIndex + 1 : 0
      );
    }, 3000); 

    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <div className="h-[50vh] sm:h-[65vh] md:h-[75vh] lg:h-[85vh] xl:h-[95vh] 2xl:h-screen flex flex-col items-start justify-end relative bg-center w-full">
      <img
        src={sliderImages[activeIndex]?.image}
        className="absolute h-full w-full z-[-1]"
      />
      <div className="flex flex-row mb-10 items-center justify-start sm:w-auto px-8 lg:px-20">
        <img
          src={images.Arrow}
          className="w-[30%] cursor-pointer "
          onClick={() => handleReverseActiveIndex(activeIndex)}
        />
        <img
          src={images.Arrow}
          className="w-[30%]  cursor-pointer rotate-180 ml-4"
          onClick={() => handleChangeActiveIndex(activeIndex)}
        />
      </div>
      <div className="flex flex-col items-start md:flex-row md:items-end justify-between px-2 md:px-8 lg:px-16 pb-4 md:pb-10">
        <div className="text-white text-sm md:text-2xl lg:text-4xl xl:text-6xl 2xl:text-8xl font-bold w-full text-center md:text-start  md:w-[50%] text-wrap ">
          Experience the Art of Grooming at TRU Barber
        </div>
        <div className="text-white text-sm md:text-sm w-full text-center md:text-start px-2 md:w-[60%] lg:w-[42%] xl:w-[35%] 2xl:w-[25%] text-wrap">
          At TRU Barber, we blend modern techniques with classic barbering
          traditions to give you a look that’s uniquely yours.
        </div>
      </div>
      <div
        className="hidden md:flex flex-row md:-rotate-90 items-center justify-between absolute md:top-[50%] md:top-[50%] 2xl:left-[87%] xl:left-[83%] lg:left-[79%] md:left-[70%] "
      >
        <div className="text-white text-sm md:text-xl font-light cursor-pointer">
          Instagram
        </div>
        <div className="text-white text-sm md:text-xl font-light cursor-pointer px-4 sm:px-10">
          Facebook
        </div>
        <div className="text-white text-sm md:text-xl font-light cursor-pointer">
          Twitter
        </div>
      </div>
    </div>
  );
};

export default Slider;
