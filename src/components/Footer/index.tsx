import React from "react";
import images from "../../services/config/images";

type Props = {};

const Footer = (props: Props) => {
  return (
    <div className="bg-black py-10 px-10">
      <div className="flex flex-row justify-between w-full">
        <div className="flex flex-row w-[40%] justify-between text-white items-center text-xl font-light">
          <div className="cursor-pointer">Book Appointment</div>
          <div className="cursor-pointer">Services</div>
          <div className="cursor-pointer">Career</div>
          <div className="cursor-pointer">Customer Reviews</div>
          <div className="cursor-pointer">Terms & Policy</div>
        </div>
        <div className="flex flex-row justify-end">
          <img src={images.google} className="w-[20%] cursor-pointer" />
          <img src={images.apple} className="w-[20%] ml-3 cursor-pointer" />
        </div>
      </div>
      <div className="w-full bg-white h-0.5 my-8" />
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center">
          <img src={images.truLogo} className="w-[15%]" />
          <div className="text-white text-2xl font-light ml-10">TruBarber. All Rights Reserved 2024. Licensing</div>
        </div>
        <div className="flex flex-row justify-evenly  w-[14%]">
            <img src={images.facebook} className="w-[22%] cursor-pointer"/>
            <img src={images.twitter} className="w-[22%] cursor-pointer"/>
            <img src={images.insta} className="w-[22%] cursor-pointer"/>
        </div>
      </div>
    </div>
  );
};

export default Footer;
