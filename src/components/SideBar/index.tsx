// import React, { useEffect, useState } from "react";
// import images from "../../services/config/images";
// import ScrollToTopLink from "../ScrollToTopLink";
// import { useLocation } from "react-router-dom";

// type Props = {
//   showSidebar: boolean;
// };

// const SideBar = ({ showSidebar }: Props) => {
//   const location = useLocation();
//   const activePath = location.pathname;
//   const [profileDropDown, setProfileDropDown] = useState<boolean>(false);
//   const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 768);

//   useEffect(() => {
//     const handleResize = () => {
//       setIsSmallScreen(window.innerWidth < 768);
//     };

//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//     };
//   }, []);

//   return (
//     <div
//       className={`sticky max-h-screen relative top-0 left-0  bg-black py-8 transition-all duration-300
//       ${
//         showSidebar
//           ? "flex w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%]"
//           : "hidden"
//       } 
//       flex-col z-50`}
//     >
//       <div className="pl-4 lg:pl-6 flex flex-col justify-between">
//         <img
//           src={images.truLogo}
//           className="w-[40%] cursor-pointer"
//           alt="Logo"
//         />
//         <img
//           src={images.reviewBarber}
//           className="w-[35%] mt-8 mb-5"
//           alt="Review"
//         />
//         <div>
//           <div className="font-bold text-lg text-white">Cameron Williamson</div>
//           <div className="text-sm flex flex-row items-center text-white my-2">
//             <img
//               src={images.Location}
//               className="w-3 filter invert brightness-0 mr-2"
//               alt="Location"
//             />
//             Royal Ln. Mesa, New Jersey
//           </div>
//         </div>
//         <div className="flex flex-row">
//           <div className="text-hoverGray">Gender</div>
//           <div className="text-white ml-4">Male</div>
//         </div>
//       </div>
//       <div className="w-[94%] mx-auto h-px bg-hoverGray my-10" />

//       <ScrollToTopLink
//         to="/"
//         className={`flex justify-between items-center p-3 mx-2 mb-4 rounded-lg ${
//           activePath === "/"
//             ? "bg-white text-black"
//             : "text-white hover:bg-hoverGray hover:text-white"
//         }`}
//       >
//         <div className="text-lg font-semibold hidden md:flex items-center">
//           <img
//             src={images.explore}
//             className={`w-5 mr-5 ${
//               activePath === "/" ? "filter invert dark-0" : ""
//             }`}
//             alt="Explore"
//           />
//           Explore
//         </div>
//         <img
//           src={images.arrowBtn}
//           className={`w-3 ${
//             activePath === "/" ? "filter invert dark-0" : ""
//           }`}
//           alt="Arrow"
//         />
//       </ScrollToTopLink>

//       <ScrollToTopLink
//         to="/appointment"
//         className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${
//           activePath === "/appointment"
//             ? "bg-white text-black"
//             : "text-white hover:bg-hoverGray hover:text-white"
//         }`}
//       >
//         <div className="text-lg font-semibold hidden md:flex items-center">
//           <img
//             src={images.appointment}
//             className={`w-5 mr-5 ${
//               activePath === "/appointment" ? "filter invert dark-0" : ""
//             }`}
//             alt="Appointment"
//           />
//           Appointment
//         </div>
//         <img
//           src={images.arrowBtn}
//           className={`w-3 ${
//             activePath === "/appointment" ? "filter invert dark-0" : ""
//           }`}
//           alt="Arrow"
//         />
//       </ScrollToTopLink>

//       <ScrollToTopLink
//         to="/wallet"
//         className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${
//           activePath === "/wallet"
//             ? "bg-white text-black"
//             : "text-white hover:bg-hoverGray hover:text-white"
//         }`}
//       >
//         <div className="text-lg font-semibold  md:flex items-center">
//           <img
//             src={images.wallet}
//             className={`w-5 mr-5 ${
//               activePath === "/wallet" ? "filter invert dark-0" : ""
//             }`}
//             alt="Wallet"
//           />
//           Wallet
//         </div>
//         <img
//           src={images.arrowBtn}
//           className={`w-3 ${
//             activePath === "/wallet" ? "filter invert dark-0" : ""
//           }`}
//           alt="Arrow"
//         />
//       </ScrollToTopLink>

