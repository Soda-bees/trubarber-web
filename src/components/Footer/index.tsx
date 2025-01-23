import React, { forwardRef } from "react";
import images from "../../services/config/images";
import ScrollToTopLink from "../ScrollToTopLink";
import useNavigate from "../ScrollToTopNavigate";
import { useSelector } from "react-redux";
import { selectRole } from "../../Store/Role";

type Props = {
  ref: any;
};

// const Footer = (props: Props) => {
const Footer = forwardRef<HTMLDivElement, Props>(({}, ref) => {
  const navigate = useNavigate();
  const role = useSelector(selectRole);
  return (
    <div ref={ref} className="bg-black py-10 px-5 ">
      <div className="flex flex-row xs:flex-row justify-between w-full items-center xs:items-start gap-2  ">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-3 xl:flex flex-row sm:gap-4  text-white text-lg font-light ">
          {role === "user" && (
            <div className="cursor-pointer  hover:underline" onClick={() => navigate("/barbers")}>
              Book Appointment
            </div>
          )}
          {role === "user" && (
            <div className="cursor-pointer hover:underline" onClick={() => navigate("/barbers")}>Services</div>
          )}
          {/* {role === "user" && (
            <div className="cursor-pointer hover:underline">
              Customer Reviews
            </div>
          )} */}
          <ScrollToTopLink
            to={"/privacy-policy"}
            className="cursor-pointer hover:underline"
          >
            Terms & Policy
          </ScrollToTopLink>
          <div className="cursor-pointer hover:underline">Career</div>
          <ScrollToTopLink
            to={"/about"}
            className="cursor-pointer hover:underline"
          >
            About-Us
          </ScrollToTopLink>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 gap-2 items-center md:justify-center ">
          <div className="border flex items-center p-2 rounded-md md:w-auto cursor-pointer">
            <img src={images.google} className="w-6" alt="Google Play" />
            <div className="ml-2">
              <div className="text-white text-xs">GET IT ON</div>
              <div className="text-white font-semibold text-sm">
                Google Play
              </div>
            </div>
          </div>
          <a
            href="https://apps.apple.com/pk/app/trubarber/id6736399198"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="border flex items-center p-2 rounded-md md:w-auto cursor-pointer">
              <img src={images.apple} className="w-6" alt="App Store" />
              <div className="ml-2">
                <div className="text-white text-xs">Download from</div>
                <div className="text-white font-semibold text-sm">
                  App Store
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>

      <div className="w-full bg-white h-0.5 my-8" />

      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
          <img
            src={images.truLogo}
            onClick={() => navigate("/")}
            className="w-20 md:w-24 cursor-pointer"
            alt="TruBarber Logo"
          />
          <div className="text-white text-lg md:text-2xl font-light md:ml-4 md:text-center md:text-left">
            TruBarber. All Rights Reserved 2024. Licensing
          </div>
        </div>

        <div className="flex flex-row space-x-4">
          <div className="border rounded-full p-2  cursor-pointer">
            <img src={images.facebook} className="w-5 md:w-6" alt="Facebook" />
          </div>
          <div className="border rounded-full p-2  cursor-pointer">
            <img src={images.twitter} className="w-5 md:w-6" alt="Twitter" />
          </div>
          <div className="border rounded-full p-2  cursor-pointer">
            <img src={images.insta} className="w-5 md:w-6" alt="Instagram" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default Footer;
