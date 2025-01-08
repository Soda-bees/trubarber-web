import React, { useState, useEffect } from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";
import { useLocation } from "react-router-dom";
import SmallButton from "../SmallButton";
import useNavigate from "../ScrollToTopNavigate";
import { useDispatch, useSelector } from "react-redux";
import { clearUser, selectUser } from "../../Store/userDataSlice";
import { clearAuthToken } from "../../Store/AuthTokenSlice";
import { getAddressFromCoordinates } from "../../services/config/Api";
import { removePendingAppointment } from "../../Store/PendingAppointment";
import { motion, AnimatePresence } from "framer-motion";
import TopToBottomAnimation from "../TopToBottomAnimation";
import BottomToTopAnimation from "../BottomToTopAnimation";
import Button from "../Button";
import { selectRole } from "../../Store/Role";

type Props = {
  showSidebar: boolean;
  isSmallScreen: boolean;
  setShowSidebar: any;
  showLogoutModal: boolean;
  setShowLogoutModal: any
};

const SideBar = ({ showSidebar, isSmallScreen, setShowSidebar, showLogoutModal, setShowLogoutModal }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const role = useSelector(selectRole)

  const location = useLocation();
  const activePath = location.pathname;
  const [profileDropDown, setProfileDropDown] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('')
  const [addressLodaer, setAddressLodaer] = useState<boolean>(false)

  const handleLogout = async () => {
    setShowLogoutModal(false)
    dispatch(clearAuthToken());
    dispatch(clearUser())
  };

  useEffect(() => {
    handleGetUserAddress()
  }, [user])

  const handleGetUserAddress = async () => {
    try {
      setAddressLodaer(true)
      const fetchedAddress = await getAddressFromCoordinates(user?.location?.latitude, user?.location?.longitude);
      if (fetchedAddress) {
        setAddress(fetchedAddress)
        setAddressLodaer(false)
      } else {
        setAddressLodaer(false)
      }
    } catch (error) {
      console.log(error);
      setAddressLodaer(false)
    }
  }

  const sidebarClass = isSmallScreen
    ? showSidebar
      ? "fixed w-[70%] xs:w-[50%] sm:w-[40%] md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] left-0 top-0 h-[100vh] bg-black z-50 py-6"
      : "fixed w-[80%] md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] left-0 top-0 h-[100vh] bg-black z-50"
    : "sticky max-h-screen relative top-0 left-0 w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] bg-black py-6";

  return (
    <AnimatePresence >
      <motion.div
        initial={{ x: -300, opacity: 0, scale: 0.8 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: -300, opacity: 0, scale: 0.8 }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className={`${sidebarClass} z-50`}
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeOut",
          }}
          className="h-full flex flex-col items-center justify-between"
        >

          <div className="text-white w-full">
            <div>
              <div className="pl-4 lg:pl-6 flex flex-col justify-between">
                <img
                  onClick={() => navigate("/")}
                  src={images.truLogo}
                  className="w-[40%] cursor-pointer"
                  alt="Logo"
                />
                <img
                  src={user?.profile ? user?.profile : user?.gender === 'male' ? images.male : images.female}
                  className="w-[80px] h-[80px] mt-8 mb-5 rounded-full"
                />
                <div>
                  <div className="font-bold text-lg text-white">{user?.name}</div>
                  <div className="text-sm flex flex-row items-start text-white my-2">
                    {
                      addressLodaer ?
                        <div
                          className="inline-block h-4 w-4 animate-spin rounded-full border-2  border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                          role="status">
                        </div>
                        :
                        <img
                          src={images.Location}
                          className="w-3 filter invert brightness-0 mr-2 mt-1"
                          alt="Location"
                        />
                    }
                    <div className="">

                      {address || addressLodaer && 'Loading...'}
                    </div>
                  </div>
                  {
                    role === 'barber' &&
                    <div className="text-sm flex flex-row items-start text-white my-2">
                      <img
                        src={images.phone}
                        className="w-3 filter invert brightness-0 mr-2 mt-1"
                        alt="Location"
                      />
                      {user?.phone}
                    </div>
                  }
                </div>
                <div className="flex flex-row">
                  <div className="text-hoverGray">Gender</div>
                  <div className="text-white ml-4">
                    {user?.gender ? user?.gender?.charAt(0)?.toUpperCase() + user?.gender?.slice(1) : ""}
                  </div>
                </div>
              </div>
              <div className="bg-hoverGray w-full mx-auto h-[1px] my-6"></div>
            </div>
            <div className=" overflow-y-scroll hide-scrollbar h-[40vh]">

              {
                role === 'user' ?
                  <ScrollToTopLink
                    to="/"
                    className={`flex justify-between items-center p-3 mx-2 mb-4 rounded-lg ${activePath === "/"
                      ? "bg-white text-black"
                      : "text-white hover:bg-hoverGray hover:text-white"
                      }`}
                  >
                    <div className="text-lg font-semibold flex items-center">
                      <img
                        src={images.explore}
                        className={`w-5 mr-5 ${activePath === "/" ? "filter invert dark-0" : ""
                          }`}
                        alt="Explore"
                      />
                      Explore
                    </div>
                    <img
                      src={images.arrowBtn}
                      className={`w-3 ${activePath === "/" ? "filter invert dark-0" : ""
                        }`}
                      alt="Arrow"
                    />
                  </ScrollToTopLink> :
                  <ScrollToTopLink
                    to="/barber-dashboard"
                    className={`flex justify-between items-center p-3 mx-2 mb-4 rounded-lg ${activePath === "/barber-dashboard"
                      ? "bg-white text-black"
                      : "text-white hover:bg-hoverGray hover:text-white"
                      }`}
                  >
                    <div className="text-lg font-semibold flex items-center">
                      <img
                        src={images.explore}
                        className={`w-5 mr-5 ${activePath === "/barber-dashboard" ? "filter invert dark-0" : ""
                          }`}
                        alt="Dashboard"
                      />
                      Dashboard
                    </div>
                    <img
                      src={images.arrowBtn}
                      className={`w-3 ${activePath === "/barber-dashboard" ? "filter invert dark-0" : ""
                        }`}
                      alt="Arrow"
                    />
                  </ScrollToTopLink>
              }
              <ScrollToTopLink
                to="/appointment"
                className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${activePath === "/appointment"
                  ? "bg-white text-black"
                  : "text-white hover:bg-hoverGray hover:text-white"
                  }`}
              >
                <div className="text-lg font-semibold flex items-center">
                  <img
                    src={images.appointment}
                    className={`w-5 mr-5 ${activePath === "/appointment" ? "filter invert dark-0" : ""
                      }`}
                    alt="Appointment"
                  />
                  Appointment
                </div>
                <img
                  src={images.arrowBtn}
                  className={`w-3 ${activePath === "/appointment" ? "filter invert dark-0" : ""
                    }`}
                  alt="Arrow"
                />
              </ScrollToTopLink>
              {
                role === 'user' ?
                  <ScrollToTopLink
                    to="/wallet"
                    className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${activePath === "/wallet"
                      ? "bg-white text-black"
                      : "text-white hover:bg-hoverGray hover:text-white"
                      }`}
                  >
                    <div className="text-lg font-semibold flex items-center">
                      <img
                        src={images.wallet}
                        className={`w-5 mr-5 ${activePath === "/wallet" ? "filter invert dark-0" : ""
                          }`}
                        alt="Wallet"
                      />
                      Wallet
                    </div>
                    <img
                      src={images.arrowBtn}
                      className={`w-3 ${activePath === "/wallet" ? "filter invert dark-0" : ""
                        }`}
                      alt="Arrow"
                    />
                  </ScrollToTopLink> :
                  <ScrollToTopLink
                    to="/catalouge"
                    className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${activePath === "/catalouge"
                      ? "bg-white text-black"
                      : "text-white hover:bg-hoverGray hover:text-white"
                      }`}
                  >
                    <div className="text-lg font-semibold flex items-center">
                      <img
                        src={images.catalouge}
                        className={`w-5 mr-5 ${activePath !== "/catalouge" ? "filter invert dark-0" : ""
                          }`}
                        alt="catalouge"
                      />
                      Catalogue
                    </div>
                    <img
                      src={images.arrowBtn}
                      className={`w-3 ${activePath === "/catalouge" ? "filter invert dark-0" : ""
                        }`}
                      alt="Arrow"
                    />
                  </ScrollToTopLink>
              }
              {
                role === 'user' &&
                <ScrollToTopLink
                  to="/favourite"
                  className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${activePath === "/favourite"
                    ? "bg-white text-black"
                    : "text-white hover:bg-hoverGray hover:text-white"
                    }`}
                >
                  <div className="text-lg font-semibold flex items-center">
                    <img
                      src={images.bookmarkIcon}
                      className={`w-5 mr-5 ${activePath === "/favourite" ? "filter invert dark-0" : ""
                        }`}
                      alt="favourite"
                    />
                    Favourite
                  </div>
                  <img
                    src={images.arrowBtn}
                    className={`w-3 ${activePath === "/favourite" ? "filter invert dark-0" : ""
                      }`}
                    alt="Arrow"
                  />
                </ScrollToTopLink>
              }
              <ScrollToTopLink
                to="/chat"
                className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${activePath === "/chat"
                  ? "bg-white text-black"
                  : "text-white hover:bg-hoverGray hover:text-white"
                  }`}
              >
                <div className="text-lg font-semibold flex items-center">
                  <img
                    src={images.chatIcon}
                    className={`w-5 mr-5 ${activePath === "/chat" ? "filter invert dark-0" : ""
                      }`}
                    alt="chat"
                  />
                  Inbox
                </div>
                <img
                  src={images.arrowBtn}
                  className={`w-3 ${activePath === "/chat" ? "filter invert dark-0" : ""
                    }`}
                  alt="Arrow"
                />
              </ScrollToTopLink>
              <div
                className={`flex justify-between items-center py-3 px-2 mx-2 mb-2 rounded-lg cursor-pointer ${activePath === "/edit-profile" || activePath === "/security"
                  ? "bg-white text-black"
                  : "text-white hover:bg-hoverGray hover:text-white"
                  }`}
                onClick={() => setProfileDropDown(!profileDropDown)}
              >
                <div className="text-lg font-semibold flex items-center">
                  <img
                    src={user?.profile ? user?.profile : images.profile}
                    className={`w-6 h-6 mr-4 rounded-full ${activePath === "/edit-profile" || activePath === "/security"
                      ? ""
                      : ""
                      }`}
                    alt="Profile"
                  />
                  Profile
                </div>
                <img
                  src={images.arrowBtn}
                  className={`w-3 object-contain
            ${profileDropDown ? "rotate-90" : ""}
            ${profileDropDown &&
                      (activePath === "/edit-profile" || activePath === "/security")
                      ? "filter invert dark-0"
                      : ""
                    }
            ${!profileDropDown &&
                      (activePath === "/edit-profile" || activePath === "/security")
                      ? "filter invert dark-0"
                      : ""
                    }
          `}
                  alt="Arrow"
                />
              </div>
              {profileDropDown && (
                <div className="ml-6">
                  <ScrollToTopLink
                    to="/edit-profile"
                    className={`flex justify-between items-center px-2 mx-2 mb-2 w-[70%] self-center ${activePath === "/edit-profile"
                      ? "text-white font-bold"
                      : "text-hoverGray hover:text-white"
                      }`}
                  >
                    <div className="font-light flex items-center font-semibold">
                      <img
                        src={
                          activePath === "/edit-profile"
                            ? images.editProfileWhite
                            : images.editProfile
                        }
                        className="w-4 mr-5"
                        alt="Edit Profile"
                      />
                      Edit Profile
                    </div>
                  </ScrollToTopLink>
                  <ScrollToTopLink
                    to="/security"
                    className={`flex items-center px-2 mx-2 mb-2 w-[70%] self-center ${activePath === "/security"
                      ? "text-white font-bold"
                      : "text-hoverGray hover:text-white"
                      }`}
                  >
                    <div className="font-light flex items-center font-semibold">
                      <img
                        src={
                          activePath === "/security"
                            ? images.securityWhite
                            : images.security
                        }
                        className="w-4 mr-5"
                        alt="Security"
                      />
                      Security
                    </div>
                  </ScrollToTopLink>
                </div>
              )}
            </div>
          </div>

          <div className="border border-white rounded-xl w-[90%] mx-auto">
            <SmallButton
              dark={true}
              title="Logout"
              image={images.logout}
              onClick={() => setShowLogoutModal(true)}
            />
          </div>
          {
            showLogoutModal &&
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 max-w-[2800px] mx-auto z-20 select-none">
              <BottomToTopAnimation className="bg-white w-[90%] sm:w-4/5 md:w-2/3 lg:w-1/3 flex flex-col p-2 xs:p-6 rounded-xl shadow-lg ">
                <div className="font-semibold text-black text-lg text-center">Are you leaving?</div>
                <div className="mt-2 text-black text-md text-center">Are you sure you want to logout? You'll need to signin again to access your account.</div>
                <div className="flex flex-row items-center justify-between gap-2 mt-4">
                  <Button light title="Cancel" hideImg onClick={() => setShowLogoutModal(false)} />
                  <Button light={false} title="Logout Anyway" hideImg onClick={handleLogout} />
                </div>
              </BottomToTopAnimation>
            </div>
          }
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SideBar;
