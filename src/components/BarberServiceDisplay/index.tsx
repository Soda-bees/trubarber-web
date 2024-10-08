import React from "react";
import images from "../../services/config/images";

type Props = {};

const BarberServiceDisplay = (props: Props) => {
  return (
    <div className="flex flex-col justify-center items-center bg-black w-full py-20">
      <div className="text-3xl sm:text-4xl md:text-5xl text-white w-[90%] md:w-[90%] lg:w-[60%] xl:w-[45%] text-center ">
        Effortlessly Book&nbsp;
        <span className="font-bold">Barber Services</span>&nbsp;Online
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center w-full px-5 sm:px-[8%] md:px-[3%] lg:px-[2%] mt-10 md:space-y-0 gap-4">
        <div className="relative w-full md:w-1/2 lg:w-[88%]">
          <img
            src={images.haircutDisplayPicture}
            className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
          />
          <div className="absolute bottom-2 text-white px-5 sm:px-7">
            <div className="text-2xl sm:text-3xl lg:text-5xl font-semibold w-[90%] sm:w-[70%] lg:w-[60%] mb-4 lg:mb-7">
              Top-Quality Haircut Services
            </div>
            <div className="flex flex-row justify-between items-center w-full">
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
            </div>
          </div>
        </div>

        <div className="relative w-full md:w-1/2 lg:w-[88%]">
          <img
            src={images.beardDisplayPicture}
            className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
          />
          <div className="absolute bottom-2 text-white px-5 sm:px-7">
            <div className="text-2xl sm:text-3xl lg:text-5xl font-semibold w-[90%] sm:w-[70%] lg:w-[60%] mb-4 lg:mb-7">
              Exceptional Beard Services
            </div>
            <div className="flex flex-row justify-between items-center w-full">
              <div className="text-sm sm:text-base lg:text-lg font-light w-[90%] sm:w-[70%] lg:w-[60%]">
                Achieve the perfect beard with our expert grooming services.
              </div>
              <div>
                <img
                  src={images.Arrow}
                  className="rotate-180 w-[40px] sm:w-[60px] lg:w-[80%] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberServiceDisplay;
