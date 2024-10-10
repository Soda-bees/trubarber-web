import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken, setAuthToken } from "../../Store/AuthTokenSlice";

type Props = {
  showSidebar: boolean;
};

const Header = ({ showSidebar }: Props) => {
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const authToken = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

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
  

  // const handleToken = () => {
  //   dispatch(setAuthToken(token));
  // }




  // console.log(token);
  

  return (
    <div
      className={`flex flex-col items-center px-3 lg:px-8 w-full fixed top-0 z-10 transition-transform duration-300 max-w-[2800px] sm:pr-[15%] md:pr-[37%] lg:pr-[25%] xl:pr-[20%] 2xl:pr-[17%] ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="bg-transparent flex flex-row items-center h-20 justify-between w-full">
        <img
          src={images.truLogo}
          className={`${
            showSidebar && "hidden"
          } w-14 sm:w-16 lg:h-17 lg:w-20 cursor-pointer`}
        />
        <div className="hidden sm:flex flex-row bg-white/30 backdrop-blur-lg border border-white-500 w-[50%] lg:w-[40%] items-center rounded-lg p-2 ">
          <img src={images.searchBar} className="h-5 w-5" />
          <input
            type="text"
            placeholder="Search Services"
            className="focus:outline-none ml-[3%] border-none bg-transparent w-full text-inputGray"
          />
        </div>
        {!authToken ? (
          <div className="flex flex-row items-center items-center justify-center">
            <div
              className="border bg-black  rounded-2xl ml-2 px-5 h-12 flex items-center justify-center cursor-pointer"
              title="Bookmark"
            >
              <img
                src={images.bookmarkIcon}
                className="w-[16px] object-contain"
              />
            </div>
            <div
              className="border bg-black  rounded-2xl ml-2 px-5 h-12 flex items-center justify-center cursor-pointer"
              title="Notification"
            >
              <img
                src={images.notificationIcon}
                className="w-[16px] object-contain"
              />
            </div>
            <div
              className="border bg-black  rounded-2xl ml-2 px-5 h-12 flex items-center justify-center cursor-pointer"
              title="Chat"
            >
              <img
                src={images.chatIcon}
                alt="Chat"
                className="w-[16px] object-contain"
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-row items-center">
            <img
              src={images.loginIcon}
              className="w-[30px] object-contain mr-2"
            />
            <ScrollToTopLink to="/signin" className="text-white cursor-pointer">
              Sign In
            </ScrollToTopLink>
            <div className="text-white mx-2">/</div>
            <ScrollToTopLink to="/signup" className="text-white cursor-pointer">
              Sign Up
            </ScrollToTopLink>
          </div>
        )}
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
