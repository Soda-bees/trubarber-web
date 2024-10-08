import React from "react";
import images from "../../services/config/images";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="bg-black py-10 px-5 md:px-10">
      <div className="flex flex-col md:flex-row justify-between w-full md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:w-[40%] justify-around text-white md:items-center text-lg font-light space-y-4 md:space-y-0 md:space-x-6">
          <div className="cursor-pointer">Book Appointment</div>
          <div className="cursor-pointer">Services</div>
          <div className="cursor-pointer">Career</div>
          <div className="cursor-pointer">Customer Reviews</div>
          <div className="cursor-pointer">Terms & Policy</div>
        </div>

        <div className="flex flex-row items-center md:justify-center md:space-x-4">
          <div className="border flex items-center p-2 rounded-xl md:w-auto cursor-pointer">
            <img
              src={images.google}
              className="w-8 md:w-10"
              alt="Google Play"
            />
            <div className="ml-2">
              <div className="text-white text-xs">GET IT ON</div>
              <div className="text-white font-bold">Google Play</div>
            </div>
          </div>
          <div className="border flex items-center ml-2 p-2 rounded-xl md:w-auto cursor-pointer">
            <img
              src={images.apple}
              className="w-8 md:w-10"
              alt="App Store"
            />
            <div className="ml-2">
              <div className="text-white text-xs">Download from</div>
              <div className="text-white font-bold">App Store</div>
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
