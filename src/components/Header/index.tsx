import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";
import { useDispatch, useSelector } from "react-redux";
import { selectAuthToken, setAuthToken } from "../../Store/AuthTokenSlice";
import useNavigate from "../ScrollToTopNavigate";
import { motion, AnimatePresence } from "framer-motion";
import { selectUser, setNotificationSeenTrueRedux } from "../../Store/userDataSlice";
import { handleNotificationSeenTrue } from "../../services/config/Api";

type Props = {
  showSidebar: boolean;
  showHamburger: boolean;
  setShowSidebar: any;
  isSmallScreen: boolean;
  shouldShowWhiteHeader: boolean,
  showNotification: boolean,
  setShowNotification: any
};

const Header = ({ showSidebar, showHamburger, setShowSidebar, isSmallScreen, shouldShowWhiteHeader, showNotification, setShowNotification }: Props) => {

  const navigate = useNavigate()

  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const authToken = useSelector(selectAuthToken);
  const userData = useSelector(selectUser)
  const dispatch = useDispatch();
  const [unseenNotification , setUnseenNotification] = useState(0)

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

  useEffect(() => {
    if (userData?.notification?.length > 0) {
      handleCalculateTotalUnseenNotification();
    }
    if(showNotification){
      setSeenTrue()
    }
  }, [userData , showNotification])

  const setSeenTrue = async () => {
    try {
      let notificationsIds = [];
      if (userData?.role == 'user') {
        notificationsIds = userData?.notification.filter(
          (notification:any) => notification?.userSeen === false,
        );
      } else {
        notificationsIds = userData?.notification.filter(
          (notification:any) => notification?.barberSeen === false,
        );
      }
      if (notificationsIds?.length > 0) {
        const response = await handleNotificationSeenTrue(
          authToken,
          notificationsIds,
        );
        dispatch(setNotificationSeenTrueRedux());
      }
    } catch (error) {
      console.log('Error in update notification', error);
    }
  };

  

  const handleCalculateTotalUnseenNotification = async () => {
    const totalUnseenNotification = userData?.notification?.filter(
      (notification:any) =>
        userData?.role == 'user'
          ? notification?.userSeen === false
          : notification?.barberSeen === false,
    ).length;

    setUnseenNotification(totalUnseenNotification);
  };

  const calculateTimeAgo = (createdAt: string | number | Date): string => {
    const timestamp = new Date(createdAt);
    if (isNaN(timestamp.getTime())) {
      return 'Invalid date';
    }
  
    const currentDate = new Date();
    const timeDifference = Math.abs(currentDate.getTime() - timestamp.getTime());
  
    const minutes = Math.floor(timeDifference / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
  
    if (minutes < 1) {
      return 'just now';
    } else if (minutes < 60) {
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${hours}h ago`;
    } else if (days < 30) {
      return `${days}d ago`;
    } else if (months < 12) {
      return `${months} month${months > 1 ? 's' : ''} ago`;
    } else {
      return `${years} year${years > 1 ? 's' : ''} ago`;
    }
  };
  

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
          />
        </div>
        <div className="flex flex-row items-center">

          {authToken ? (
            <div className="flex flex-row items-center items-center justify-center ">

              <ScrollToTopLink
                to="/favourite"
                className="border bg-black  rounded-lg ml-2 p-2 sm:p-[10px] flex items-center justify-center cursor-pointer select-none"
                title="Bookmark"
              >
                <img
                  src={images.bookmarkIcon}
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                />
              </ScrollToTopLink>


              <ScrollToTopLink
                to="/chat"
                className="border bg-black  rounded-lg ml-2 p-2 sm:p-[10px] flex items-center justify-center cursor-pointer select-none"
                title="Chat"
              >
                <img
                  src={images.chatIcon}
                  alt="Chat"
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                />
              </ScrollToTopLink>
              <div className="relative select-none" >
                <div
                  onClick={() => setShowNotification(!showNotification)}
                  className="border bg-black  rounded-lg ml-2 p-2 sm:p-[10px] flex items-center justify-center cursor-pointer"
                  title="Notification"
                >
                  <img
                    src={images.notificationIcon}
                    className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                  />
                </div>
                {
                  unseenNotification > 0 &&
                  <div className="text-white bg-red-700 rounded-full absolute text-sm h-6 w-6 flex flex-row items-center justify-center font-semibold -top-2 -right-2">{unseenNotification}</div>
                }
                <AnimatePresence>
                  {showNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: -50, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, y: -50, scale: 0.9 }}
                      transition={{
                        duration: 0.4,
                        ease: "easeInOut",
                        type: 'tween',
                        stiffness: 200,
                      }}
                      className="bg-white rounded-xl mt-3 shadow-2xl absolute right-0 w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] xl:w-[30vw] z-50 pb-1 sm:pb-0"
                    >
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.1,
                          duration: 0.3,
                          ease: "easeOut",
                        }}
                      >
                        <div className="flex flex-row items-center justify-between border-b-2 border-inputGray p-4">
                          <div>Notifications</div>
                          <motion.img
                            src={images.cross}
                            className="w-4 cursor-pointer"
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 1.5 }}
                            alt="cross icon"
                            onClick={() => setShowNotification(false)}
                          />
                        </div>

                        {
                          userData?.notification?.length > 0 ? (
                            <div className="p-1 sm:p-4 flex flex-col gap-2 h-[40vh] overflow-y-scroll hide-scrollbar">
                              { 
                                userData?.notification?.map((item: any, index: number) => {
                                  const timeAgo = calculateTimeAgo(item.createdAt);
                                  return (
                                    <div key={index} className="bg-white shadow-xl flex flex-row items-center p-2 rounded-lg">
                                      <div className="bg-inputGray p-4 rounded-full hidden sm:flex">
                                        <img src={images.appointment} className="w-5 filter invert" />
                                      </div>
                                      <div className="sm:ml-3">
                                        <div className="font-semibold text-sm">{item?.title}</div>
                                        <div className="text-xs">{item.body}</div>
                                        <div className="text-xs">{timeAgo}</div>
                                      </div>
                                    </div>
                                  )
                                }).reverse()
                              }
                            </div>
                          ) : (
                            <div className="font-semibold p-4"> You don't have any notifications yet</div>
                          )
                        }
                        {/* </div> */}
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
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
