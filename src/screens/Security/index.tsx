import React, { useState } from "react";
import images from "../../services/config/images";
import { GoogleMap, useJsApiLoader, LoadScript } from "@react-google-maps/api";
import Map from "../../components/Map";

type Props = {};

const Security = (props: Props) => {
  const [showCurrentPass, setShowCurrentPass] = useState<boolean>(false);
  const [showNewPass, setShowNewPass] = useState<boolean>(false);
  const [showConfirmPass, setShowConfirmPass] = useState<boolean>(false);

 
  return (
   <Map />

    // <div className="px-4 md:px-10 mb-5">
    //   <div className="text-2xl font-bold border-b-2 pb-4">Security</div>
    //   <div className="text-xl mt-10 text-center md:text-start">
    //     Ensure your new password is strong and unique.
    //   </div>
    //   <div className="mt-4 lg:mt-8 flex flex-col items-center md:items-start">
    //     <div className="bg-inputGray flex flex-row items-center justify-start px-4 rounded-xl mt-2 w-full max-w-[600px]">
    //       <input
    //         placeholder="Current Password"
    //         type={showCurrentPass ? "text" : "password"}
    //         className="w-full bg-transparent h-12 focus:outline-none pl-2"
    //       />
    //       <img
    //         src={!showCurrentPass ? images.eyeOff : images.eye}
    //         className="w-5 cursor-pointer"
    //         onClick={() => setShowCurrentPass(!showCurrentPass)}
    //       />
    //     </div>
    //     <div className="bg-inputGray flex flex-row items-center justify-start px-4 rounded-xl mt-2 w-full max-w-[600px]">
    //       <input
    //         placeholder="New Password"
    //         type={showNewPass ? "text" : "password"}
    //         className="w-full bg-transparent h-12 focus:outline-none pl-2"
    //       />
    //       <img
    //         src={!showNewPass ? images.eyeOff : images.eye}
    //         className="w-5 cursor-pointer"
    //         onClick={() => setShowNewPass(!showNewPass)}
    //       />
    //     </div>
    //     <div className="bg-inputGray flex flex-row items-center justify-start px-4 rounded-xl mt-2 w-full max-w-[600px]">
    //       <input
    //         placeholder="Confirm Password"
    //         type={showConfirmPass ? "text" : "password"}
    //         className="w-full bg-transparent h-12 focus:outline-none pl-2"
    //       />
    //       <img
    //         src={!showConfirmPass ? images.eyeOff : images.eye}
    //         className="w-5 cursor-pointer"
    //         onClick={() => setShowConfirmPass(!showConfirmPass)}
    //       />
    //     </div>
    //   </div>
    //   <div className="bg-black w-full max-w-[160px] flex justify-center items-center rounded-lg h-10 mt-10 mx-auto md:mx-0 cursor-pointer active:opacity-10">
    //     <div className="text-white text-lg">Save</div>
    //   </div>
    // </div>
  );
};

export default Security;
