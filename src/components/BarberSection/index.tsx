import React, { useRef, useState } from "react";
import images from "../../services/config/images";

type Props = {};

const BarberSection = (props: Props) => {
  const sliderRef = useRef<HTMLDivElement>(null);

  const [sliderData] = useState([
    {
      image: images.barberImg,
      name: "John Doe",
      location: "123 Main St, City",
      rating: 4.5,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Jane Smith",
      location: "456 Oak St, City",
      rating: 4.7,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    {
      image: images.barberImg,
      name: "Bob Johnson",
      location: "789 Pine St, City",
      rating: 4.8,
      icon: images.Location,
    },
    // Add more items here
  ]);

  const scroll = (direction: "left" | "right") => {
    const scrollAmount = 250; // Amount to scroll
    if (direction === "left") {
      sliderRef.current?.scrollBy({
        top: 0,
        left: -scrollAmount,
        behavior: "smooth",
      });
    } else {
      sliderRef.current?.scrollBy({
        top: 0,
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex flex-col-reverse w-full p-4">
      <div
        ref={sliderRef}
        className="flex space-x-4 w-full overflow-x-auto hide-scrollbar"
        style={{ scrollBehavior: "smooth" }}
      >
        {sliderData.map((item, index) => (
          <div key={index} className="w-[230px] flex-shrink-0">
            <div className="relative">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-[320px] object-cover rounded-xl"
              />
              <div className="absolute top-3 right-3 bg-white/30 backdrop-blur-lg text-white font-bold px-2 py-1 rounded-lg">
                {item.rating} ⭐
              </div>
              <div className="absolute bottom-2 left-3 text-black bg-white/20 backdrop-blur-lg p-2 w-[90%] rounded-xl">
                <div className="font-bold text-lg">{item.name}</div>
                <div className="text-sm flex flex-row items-center">
                  <img src={item.icon} className="w-[5%] h-full mr-1" />
                  {item.location}
                </div>
              </div>
            </div>

            <div className="mt-2 text-center flex flex-row bg-black text-white py-2 px-4 rounded-lg w-full items-center justify-between cursor-pointer active:opacity-50">
              <div className="text-white">Book Appointment</div>
              <img src={images.arrowBtn} className="w-[4%] h-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col mt-4 justify-between p-4 ">
        <div className="flex flex-row items-center justify-between">
          <div className="text-3xl md:text-6xl md:w-[70%] lg:w-[60%] font-semibold">
            Discover Expert Barbers Online Effortlessly
          </div>
          <div className="hidden md:flex flex-row w-[7%] justify-between mr-1">
            <div
              onClick={() => scroll("left")}
              className="bg-white text-black rounded-full flex justify-center"
            >
              <img
                src={images.greyArrow}
                className="w-[40%] h-full cursor-pointer"
              />
            </div>

            <div
              onClick={() => scroll("right")}
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
          <div className="text-sm w-full md:text-xl md: w-[70%] lg:w-[30%] font-light">
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
              onClick={() => scroll("left")}
              className="bg-white text-black rounded-full flex justify-center mr-3"
            >
              <img src={images.greyArrow} className="w-3 h-5" />
            </div>

            <div
              onClick={() => scroll("right")}
              className="bg-white text-black rounded-full flex justify-center"
            >
              <img src={images.greyArrow} className="rotate-180 w-3 h-5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberSection;