//       <div
//         className={`flex justify-between items-center py-3 px-2 mx-2 mb-2 rounded-lg cursor-pointer ${
//           activePath === "/edit-profile" || activePath === "/security"
//             ? "bg-white text-black"
//             : "text-white hover:bg-hoverGray hover:text-white"
//         }`}
//         onClick={() => setProfileDropDown(!profileDropDown)}
//       >
//         <div className="text-lg font-semibold hidden md:flex items-center">
//           <img
//             src={images.profile}
//             className={`w-5 mr-5 ${
//               activePath === "/edit-profile" || activePath === "/security"
//                 ? "filter invert dark-0"
//                 : ""
//             }`}
//             alt="Profile"
//           />
//           Profile
//         </div>
//         <img
//           src={images.arrowBtn}
//           // className={`w-3 ${profileDropDown ? "rotate-90" : ""}`}
//           className={`w-3 object-contain
//             ${profileDropDown ? 'rotate-90' : ''}
//                         ${profileDropDown && (activePath === "/edit-profile" || activePath === "/security") ? 'filter invert dark-0' : ''}
//                         ${!profileDropDown && (activePath === "/edit-profile" || activePath === "/security") ? 'filter invert dark-0' : ''}
//                       `}
//           alt="Arrow"
//         />
//       </div>

//       {profileDropDown && (
//         <>
//           <ScrollToTopLink
//             to="/edit-profile"
//             className={`flex justify-between items-center px-2 mx-2 mb-2 w-[70%] self-center ${
//               activePath === "/edit-profile"
//                 ? "text-white font-bold"
//                 : "text-hoverGray hover:text-white"
//             }`}
//           >
//             <div className="font-light hidden md:flex items-center">
//               <img
//                 src={
//                   activePath === "/edit-profile"
//                     ? images.editProfileWhite
//                     : images.editProfile
//                 }
//                 className="w-4 mr-5"
//                 alt="Edit Profile"
//               />
//               Edit Profile
//             </div>
//           </ScrollToTopLink>
//           <ScrollToTopLink
//             to="/security"
//             className={`flex items-center px-2 mx-2 mb-2 w-[70%] self-center ${
//               activePath === "/security"
//                 ? "text-white font-bold"
//                 : "text-hoverGray hover:text-white"
//             }`}
//           >
//             <div className="font-light hidden md:flex items-center">
//               <img
//                 src={
//                   activePath === "/security"
//                     ? images.securityWhite
//                     : images.security
//                 }
//                 className="w-4 mr-5"
//                 alt="Security"
//               />
//               Security
//             </div>
//           </ScrollToTopLink>
//         </>
//       )}
//     </div>
//   );
// };

// export default SideBar;

import React, { useState, useEffect } from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";
import { useLocation } from "react-router-dom";

type Props = {
  showSidebar: boolean;
  isSmallScreen: boolean
};

