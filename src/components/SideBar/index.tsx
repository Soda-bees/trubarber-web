// import React, { useState } from "react";
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

//   return (
//     <div
//       className={`flex-col sticky top-0 max-h-screen relative bg-black w-[15%] py-10 md:w-[37%] lg:w-[25%] xl:w-[20%] 2xl:w-[17%] ${
//         showSidebar ? "flex" : "hidden"
//       }`}
//     >
//       <div className="px-8 flex flex-col justify-between">
//         <img src={images.truLogo} className="w-[50%] cursor-pointer" />
//         <img src={images.reviewBarber} className="w-[40%] mt-10 mb-5" />
//         <div>
//           <div className="font-bold text-lg text-white">Cameron Williamson</div>
//           <div className="text-sm flex flex-row items-center text-white my-2">
//             <img
//               src={images.Location}
//               className="w-3 filter invert brightness-0 mr-2"
//             />
//             Royal Ln. Mesa, New Jersey
//           </div>
//         </div>
//         <div className="flex flex-row">
//           <div className="text-hoverGray">Gender</div>
//           <div className="text-white ml-4">Male</div>
//         </div>
//       </div>
//       <div className="w-full h-px text-white bg-hoverGray my-10" />
//       <ScrollToTopLink
//         to="/"
//         className={
//           activePath === "/"
//             ? "flex flex-row items-center justify-between p-3 mx-2 cursor-pointer hover:text-black text-black rounded-lg bg-white mb-4"
//             : "flex flex-row items-center justify-between p-3 mx-2 cursor-pointer hover:bg-hoverGray hover:text-white text-white rounded-lg mb-4"
//         }
//       >
//         <div className="text-lg font-semibold hidden md:flex">
//           <img
//             src={images.explore}
//             className={
//               activePath === "/"
//                 ? "w-[18%] object-contain mr-5 filter invert dark-0"
//                 : "w-[18%] object-contain mr-5"
//             }
//           />
//           Explore
//         </div>
//         <img
//           src={images.arrowBtn}
//           className={
//             activePath === "/"
//               ? "w-3 object-contain filter invert dark-0"
//               : "w-3 object-contain"
//           }
//         />
//       </ScrollToTopLink>
//       <ScrollToTopLink
//         to="/appointment"
//         className={
//           activePath === "/appointment"
//             ? "flex flex-row items-center justify-between py-3 px-2 md:mx-2 cursor-pointer hover:text-black text-black rounded-lg bg-white mb-4"
//             : "flex flex-row items-center justify-between py-3 md:mx-2 cursor-pointer hover:bg-hoverGray hover:text-white text-white rounded-lg px-2 mb-4"
//         }
//       >
//         <div className="text-lg font-semibold hidden md:flex">
//           <img
//             src={images.appointment}
//             className={
//               activePath === "/appointment"
//                 ? "w-[13%] object-contain mr-5 filter invert dark-0"
//                 : "w-[13%] object-contain mr-5"
//             }
//           />
//           Appointment
//         </div>
//         <img
//           src={images.arrowBtn}
//           className={
//             activePath === "/appointment"
//               ? "w-3 object-contain filter invert dark-0"
//               : "w-3 object-contain"
//           }
//         />
//       </ScrollToTopLink>
//       <ScrollToTopLink
//         to="/wallet"
//         className={
//           activePath === "/wallet"
//             ? "flex flex-row items-center justify-between py-3 px-2 md:mx-2 cursor-pointer hover:text-black text-black rounded-lg bg-white mb-4"
//             : "flex flex-row items-center justify-between py-3 md:mx-2 cursor-pointer hover:bg-hoverGray hover:text-white text-white rounded-lg px-2 mb-4"
//         }
//       >
//         <div className="text-lg font-semibold hidden md:flex">
//           <img
//             src={images.wallet}
//             className={
//               activePath === "/wallet"
//                 ? "w-[20%] object-contain mr-5 filter invert dark-0"
//                 : "w-[20%] object-contain mr-5"
//             }
//           />
//           Wallet
//         </div>
//         <img
//           src={images.arrowBtn}
//           className={
//             activePath === "/wallet"
//               ? "w-3 object-contain filter invert dark-0"
//               : "w-3 object-contain"
//           }
//         />
//       </ScrollToTopLink>
//       <div
//         className={
//           activePath === "/edit-profile" || activePath === "/security"
//             ? "flex flex-row items-center justify-between py-3 md:mx-2 cursor-pointer  text-black rounded-lg px-2 mb-2 rounded-lg bg-white"
//             : "flex flex-row items-center justify-between py-3 md:mx-2 cursor-pointer hover:bg-hoverGray hover:text-white text-white rounded-lg px-2 mb-2"
//         }
//         onClick={() => setProfileDropDown(!profileDropDown)}
//       >
//         <div className="text-lg font-semibold hidden md:flex">
//           <img
//             src={images.profile}
//             className={
//               activePath === "/edit-profile" || activePath === "/security"
//                 ? "w-[20%] object-contain mr-5 filter invert dark-0"
//                 : "w-[20%] object-contain mr-5"
//             }
//           />
//           Profile
//         </div>
//         <img
//           src={images.arrowBtn}
//           className={`w-3 object-contain
//             ${profileDropDown ? 'rotate-90' : ''}
//             ${profileDropDown && (activePath === "/edit-profile" || activePath === "/security") ? 'filter invert dark-0' : ''}
//             ${!profileDropDown && (activePath === "/edit-profile" || activePath === "/security") ? 'filter invert dark-0' : ''}
//           `}
//         />
//       </div>
//       {profileDropDown && (
//         <>
//           <ScrollToTopLink
//             to="/edit-profile"
//             className={
//               activePath === "/edit-profile"
//                 ? "flex flex-row items-center justify-between px-2 md:mx-2 cursor-pointer text-white font-extrabold mb-2 w-[70%] self-center"
//                 : "flex flex-row items-center justify-between md:mx-2 cursor-pointer text-hoverGray px-2 mb-2 w-[70%] self-center"
//             }
//           >
//             <div className="font-light hidden md:flex">
//               <img
//                 src={
//                   activePath === "/edit-profile"
//                     ? images.editProfileWhite
//                     : images.editProfile
//                 }
//                 className={"w-[14%] object-contain mr-5"}
//               />
//               Edit Profile
//             </div>
//           </ScrollToTopLink>
//           <ScrollToTopLink
//             to="/security"
//             className={
//               activePath === "/security"
//                 ? "flex flex-row items-center justify-between px-2 md:mx-2 cursor-pointer text-white font-extrabold mb-2 w-[70%] self-center"
//                 : "flex flex-row items-center justify-between md:mx-2 cursor-pointer text-hoverGray px-2 mb-2 w-[70%] self-center"
//             }
//           >
//             <div className="font-light hidden md:flex">
//               <img
//                 src={
//                   activePath === "/security"
//                     ? images.securityWhite
//                     : images.security
//                 }
//                 className={"w-[14%] object-contain mr-5"}
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

