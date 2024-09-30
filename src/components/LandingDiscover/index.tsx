import React from "react";
import images from "../../services/config/images";

type Props = {};

const LandingDiscover = (props: Props) => {
  return (
    <div>
      <div className="flex flex-col lg:flex-row px-2 max-h-[60vh]">
        <img src={images.landingDiscoverImg} className="lg:w-[56%] rounded-lg lg:h-full max-h-[60vh]" />
        <div className=" flex flex-col items-start justify-between ">
          {/* <div className="flex flex-col item-center bg-red-500 h-full"> */}
          <div className="" >

            <div className="text-xl mt-4 md:text-4xl xl:text-7xl  xl:w-[90%] md:text-start  text-center font-semibold md:mt-[10%]  lg:pl-7">
              Discover Easy Online Barber Booking
            </div>
            <div className=" mt-3 lg:mt-">
              <div className="text-sm md:text-lg lg:text-xl lg:w-[90%] text-center md:text-start lg:pl-7">
                Experience the convenience of booking your next haircut online
                with just a few simple steps. Find your perfect barber and
                schedule your appointment hassle-free!
              </div>
              <div className="border flex flex-row items-center justify-between w-[90%] ml-4 lg:w-[50%] bg-black py-1 lg:py-2 px-5 rounded-2xl cursor-pointer mt-5 ">
                <div className=" text-xl py-2 lg:text-lg font-medium text-white ">
                  Find your Barber
                </div>
                <img src={images.buttonArrow} className="w-[4%] md:w-[2%]"/>
              </div>
            </div>
          </div>

            <img
              src={images.TRUBARBER}
              className="mt-20 lg:mt ml-2 pb-6 w-[97%] flex justify-center"
            />
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default LandingDiscover;
