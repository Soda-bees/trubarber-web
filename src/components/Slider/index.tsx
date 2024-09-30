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
      setActiveIndex(0); // Reset to the first image if at the end
    }
  };

  const handleReverseActiveIndex = (index: number) => {
    if (index > 0) {
      setActiveIndex(index - 1);
    } else {
      setActiveIndex(sliderImages.length - 1); // Set to the last image if at the beginning
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex < sliderImages.length - 1 ? prevIndex + 1 : 0
      );
    }, 3000); // Change the image every 3 seconds (3000ms)

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [sliderImages.length]);

  return (
    <div className=" h-screen flex flex-col items-start justify-end relative bg-cover">
      <img
        src={sliderImages[activeIndex]?.image}
        className="absolute h-full w-full z-[-1]"
      />
      <div className="flex flex-row mb-10 px-24">
        <img
          src={images.Arrow}
          className="w-[30%] cursor-pointer "
          onClick={() => handleReverseActiveIndex(activeIndex)}
        />
        <img
          src={images.Arrow}
          className="w-[30%]  cursor-pointer rotate-180 ml-3"
          onClick={() => handleChangeActiveIndex(activeIndex)}
        />
      </div>
      <div className="flex flex-row items-end justify-between px-20 pb-16">
        <div className="text-white text-8xl font-bold w-[50%] text-wrap ">
          Experience the Art of Grooming at TRU Barber
        </div>
        <div className="text-white text-lg w-[25%] text-wrap">
          At TRU Barber, we blend modern techniques with classic barbering
          traditions to give you a look that’s uniquely yours.
        </div>
      </div>
      <div className="flex flex-row -rotate-90 items-center justify-between absolute top-[50%] left-[85%] w-[20%]">
        <div className="text-white text-xl font-light cursor-pointer">
          Instagram
        </div>
        <div className="text-white text-xl font-light cursor-pointer">
          Facebook
        </div>
        <div className="text-white text-xl font-light cursor-pointer">
          Twitter
        </div>
      </div>
    </div>
  );
};

export default Slider;