const SideBar = ({ showSidebar, isSmallScreen }: Props) => {
  const location = useLocation();
  const activePath = location.pathname;
  const [profileDropDown, setProfileDropDown] = useState<boolean>(false);

  // Toggle sidebar visibility based on screen size and sidebar state
  // const sidebarClass = isSmallScreen
  //   ? showSidebar
  //     ? "fixed w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] left-0 top-0 h-screen bg-black transition-transform duration-400 transform translate-x-0"
  //     : "fixed w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] left-0 top-0 h-screen bg-black transition-transform duration-300 transform -translate-x-full"
  //   : "sticky max-h-screen relative top-0 left-0 w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] bg-black py-8";

  const sidebarClass = isSmallScreen
  ? showSidebar
    ? "fixed w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] left-0 top-0 h-screen bg-black transition-transform duration-500 ease-in-out transform translate-x-0 scale-100 opacity-100"
    : "fixed w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] left-0 top-0 h-screen bg-black transition-transform duration-500 ease-in-out transform -translate-x-full scale-90 opacity-0"
  : "sticky max-h-screen relative top-0 left-0 w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%] bg-black py-8";

  return (
    <div className={`${sidebarClass} flex flex-col z-50`}>
      <div className="pl-4 lg:pl-6 flex flex-col justify-between">
        <img
          src={images.truLogo}
          className="w-[40%] cursor-pointer"
          alt="Logo"
        />
        <img
          src={images.reviewBarber}
          className="w-[35%] mt-8 mb-5"
          alt="Review"
        />
        <div>
          <div className="font-bold text-lg text-white">Cameron Williamson</div>
          <div className="text-sm flex flex-row items-center text-white my-2">
            <img
              src={images.Location}
              className="w-3 filter invert brightness-0 mr-2"
              alt="Location"
            />
            Royal Ln. Mesa, New Jersey
          </div>
        </div>
        <div className="flex flex-row">
          <div className="text-hoverGray">Gender</div>
          <div className="text-white ml-4">Male</div>
        </div>
      </div>
      <div className="w-[94%] mx-auto h-px bg-hoverGray my-10" />

      <ScrollToTopLink
        to="/"
        className={`flex justify-between items-center p-3 mx-2 mb-4 rounded-lg ${activePath === "/"
          ? "bg-white text-black"
          : "text-white hover:bg-hoverGray hover:text-white"
          }`}
      >
        <div className="text-lg font-semibold hidden md:flex items-center">
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
      </ScrollToTopLink>

      <ScrollToTopLink
        to="/appointment"
        className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${activePath === "/appointment"
          ? "bg-white text-black"
          : "text-white hover:bg-hoverGray hover:text-white"
          }`}
      >
        <div className="text-lg font-semibold hidden md:flex items-center">
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

      <ScrollToTopLink
        to="/wallet"
        className={`flex justify-between items-center py-3 px-2 mx-2 mb-4 rounded-lg ${activePath === "/wallet"
          ? "bg-white text-black"
          : "text-white hover:bg-hoverGray hover:text-white"
          }`}
      >
        <div className="text-lg font-semibold  md:flex items-center">
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
      </ScrollToTopLink>

      <div
        className={`flex justify-between items-center py-3 px-2 mx-2 mb-2 rounded-lg cursor-pointer ${activePath === "/edit-profile" || activePath === "/security"
          ? "bg-white text-black"
          : "text-white hover:bg-hoverGray hover:text-white"
          }`}
        onClick={() => setProfileDropDown(!profileDropDown)}
      >
        <div className="text-lg font-semibold hidden md:flex items-center">
          <img
            src={images.profile}
            className={`w-5 mr-5 ${activePath === "/edit-profile" || activePath === "/security"
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
            ${profileDropDown ? 'rotate-90' : ''}
            ${profileDropDown && (activePath === "/edit-profile" || activePath === "/security") ? 'filter invert dark-0' : ''}
            ${!profileDropDown && (activePath === "/edit-profile" || activePath === "/security") ? 'filter invert dark-0' : ''}
          `}
          alt="Arrow"
        />
      </div>

      {profileDropDown && (
        <>
          <ScrollToTopLink
            to="/edit-profile"
            className={`flex justify-between items-center px-2 mx-2 mb-2 w-[70%] self-center ${activePath === "/edit-profile"
              ? "text-white font-bold"
              : "text-hoverGray hover:text-white"
              }`}
          >
            <div className="font-light hidden md:flex items-center">
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
            <div className="font-light hidden md:flex items-center">
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
  );
};

export default SideBar;

