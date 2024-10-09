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
    !authToken && !noSidebarPaths.includes(location.pathname);
  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 640px)");

    // Function to handle screen resize and toggle sidebar
    const handleScreenResize = (event: MediaQueryListEvent) => {
      setShowSidebar(event.matches); // If matches, show sidebar
    };

    // Set initial state based on current screen size
    setShowSidebar(mediaQuery.matches);

    // Listen to changes in screen size
    mediaQuery.addEventListener("change", handleScreenResize);

    // Cleanup event listener on component unmount
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
      {/* <div className="flex flex-col sticky top-0 bg-black w-[15%] py-10 md:w-[37%] lg:w-[25%] xl:w-[20%] 2xl:w-[17%]">
        sidebar
      </div> */}
      <SideBar showSidebar={showSidebar} />
      <div className="w-full">
        {/* outlet */}
        <Header showSidebar={showSidebar}/>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
