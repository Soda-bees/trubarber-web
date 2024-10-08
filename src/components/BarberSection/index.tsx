import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import Button from "../Button";

type Props = {};

const BarberSection = (props: Props) => {
  const [sliderData] = useState([
    {
      image: images.barberImg,
      name: "John Doe 1",
      location: "123 Main St, City",
      rating: 4.5,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Jane Smith 2",
      location: "456 Oak St, City",
      rating: 4.7,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson 3",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson 4",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson 5",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson 6",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson 6",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    // Add more items here...
  ]);

  const [visibleImages, setVisibleImages] = useState(5);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const breakpoints = [
        { width: 1280, visibleImages: 5 },
        { width: 1024, visibleImages: 4 },
        { width: 768, visibleImages: 3 },
        { width: 556, visibleImages: 2 },
        { width: 544, visibleImages: 1 },
      ];

      const { visibleImages: newVisibleImages } =
        breakpoints.find(
          (breakpoint) => window.innerWidth >= breakpoint.width
        ) || breakpoints[breakpoints.length - 1];

      setVisibleImages(newVisibleImages);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    if (startIndex + visibleImages < sliderData.length) {
      setStartIndex(startIndex + 1);
    } else {
      setStartIndex(0);  // Reset to the beginning if we've reached the end
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else {
      setStartIndex(sliderData.length - visibleImages);  // Wrap around to the last set of visible items
    }
  };

  return (
    <div className="flex flex-col w-full p-4 ">
      <div className="flex flex-col mt-4 justify-between p-4 w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="text-3xl md:text-6xl md:w-[70%] lg:w-[60%] font-semibold">
            Discover Expert Barbers Online Effortlessly
          </div>
          <div className="hidden md:flex flex-row w-[7%] justify-between mr-1">
            <div
              onClick={handlePrevious}
              className="bg-white text-black rounded-full flex justify-center"
            >
              <img
                src={images.greyArrow}
                className="w-[40%] h-full cursor-pointer"
              />
            </div>

            <div
              onClick={handleNext}
              className="bg-white text-black rounded-full flex justify-center"
            >
              <img
                src={images.greyArrow}
                className="w-[40%] h-full rotate-180 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between mt-7">
          <div className="text-sm w-full md:text-xl md:w-[70%] lg:w-[30%] font-light">
            Effortlessly locate and connect with top-rated barbers in your area
            using our easy-to-use online platform.
          </div>
          <div className="hidden border border-black/50 p-2 rounded-xl md:flex justify-center cursor-pointer lg:w-[8%]">
            View All
          </div>
        </div>
        <div className="md:hidden flex flex-row justify-between mt-4">
          <div className="border border-black/50 p-2 px-5 rounded-xl flex justify-center cursor-pointer mr-2">
            View All
          </div>
          <div className="flex flex-row justify-between w-[15%] h-[15%] mt-3">
            <div
              onClick={handlePrevious}
              className="bg-white text-black rounded-full flex justify-center mr-3"
            >
              <img src={images.greyArrow} className="w-3 h-5" />
            </div>

            <div
              onClick={handleNext}
              className="bg-white text-black rounded-full flex justify-center"
            >
              <img src={images.greyArrow} className="rotate-180 w-3 h-5" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-purplegray">
        <div className="flex flex-row gap-2 overflow-hidden">
          {sliderData.map((item, index) => (
            <div
              key={index}
              className={`w-full ${index >= startIndex && index < startIndex + visibleImages
                ? "block"
                : "hidden"
                } ${visibleImages === 8
                  ? "xl:w-1/8 relative"
                  : visibleImages === 6
                    ? "lg:w-1/6 relative"
                    : visibleImages === 4
                      ? "md:w-1/2 relative"
                      : "sm:w-1/2 relative"
                }`}
            >
              <div>
                <img
                  src={item?.image}
                  className="w-full h-auto "
                  style={{ height: "420px", width: "100%" }}
                />
                <div className="absolute flex flex-row items-center top-3 right-3 bg-white/30 backdrop-blur-lg text-white font-bold px-2 py-1 rounded-lg">
                  {item.rating}
                  <img src={images.star} className="w-4 ml-2" />
                </div>
                <div className="absolute bottom-20 left-[5%] text-black bg-white/20 backdrop-blur-lg p-2 w-[90%] rounded-xl">
                  <div className="font-bold text-lg">{item.name}</div>
                  <div className="text-sm flex flex-row items-center">
                    <img src={item.icon} className="w-[5%] h-full mr-1" />
                    {item.location}
                  </div>
                </div>
                <Button light={false} title="Book Appointment" mt={'10px'} onClick={() => alert(index)} />
                {/* <div onClick={() => alert(index)}>{index}</div> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BarberSection;

