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
import ScrollTopButton from "../../components/ScrollTopButton";

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
  const showWhiteHeaderPaths = ['/BarberDetails' , '/book-appointment']
  const shouldShowWhiteHeader = showWhiteHeaderPaths.some(
    (path) => location.pathname === path || location.pathname.startsWith(path)
  );

  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);

  const noMTPaths = ['/', '/barbers']
  const shouldNoMT = noMTPaths.includes(location.pathname)

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

    // useEffect(() => {
    //   if (authToken) {
    //     if (activePath === '/signin' || activePath === '/signup') {
    //       navigate('/')
    //     }
    //   }
    // }, [authToken, navigate])

    useEffect(() => {
      if (authToken) {
          // Check for a redirect path saved in sessionStorage
          const redirectPath = sessionStorage.getItem('redirectAfterLogin');
          if (redirectPath) {
              sessionStorage.removeItem('redirectAfterLogin'); // Clear the saved path
              navigate(redirectPath); // Navigate to the intended path
          } else if (activePath === '/signin' || activePath === '/signup') {
              navigate('/'); // Default behavior: Redirect to home
          }
      }
  }, [authToken, navigate, activePath]);

  return (
    <div className="flex flex-row min-h-screen max-w-[2800px] mx-auto relative">

      {
        showSidebar &&
        <SideBar showSidebar={showSidebar} isSmallScreen={isSmallScreen} />
      }
      {
        isSmallScreen && showSidebar && <div className="fixed inset-0 bg-black bg-opacity-70 z-20 " onClick={() => setShowSidebar(false)} ></div>
      }
      <div
        className={
          shouldNoMT ? "w-full flex flex-col justify-between" : isSmallScreen ? shouldShowHeader ? "w-full pt-36 flex flex-col justify-between"
            : "w-full flex flex-col justify-between" : shouldShowHeader ? "w-full pt-20 flex flex-col justify-between" : "w-full flex flex-col justify-between"}>
        {
          shouldShowHeader &&
          <Header showSidebar={showSidebar} showHamburger={showHamburger} setShowSidebar={setShowSidebar} isSmallScreen={isSmallScreen} shouldShowWhiteHeader={shouldShowWhiteHeader} />
        }
        <Outlet context={{ showSidebar }} />
        <ToastContainer />
        <Footer />
        <ScrollTopButton />
      </div>
    </div>
  );
};

export default Layout;
