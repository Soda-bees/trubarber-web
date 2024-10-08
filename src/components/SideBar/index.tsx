import React from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";
import { useLocation } from "react-router-dom";

type Props = {};

const SideBar = (props: Props) => {
    const location = useLocation();
    const activePath = location.pathname;

  return (
    <div className="sticky top-0 max-h-screen relative bg-black p-10 w-[15%] md:w-[37%] lg:w-[25%] xl:w-[20%] 2xl:w-[15%]">
      <img src={images.truLogo} className="w-[5%] cursor-pointer" />
      <img src={images.reviewBarber} className="w-[5%]" />
      <div>
        <div className="font-bold text-lg text-white">Cameron Williamson</div>
        <div className="text-sm flex flex-row items-center text-white">
          <img
            src={images.Location}
            className="w-3 filter invert brightness-0 mr-2"
          />
          Royal Ln. Mesa, New Jersey
        </div>
      </div>
      <ScrollToTopLink to='/' className={activePath === '/' ?
                'flex flex-row items-center justify-center md:justify-start py-3 md:mx-4  cursor-pointer hover:text-white text-white px-2 rounded-md' :
                'flex flex-row items-center justify-center md:justify-start py-3 md:mx-4  cursor-pointer hover:bg-hoverGray hover:text-white text-textGray px-2 rounded-md'}>
                <img src={activePath === '/' ? images.appointment : images.profile}
                    // className='w-[70%]'
                    className='w-[90%] sm:w-[70%] md:w-7'
                />
                <div className='text-lg font-semibold ml-4 hidden md:flex'>
                    Dashboard
                </div>
            </ScrollToTopLink>
    </div>
  );
};

export default SideBar;