import React, { useState } from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";
import { useLocation } from "react-router-dom";

type Props = {
  showSidebar: boolean;
};

const SideBar = ({ showSidebar }: Props) => {
  const location = useLocation();
  const activePath = location.pathname;
  const [profileDropDown, setProfileDropDown] = useState<boolean>(false);

  return (
    <div
      className={`sticky max-h-screen relative top-0 left-0  bg-black py-8 transition-all duration-300
      ${
        showSidebar
          ? "flex w-64 md:w-[37%] lg:w-[28%] xl:w-[25%] 2xl:w-[17%]"
          : "hidden"
      } 
      flex-col z-50`}
    >
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
        className={`flex justify-between items-center p-3 mx-2 mb-4 rounded-lg ${
          activePath === "/"
            ? "bg-white text-black"
            : "text-white hover:bg-hoverGray hover:text-white"
        }`}
      >
        <div className="text-lg font-semibold hidden md:flex items-center">
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
        <div className="text-lg font-semibold hidden md:flex items-center">
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
        <div className="text-lg font-semibold  md:flex items-center">
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
        <div className="text-lg font-semibold hidden md:flex items-center">
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
          // className={`w-3 ${profileDropDown ? "rotate-90" : ""}`}
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
            className={`flex justify-between items-center px-2 mx-2 mb-2 w-[70%] self-center ${
              activePath === "/edit-profile"
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
            className={`flex items-center px-2 mx-2 mb-2 w-[70%] self-center ${
              activePath === "/security"
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
