import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken, setAuthToken } from "../../Store/AuthTokenSlice";
import useNavigate from "../ScrollToTopNavigate";

type Props = {
  showSidebar: boolean;
  showHamburger: boolean;
  setShowSidebar: any;
  isSmallScreen: boolean;
  shouldShowWhiteHeader: boolean
};

const Header = ({ showSidebar, showHamburger, setShowSidebar, isSmallScreen, shouldShowWhiteHeader }: Props) => {

  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const authToken = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (currentScrollPos > prevScrollPos && currentScrollPos > 30) {
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
    <div
      className={`flex flex-col items-center px-3 lg:px-4 pb-2 w-full fixed top-0 z-10 transition-transform duration-300 max-w-[2800px] 
        ${showSidebar ? 'md:pr-[28%] lg:pr-[23%] xl:pr-[21%] 2xl:pr-[15%]' : ''} 
        ${isVisible ? "translate-y-0" : "-translate-y-full"}
        ${shouldShowWhiteHeader ? 'bg-transparent' : 'bg-gradient-to-b from-black to-transparent'}
        `}
    >
      <div className="bg-transparent flex flex-row items-center h-20 justify-between w-full">
        <img
          onClick={() => navigate('')}
          src={shouldShowWhiteHeader ? images.truLogoForWhite : images.truLogo}
          className={`${showSidebar && !isSmallScreen && "hidden"
            } w-14 sm:w-16 lg:h-17 lg:w-20 cursor-pointer`}
        />
        <div className={`hidden sm:flex flex-row bg-white/30 backdrop-blur-lg w-[50%] lg:w-[40%] items-center rounded-lg p-2 ${shouldShowWhiteHeader ? 'border border-black' : 'border border-white-500'}`}>
          <img src={images.searchBar} className={`h-5 w-5 ${shouldShowWhiteHeader && 'filter invert'}`} />
          <input
            type="text"
            placeholder="Search"
            className={`focus:outline-none ml-[3%] border-none bg-transparent w-full ${shouldShowWhiteHeader ? 'text-black placeholder:text-black' : 'text-inputGray placeholder:inputGray'}`}
          // placeholder:text-red-500
          />
        </div>
        <div className="flex flex-row items-center">

          {authToken ? (
            <div className="flex flex-row items-center items-center justify-center ">
              <div
                className="border bg-black  rounded-lg ml-2 p-2 sm:p-[10px] flex items-center justify-center cursor-pointer"
                title="Bookmark"
              >
                <img
                  src={images.bookmarkIcon}
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                />
              </div>
              <div
                className="border bg-black  rounded-lg ml-2 p-2 sm:p-[10px] flex items-center justify-center cursor-pointer"
                title="Notification"
              >
                <img
                  src={images.notificationIcon}
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                />
              </div>
              <div
                className="border bg-black  rounded-lg ml-2 p-2 sm:p-[10px] flex items-center justify-center cursor-pointer"
                title="Chat"
              >
                <img
                  src={images.chatIcon}
                  alt="Chat"
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                />
              </div>

            </div>
          ) : (
            <div className="flex flex-row items-center">
              <img
                src={images.loginIcon}
                className={`w-[30px] object-contain mr-2 ${shouldShowWhiteHeader && 'filter invert'}`}
              />
              <ScrollToTopLink to="/signin" className={`cursor-pointer ${shouldShowWhiteHeader ? 'text-black' : 'text-white'}`}>
                Sign In
              </ScrollToTopLink>
              <div className={`mx-2 ${shouldShowWhiteHeader ? 'text-black' : 'text-white'}`}>/</div>
              <ScrollToTopLink to="/signup" className={`cursor-pointer ${shouldShowWhiteHeader ? 'text-black' : 'text-white'}`}>
                Sign Up
              </ScrollToTopLink>
            </div>
          )}
          {
            showHamburger &&
            <svg
              onClick={() => setShowSidebar(true)}
              className={
                `w-10 h-10 ml-3 ${shouldShowWhiteHeader ? 'text-black' : 'text-white'}`
              }
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          }
        </div>
      </div>
      <div className={`sm:hidden flex flex-row bg-white/30 backdrop-blur-lg w-[100%] lg:w-[40%] items-center rounded-lg p-2 ${shouldShowWhiteHeader ? 'border border-black' : 'border border-white-500'}`}>
        <img src={images.searchBar} className={`h-5 w-5 ${shouldShowWhiteHeader && 'filter invert'}`} />
        <input
          type="text"
          placeholder="Search"
          className={`focus:outline-none ml-[3%] border-none bg-transparent w-full ${shouldShowWhiteHeader ? 'text-black placeholder:text-black' : 'text-inputGray placeholder:inputGray'}`}
        />
      </div>
    </div>
  );
};

export default Header;
