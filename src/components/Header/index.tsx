import React from "react";
import images from "../../services/config/images";

type Props = {};

const Header = (props: Props) => {
  return (
    <div className="bg-red flex flex-row justify-between align-center items-center p-8 w-full">
      <img src={images.truLogo} className="h-17 w-20" />
      <div className="flex flex-row bg-white/30 backdrop-blur-lg border border-white-500 w-[25%] items-center rounded-lg p-2">
        <img src={images.searchBar} className="h-5 w-5" />
        <input
          type="text"
          placeholder="Search Services"
          className="focus:outline-none ml-[3%] border-none bg-transparent w-full text-white"
        />
      </div>
      <div className="flex flex-row items-center">
        <img src={images.loginIcon} className="w-[30px] object-contain mr-2" />
        {/* <a href="/login" className="text-white hover:underline">Sign In / </a>
        <a href="/signup" className="text-white hover:underline">Sign Up</a> */}
        <div className="text-white cursor-pointer">Sign In</div>
        <div className="text-white mx-2">/</div>
        <div className="text-white cursor-pointer">Sign Up</div>
      </div>
    </div>
  );
};

export default Header;
