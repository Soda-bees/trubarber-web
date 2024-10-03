import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";

type Props = {};

const Header = (props: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      // Set visibility based on scroll position (hide on scroll down, show on scroll up)
      if (currentScrollPos > prevScrollPos && currentScrollPos > 200) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [prevScrollPos]);

  return (
    // <div className="bg-red flex flex-row justify-between align-center items-center p-8 w-full fixed top-0 z-10">
    <div
      className={`flex flex-col p-3 lg:p-8 w-full fixed top-0 z-10 transition-transform duration-300  ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-transparent flex flex-row items-center justify-between w-full">
        <img src={images.truLogo} className="w-14 sm:w-16 lg:h-17 lg:w-20 cursor-pointer" />
        <div className="hidden sm:flex flex-row bg-white/30 backdrop-blur-lg border border-white-500 w-[50%] lg:w-[40%] items-center rounded-lg p-2 ">
          <img src={images.searchBar} className="h-5 w-5" />
          <input
            type="text"
            placeholder="Search Services"
            className="focus:outline-none ml-[3%] border-none bg-transparent w-full text-inputGray"
          />
        </div>
        <div className="flex flex-row items-center">
          <img
            src={images.loginIcon}
            className="w-[30px] object-contain mr-2"
          />
          {/* <a href="/login" className="text-white hover:underline">Sign In / </a>
        <a href="/signup" className="text-white hover:underline">Sign Up</a> */}
          <ScrollToTopLink to="/signin" className="text-white cursor-pointer">Sign In</ScrollToTopLink>
          <div className="text-white mx-2">/</div>
          <ScrollToTopLink to="/signup" className="text-white cursor-pointer">Sign Up</ScrollToTopLink>
        </div>
      </div>
      <div className="sm:hidden flex flex-row bg-white/30 backdrop-blur-lg border border-white-500 w-[100%] lg:w-[40%] items-center rounded-lg p-2 mt-4">
          <img src={images.searchBar} className="h-5 w-5" />
          <input
            type="text"
            placeholder="Search Services"
            className="focus:outline-none ml-[3%] border-none bg-transparent w-full text-white"
          />
        </div>
    </div>
  );
};

export default Header;
