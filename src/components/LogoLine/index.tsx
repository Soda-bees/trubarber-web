import React, { useState } from "react";
import images from "../../services/config/images";

type Props = {};

const LogoLine = (props: Props) => {
  const [sliderImages, setSliderImages] = useState<
    { image: string; text: string }[]
  >([
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
    { image: images.truLogoTwo, text: "BARBER" },
  ]);

  return (
    <div className="relative overflow-hidden bg-black">
      <div className="flex w-[200%] animate-scroll my-5">
        {sliderImages.map((item, index) => (
          <div
            key={index}
            className="flex flex-row items-center justify-center px-40"
          >
            <img
              src={item.image}
              className="w-[80px] md:w-[100px] lg:w-[100px]"
              alt={`Slide ${index}`}
            />
            <div className="text-2xl lg:text-3xl text-center text-white font-bold ml-20"
             style={{ letterSpacing: "1em" }}
            >
              {item.text}
            </div>
          </div>
        ))}
        {sliderImages.map((item, index) => (
          <div
            key={`duplicate-${index}`}
            className="flex flex-row items-center justify-center px-40"
          >
            <img
              src={item.image}
              className="w-[80px] md:w-[100px] lg:w-[100px]"
              alt={`Slide ${index}`}
            />
            <div className="text-2xl lg:text-3xl text-center text-white font-bold ml-20"> 
              {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
    // <div className="relative overflow-hidden bg-black">
    //   <div className="flex w-full animate-scroll my-5">
    //     {sliderImages.map((item, index) => (
    //       <div
    //         key={index}
    //         className="flex flex-row items-center justify-center px-4 md:px-20 w-[50%] sm:w-[25%] lg:w-[20%]"
    //       >
    //         <img
    //           src={item.image}
    //           className="w-[70px] sm:w-[75px] md:w-[100px]"
    //           alt={`Slide ${index}`}
    //         />
    //         <div
    //           className="text-xl sm:text-2xl md:text-4xl text-center text-white font-bold ml-4 sm:ml-8 md:ml-12"
    //           style={{ letterSpacing: "1em" }}
    //         >
    //           {item.text}
    //         </div>
    //       </div>
    //     ))}
    //     {/* Duplicate Images for Seamless Scrolling */}
    //     {sliderImages.map((item, index) => (
    //       <div
    //         key={`duplicate-${index}`}
    //         className="flex flex-row items-center justify-center px-4 md:px-20 w-[50%] sm:w-[25%] lg:w-[20%]"
    //       >
    //         <img
    //           src={item.image}
    //           className="w-[70px] sm:w-[75px] md:w-[100px]"
    //           alt={`Slide ${index}`}
    //         />
    //         <div
    //           className="text-xl sm:text-2xl md:text-4xl text-center text-white font-bold ml-4 sm:ml-8 md:ml-12"
    //           style={{ letterSpacing: "1em" }}
    //         >
    //           {item.text}
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
  );
};

export default LogoLine;
