import React from "react";
import images from "../../services/config/images";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="bg-black py-10 px-5 ">
      <div className="flex flex-row xs:flex-row justify-between w-full items-center xs:items-start gap-2  ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 xl:flex flex-row sm:gap-4  text-white text-lg font-light ">
          <div className="cursor-pointer ">Book Appointment</div>
          <div className="cursor-pointer">Services</div>
          <div className="cursor-pointer">Customer Reviews</div>
          <div className="cursor-pointer">Terms & Policy</div>
          <div className="cursor-pointer">Career</div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 gap-2 items-center md:justify-center ">
          <div className="border flex items-center p-2 rounded-md md:w-auto cursor-pointer">
            <img
              src={images.google}
              className="w-6"
              alt="Google Play"
            />
            <div className="ml-2">
              <div className="text-white text-xs">GET IT ON</div>
              <div className="text-white font-semibold text-sm">Google Play</div>
            </div>
          </div>
          <div className="border flex items-center p-2 rounded-md md:w-auto cursor-pointer">
            <img
              src={images.apple}
              className="w-6 "
              alt="App Store"
            />
            <div className="ml-2">
              <div className="text-white text-xs">Download from</div>
              <div className="text-white font-semibold text-sm">App Store</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full bg-white h-0.5 my-8" />

      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
          <img
            src={images.truLogo}
            className="w-20 md:w-24"
            alt="TruBarber Logo"
          />
          <div className="text-white text-lg md:text-2xl font-light md:ml-4 md:text-center md:text-left">
            TruBarber. All Rights Reserved 2024. Licensing
          </div>
        </div>

        <div className="flex flex-row space-x-4">
          <div className="border rounded-full p-2  cursor-pointer">
            <img src={images.facebook} className="w-5 md:w-6" alt="Facebook" />
          </div>
          <div className="border rounded-full p-2  cursor-pointer">
            <img src={images.twitter} className="w-5 md:w-6" alt="Twitter" />
          </div>
          <div className="border rounded-full p-2  cursor-pointer">
            <img src={images.insta} className="w-5 md:w-6" alt="Instagram" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
