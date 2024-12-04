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

type Props = {
  showSidebar: boolean;
  isSmallScreen: boolean;
};

const SideBar = ({ showSidebar, isSmallScreen }: Props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  console.log("userlog", user);

  const location = useLocation();
  const activePath = location.pathname;
  const [profileDropDown, setProfileDropDown] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('')
  const [addressLodaer, setAddressLodaer] = useState<boolean>(false)

  const handleLogout = async () => {
    dispatch(clearUser());
    dispatch(clearAuthToken());
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
      ? "fixed w-[70%] xs:w-[50%] sm:w-[40%] md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] left-0 top-0 h-[100vh] bg-black z-50 animate-slideIn  py-8"
      : "fixed w-[80%] md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] left-0 top-0 h-[100vh] bg-black z-50 animate-slideOut"
    : "sticky max-h-screen relative top-0 left-0 w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] bg-black py-8";

  console.log(user);

  return (
    <div className={`${sidebarClass} flex flex-col z-50`}>
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
          alt="Review"
        />
        <div>
          <div className="font-bold text-lg text-white">{user?.name}</div>
          <div className="text-sm flex flex-row items-center text-white my-2">
            {
              addressLodaer ?
                <div
                  className="inline-block h-4 w-4 animate-spin rounded-full border-2  border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                  role="status">
                </div>
                :
                <img
                  src={images.Location}
                  className="w-3 filter invert brightness-0 mr-2"
                  alt="Location"
                />
            }
            <div className="">

            {address || addressLodaer && 'Loading...'}
            </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="text-hoverGray">Gender</div>
          <div className="text-white ml-4">
          {user?.gender ? user?.gender?.charAt(0)?.toUpperCase() + user?.gender?.slice(1) : ""}
          </div>
        </div>
      </div>
      <div className="w-[94%] mx-auto h-px bg-hoverGray my-10" />
      <div className="overflow-y-scroll hide-scrollbar h-full">
        <ScrollToTopLink
          to="/"
          className={`flex justify-between items-center p-3 mx-2 mb-4 rounded-lg ${
            activePath === "/"
              ? "bg-white text-black"
              : "text-white hover:bg-hoverGray hover:text-white"
          }`}
        >
          <div className="text-lg font-semibold flex items-center">
            <img
              src={images.explore}
              className={`w-5 mr-5 ${
                activePath === "/" ? "filter invert dark-0" : ""
              }`}
              alt="Explore"
            />
            Explore
          </div>
          <img
            src={images.arrowBtn}
            className={`w-3 ${
              activePath === "/" ? "filter invert dark-0" : ""
            }`}
            alt="Arrow"
          />
        </ScrollToTopLink>
        <ScrollToTopLink
          to="/appointment"
          className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${
            activePath === "/appointment"
              ? "bg-white text-black"
              : "text-white hover:bg-hoverGray hover:text-white"
          }`}
        >
          <div className="text-lg font-semibold flex items-center">
            <img
              src={images.appointment}
              className={`w-5 mr-5 ${
                activePath === "/appointment" ? "filter invert dark-0" : ""
              }`}
              alt="Appointment"
            />
            Appointment
          </div>
          <img
            src={images.arrowBtn}
            className={`w-3 ${
              activePath === "/appointment" ? "filter invert dark-0" : ""
            }`}
            alt="Arrow"
          />
        </ScrollToTopLink>
        <ScrollToTopLink
          to="/wallet"
          className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${
            activePath === "/wallet"
              ? "bg-white text-black"
              : "text-white hover:bg-hoverGray hover:text-white"
          }`}
        >
          <div className="text-lg font-semibold flex items-center">
            <img
              src={images.wallet}
              className={`w-5 mr-5 ${
                activePath === "/wallet" ? "filter invert dark-0" : ""
              }`}
              alt="Wallet"
            />
            Wallet
          </div>
          <img
            src={images.arrowBtn}
            className={`w-3 ${
              activePath === "/wallet" ? "filter invert dark-0" : ""
            }`}
            alt="Arrow"
          />
        </ScrollToTopLink>

        <div
          className={`flex justify-between items-center py-3 px-2 mx-2 mb-2 rounded-lg cursor-pointer ${
            activePath === "/edit-profile" || activePath === "/security"
              ? "bg-white text-black"
              : "text-white hover:bg-hoverGray hover:text-white"
          }`}
          onClick={() => setProfileDropDown(!profileDropDown)}
        >
          <div className="text-lg font-semibold flex items-center">
            <img
              src={images.profile}
              className={`w-5 mr-5 ${
                activePath === "/edit-profile" || activePath === "/security"
                  ? "filter invert dark-0"
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
            ${
              profileDropDown &&
              (activePath === "/edit-profile" || activePath === "/security")
                ? "filter invert dark-0"
                : ""
            }
            ${
              !profileDropDown &&
              (activePath === "/edit-profile" || activePath === "/security")
                ? "filter invert dark-0"
                : ""
            }
          `}
            alt="Arrow"
          />
        </div>

        {profileDropDown && (
          <>
            <ScrollToTopLink
              to="/edit-profile"
              className={`flex justify-between items-center px-2 mx-2 mb-2 w-[70%] self-center ${
                activePath === "/edit-profile"
                  ? "text-white font-bold"
                  : "text-hoverGray hover:text-white"
              }`}
            >
              <div className="font-light flex items-center">
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
              className={`flex items-center px-2 mx-2 mb-2 w-[70%] self-center ${
                activePath === "/security"
                  ? "text-white font-bold"
                  : "text-hoverGray hover:text-white"
              }`}
            >
              <div className="font-light flex items-center">
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
          </>
        )}
      </div>
      <div className="border border-white rounded-xl w-[90%] mx-auto">
        <SmallButton
          dark={true}
          title="Logout"
          image={images.logout}
          onClick={handleLogout}
        />
      </div>
    </div>
  );
};

export default SideBar;
