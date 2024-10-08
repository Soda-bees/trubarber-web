import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SideBar from "../../components/SideBar";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import Footer from "../../components/Footer";

type Props = {};

const Layout = (props: Props) => {

  const authToken = useSelector(selectAuthToken)

  const location = useLocation();
  const noHeaderPaths = ['/signin', '/signup', '/create-user-profile', '/create-barber-profile'];
  const noSidebarPaths = ['/signin', '/signup', '/create-user-profile', '/create-barber-profile']
  const shouldShowSidebar = authToken && !noSidebarPaths.includes(location.pathname);
  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);
  return (
    <div>
      {
        shouldShowHeader &&
        <Header />
      }
      <div className="flex flex-row ">
        {
          shouldShowSidebar &&
          <SideBar />
          // <div className=" hidden sm:flex flex-col sticky top-0 max-h-screen relative bg-black w-[15%] py-10 md:w-[37%] lg:w-[25%] xl:w-[20%] 2xl:w-[17%]">sidebar</div>
        }
        <Outlet />
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;
