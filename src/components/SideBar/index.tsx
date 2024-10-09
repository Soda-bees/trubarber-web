import React, { useState } from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";
import { useLocation } from "react-router-dom";

type Props = {
  showSidebar: boolean
};

const SideBar = ({ showSidebar }: Props) => {
  const location = useLocation();
  const activePath = location.pathname;
  const [onClickToggle, setOnClickToggle] = useState<boolean>(false);

  return (
    <div className={`flex-col items-start justify-start sticky top-0 max-h-screen relative bg-black w-[15%] py-10 md:w-[37%] lg:w-[25%] xl:w-[20%] 2xl:w-[17%] ${showSidebar ? 'flex' : 'hidden'}`}>
      <div className="px-10 flex flex-col justify-between">
        <img src={images.truLogo} className="w-[50%] cursor-pointer" />
        <img src={images.reviewBarber} className="w-[50%] mt-20 mb-7" />
        <div>
          <div className="font-bold text-lg text-white">Cameron Williamson</div>
          <div className="text-sm flex flex-row items-center text-white my-2">
            <img
              src={images.Location}
              className="w-3 filter invert brightness-0 mr-2"
            />
            Royal Ln. Mesa, New Jersey
          </div>
        </div>
        <div className="flex flex-row">
          <div className="text-hoverGray">Gender</div>
          <div className="text-white ml-4">Male</div>
        </div>
      </div>
      <div className="w-full h-px text-white bg-hoverGray my-10" />
      <ScrollToTopLink
        to="/"
        className={
          activePath === "/"
            ? "flex flex-row items-center justify-between p-3 mx-2 cursor-pointer hover:text-black text-black rounded-lg bg-white mb-4"
            : "flex flex-row items-center justify-between p-3 mx-2 cursor-pointer hover:bg-hoverGray hover:text-white text-white rounded-lg mb-4"
        }
      >
        <div className="text-lg font-semibold hidden md:flex">
          <img
            src={images.explore}
            className={
              activePath === "/"
                ? "w-[18%] object-contain mr-5 filter invert dark-0"
                : "w-[18%] object-contain mr-5"
            }
          />
          Explore
        </div>
        <img
          src={images.arrowBtn}
          className={
            activePath === "/"
              ? "w-3 object-contain filter invert dark-0"
              : "w-3 object-contain"
          }
        />
      </ScrollToTopLink>
      <ScrollToTopLink
        to="/signin"
        className={
          activePath === "/signin"
            ? "flex flex-row items-center justify-between py-3 px-2 md:mx-2 cursor-pointer hover:text-black text-black rounded-lg bg-white mb-4"
            : "flex flex-row items-center justify-between py-3 md:mx-2 cursor-pointer hover:bg-hoverGray hover:text-white text-white rounded-lg px-2 mb-4"
        }
      >
        <div className="text-lg font-semibold hidden md:flex">
          <img
            src={images.appointment}
            className={
              activePath === "/signin"
                ? "w-[13%] object-contain mr-5 filter invert dark-0"
                : "w-[13%] object-contain mr-5"
            }
          />
          Appointment
        </div>
        <img
          src={images.arrowBtn}
          className={
            activePath === "/signin"
              ? "w-3 object-contain filter invert dark-0"
              : "w-3 object-contain"
          }
        />
      </ScrollToTopLink>
    </div>
  );
};

export default SideBar;
