import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SideBar from "../../components/SideBar";

type Props = {};

const Layout = (props: Props) => {
  const location = useLocation();
  const noHeaderPaths = ['/signin', '/signup', '/create-user-profile', '/create-barber-profile'];
  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);
  return (
    <div>
      {/* <SideBar /> */}
      {/* {
        shouldShowHeader &&
        <Header />
      } */}
      <div className="flex flex-row ">
        <div className=" hidden sm:flex flex-col sticky top-0 max-h-screen relative bg-black w-[15%] py-10 md:w-[37%] lg:w-[25%] xl:w-[20%] 2xl:w-[17%]">sidebar</div>

        {/* <div className="w-full"> */}

          <Outlet />
        {/* </div> */}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Layout;
