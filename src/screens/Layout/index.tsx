import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../../components/SideBar";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import Footer from "../../components/Footer";

type Props = {};

const Layout = (props: Props) => {
  const authToken = useSelector(selectAuthToken);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const location = useLocation();
  const activePath = location.pathname;

  const noHeaderPaths = [
    "/signin",
    "/signup",
    "/create-user-profile",
    "/create-barber-profile",
    "/about",
    "/privacy-policy",
  ];
  const noSidebarPaths = [
    "/signin",
    "/signup",
    "/create-user-profile",
    "/create-barber-profile",
  ];
  const shouldShowSidebar =
    authToken && !noSidebarPaths.includes(location.pathname);
  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleScreenResize = (event: MediaQueryListEvent) => {
      setShowSidebar(event.matches);
    };

    setShowSidebar(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleScreenResize);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenResize);
    };
  }, []);

  return (
    // <div>
    //   {
    //     shouldShowHeader &&
    //     <Header showSidebar={showSidebar}/>
    //   }
    //   <div className="flex flex-row ">
    //     {
    //       shouldShowSidebar &&
    //       <SideBar showSidebar={showSidebar} />
    //     }
    //     <Outlet />
    //   </div>
    //   <Footer />
    //   <ToastContainer />
    // </div>
    <div className="flex flex-row min-h-screen max-w-[2800px] mx-auto">

      {
        shouldShowSidebar &&
        <SideBar showSidebar={showSidebar} />
      }
      <div className={
        activePath === '/' || activePath === '/signup' || activePath === '/signin' ? "w-full" : "w-full pt-20"
      }>
        {/* outlet */}
        {/* <div 
        className= { activePath === '/appointment' || activePath === '/wallet' ||  activePath === "/edit-profile" || activePath === "/security"  ? "h-[100px] bg-red-500" : ''}
        > */}
        {
          shouldShowHeader &&
          <Header showSidebar={showSidebar} />
        }
        {/* </div> */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
