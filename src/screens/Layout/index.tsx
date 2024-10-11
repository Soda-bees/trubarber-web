import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "../../components/SideBar";
import { useSelector } from "react-redux";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import Footer from "../../components/Footer";
import useNavigate from "../../components/ScrollToTopNavigate";

type Props = {};

const Layout = (props: Props) => {
  
  const authToken = useSelector(selectAuthToken);
  const navigate = useNavigate()
  
  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showHamburger, setShowHamburger] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 768);

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
  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);



  // useEffect(() => {
  //   // Media Query for screen size
  //   const mediaQuery = window.matchMedia("(min-width: 768px)");

  //   const handleScreenResize = (event: MediaQueryListEvent) => {
  //     // Check screen size and auth/path condition for sidebar and hamburger
  //     if (mediaQuery.matches) {
  //       // For screens larger than 768px
  //       const shouldShowSidebar = 
  //       // !!authToken && 
  //       !noSidebarPaths.includes(location.pathname);
  //       setShowSidebar(shouldShowSidebar);
  //       setShowHamburger(false);  // No need for hamburger on larger screens
  //     } else {
  //       // For screens smaller than 768px
  //       const shouldShowHamburger = !!authToken && !noSidebarPaths.includes(location.pathname);
  //       setShowHamburger(shouldShowHamburger);
  //       setShowSidebar(false); // Hide sidebar on smaller screens by default
  //     }
  //   };

  //   // Initial check for sidebar and hamburger visibility
  //   if (mediaQuery.matches) {
  //     const shouldShowSidebar = 
  //     // !!authToken && 
  //     !noSidebarPaths.includes(location.pathname);
  //     setShowSidebar(shouldShowSidebar);
  //     setShowHamburger(false);
  //   } else {
  //     const shouldShowHamburger = !!authToken && !noSidebarPaths.includes(location.pathname);
  //     setShowHamburger(shouldShowHamburger);
  //     setShowSidebar(false);
  //   }

  //   // Add event listener to track changes in screen size
  //   mediaQuery.addEventListener("change", handleScreenResize);

  //   // Cleanup event listener on unmount
  //   return () => {
  //     mediaQuery.removeEventListener("change", handleScreenResize);
  //   };
  // }, [authToken, location.pathname]);


  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleScreenResize = (event: MediaQueryListEvent) => {
      setIsSmallScreen(!mediaQuery.matches);

      if (mediaQuery.matches) {
        const shouldShowSidebar =
          !!authToken &&
          !noSidebarPaths.includes(location.pathname);
        setShowSidebar(shouldShowSidebar);
        setShowHamburger(false);
      } else {
        const shouldShowHamburger =
          !!authToken &&
          !noSidebarPaths.includes(location.pathname);
        setShowHamburger(shouldShowHamburger);
        setShowSidebar(false);
      }
    };

    setIsSmallScreen(!mediaQuery.matches);
    const shouldShowSidebar =
      !!authToken &&
      !noSidebarPaths.includes(location.pathname) && mediaQuery.matches;
    setShowSidebar(shouldShowSidebar);
    setShowHamburger(!mediaQuery.matches &&
      !!authToken &&
      !noSidebarPaths.includes(location.pathname));

    mediaQuery.addEventListener("change", handleScreenResize);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenResize);
    };
  }, [authToken, location.pathname]);

  useEffect(() => {
    if (showSidebar && isSmallScreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSidebar, isSmallScreen]);

  useEffect(() => {
    if(authToken){
      if(activePath === '/signin' || activePath === '/signup'){
        navigate('/')
      }
    }
  } , [authToken , navigate])

  return (
    <div className="flex flex-row min-h-screen max-w-[2800px] mx-auto relative">

      {
        showSidebar &&
        <SideBar showSidebar={showSidebar} isSmallScreen={isSmallScreen} />
      }
      {
        isSmallScreen && showSidebar && <div className="fixed inset-0 bg-black bg-opacity-70 z-20 " onClick={() => setShowSidebar(false)} ></div>
      }
      <div className={
        activePath === '/' || activePath === '/signup' || activePath === '/signin' ? "w-full" : "w-full pt-20"
      }>
        {
          shouldShowHeader &&
          <Header showSidebar={showSidebar} showHamburger={showHamburger} setShowSidebar={setShowSidebar} isSmallScreen={isSmallScreen} />
        }
        <Outlet />
        <ToastContainer />
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
