import React, { useState } from "react";
import images from "../../services/config/images";
import { GoogleMap, useJsApiLoader, LoadScript } from "@react-google-maps/api";
import Map from "../../components/Map";
import { updatePassword } from "../../services/config/Api";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import { Toast } from "../../components/Toast";
import SmallButton from "../../components/SmallButton";

type Props = {};

const Security = (props: Props) => {
  const [showCurrentPass, setShowCurrentPass] = useState<any>('');
  const [showNewPass, setShowNewPass] = useState<any>('');
  const [showConfirmPass, setShowConfirmPass] = useState<any>('');
  const authToken = useSelector(selectAuthToken);
  const [loader, setLoader] = useState(false);

  const handleUpdatePassword = async () => {
    try {
      if (showNewPass !== showConfirmPass) {
        setLoader(false);
        return Toast('error', 'Password not match');
      }
      setLoader(true);
      const body = {
        password: showCurrentPass,
        newPassword: showNewPass,
      };
      const response = (await updatePassword(body, authToken)) as {
        response: any;
        status: any;
        data: any;
      };
      console.log('aaaaaaaaaaaaaaaaaa',response);
      if (response.status == 200) {
        setShowCurrentPass("");
        setShowNewPass("");
        setShowConfirmPass("");
        setLoader(false);
        Toast("success", response?.data?.message);
      } else {
        setLoader(false);
        Toast("error", response?.data?.message);
      }
    } catch (error: any) {
      console.log('bbbbbbbbbbbbbb',error);
      setLoader(false);
      Toast("error", error?.message);
    }
  };

  return (
    <div className="px-4 md:px-10 mb-5">
      <div className="text-2xl font-bold border-b-2 pb-4">Security</div>
      <div className="text-xl mt-10 text-center md:text-start">
        Ensure your new password is strong and unique.
      </div>
      <div className="mt-4 lg:mt-8 flex flex-col items-center md:items-start">
        <div className="bg-inputGray flex flex-row items-center justify-start px-4 rounded-xl mt-2 w-full max-w-[600px]">
          <input
            placeholder="Current Password"
            // type={showCurrentPass ? "text" : "password"}
            className="w-full bg-transparent h-12 focus:outline-none pl-2"
            value={showCurrentPass}
            onChange={(e) => setShowCurrentPass(e.target.value)}
          />
          <img
            src={!showCurrentPass ? images.eyeOff : images.eye}
            className="w-5 cursor-pointer"
            onClick={() => setShowCurrentPass(!showCurrentPass)}
          />
        </div>
        <div className="bg-inputGray flex flex-row items-center justify-start px-4 rounded-xl mt-2 w-full max-w-[600px]">
          <input
            placeholder="New Password"
            // type={showNewPass ? "text" : "password"}
            className="w-full bg-transparent h-12 focus:outline-none pl-2"
            value={showNewPass}
            onChange={(e) => setShowNewPass(e.target.value)}

          />
          <img
            src={!showNewPass ? images.eyeOff : images.eye}
            className="w-5 cursor-pointer"
            onClick={() => setShowNewPass(!showNewPass)}
          />
        </div>
        <div className="bg-inputGray flex flex-row items-center justify-start px-4 rounded-xl mt-2 w-full max-w-[600px]">
          <input
            placeholder="Confirm Password"
            // type={showConfirmPass ? "text" : "password"}
            className="w-full bg-transparent h-12 focus:outline-none pl-2"
            value={showConfirmPass}
            onChange={(e) => setShowConfirmPass(e.target.value)}
          />
          <img
            src={!showConfirmPass ? images.eyeOff : images.eye}
            className="w-5 cursor-pointer"
            onClick={() => setShowConfirmPass(!showConfirmPass)}
          />
        </div>
      </div>
      <div className="bg-black w-full max-w-[160px] flex justify-center items-center rounded-lg h-10 mt-10 mx-auto md:mx-0 cursor-pointer active:opacity-10" onClick={handleUpdatePassword}>
        {/* <div className="text-white text-lg">Save</div> */}
      <SmallButton dark title="Save" loader={loader}/>
      </div>
    </div>
  );
};

export default Security;
