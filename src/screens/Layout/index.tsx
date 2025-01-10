import React, { useEffect, useRef, useState } from "react";
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
import { selectRole } from "../../Store/Role";

type Props = {};

const Layout = (props: Props) => {

  const authToken = useSelector(selectAuthToken);
  const navigate = useNavigate()
  const headerRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);

  const [showSidebar, setShowSidebar] = useState<boolean>(false);
  const [showHamburger, setShowHamburger] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 768);
  const [showNotification, setShowNotification] = useState<boolean>(false)
  const [search, setSearch] = useState<string>('')
  const [headerHeight, setHeaderHeight] = useState<number>(0)
  const [footerHeight, setfooterHeight] = useState<number>(0)
  const [headerFooterHeight, setheaderFooterHeight] = useState<number>(0)
  const [showLogoutModal , setShowLogoutModal] = useState<boolean>(false)

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
  const showWhiteHeaderPaths = ['/BarberDetails', '/book-appointment', '/wallet', '/appointment', '/chat' , '/edit-profile' , '/security' , '/barber-dashboard' , '/catalouge']
  const shouldShowWhiteHeader = showWhiteHeaderPaths.some(
    (path) => location.pathname === path || location.pathname.startsWith(path)
  );

  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);

  const noMTPaths = ['/', '/barbers', '/favourite']
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
    if ((showSidebar && isSmallScreen) || showNotification || showLogoutModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [showSidebar, isSmallScreen, showNotification , showLogoutModal]);


  useEffect(() => {
    if (authToken) {
      const redirectPath = sessionStorage.getItem('redirectAfterLogin');
      if (redirectPath) {
        sessionStorage.removeItem('redirectAfterLogin');
        navigate(redirectPath);
      } else if (activePath === '/signin' || activePath === '/signup') {
        console.log("lay out use effect-==--==-=-=-");

        navigate('/');
      }
    }
  }, [authToken, navigate, activePath]);


  useEffect(() => {
    const updateHeight = () => {
      const headerHeight = headerRef.current?.offsetHeight || 0;
      const footerHeight = footerRef.current?.offsetHeight || 0;

      const headerHeightInVH = (headerHeight / window.innerHeight) * 100;
      const footerHeightInVH = (footerHeight / window.innerHeight) * 100;

      const availableHeight = window.innerHeight - headerHeight - footerHeight;
      const totalHeightInVH = headerHeightInVH + footerHeightInVH;

      setHeaderHeight(headerHeightInVH)
      setfooterHeight(footerHeightInVH)
      setheaderFooterHeight(totalHeightInVH)
    };

    // Initial calculation
    updateHeight();

    // Recalculate on window resize
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div
      className="flex flex-row min-h-screen max-w-[2800px] mx-auto relative "
    >
      {
        showSidebar &&
        <SideBar showSidebar={showSidebar} isSmallScreen={isSmallScreen} setShowSidebar={setShowSidebar} showLogoutModal={showLogoutModal}  setShowLogoutModal={setShowLogoutModal} />
      }

      {
        isSmallScreen && showSidebar && <div className="fixed inset-0 bg-black bg-opacity-70 z-20 " onClick={() => setShowSidebar(false)} ></div>
      }

      <div
        style={shouldNoMT ? {} : isSmallScreen && shouldShowHeader ? { paddingTop: `${headerHeight}vh` } : {}}
        className={
          shouldNoMT ? "w-full flex flex-col justify-between overflow-x-hidden" : isSmallScreen ? shouldShowHeader ? `w-full flex flex-col justify-between overflow-x-hidden`
            : "w-full flex flex-col justify-between overflow-x-hidden" : shouldShowHeader ? "w-full pt-20 flex flex-col justify-between overflow-x-hidden" : "w-full flex flex-col justify-between overflow-x-hidden"}>
        {
          shouldShowHeader &&
          <Header ref={headerRef} showSidebar={showSidebar} showHamburger={showHamburger}
            setShowSidebar={setShowSidebar} isSmallScreen={isSmallScreen}
            shouldShowWhiteHeader={shouldShowWhiteHeader}
            showNotification={showNotification}
            setShowNotification={setShowNotification}
            setSearch={setSearch}
          />
        }
        <Outlet context={{ showSidebar, isSmallScreen, search, headerFooterHeight, headerHeight , setShowLogoutModal}} />
        <ToastContainer />
        <Footer ref={footerRef} />
        <ScrollTopButton />
      </div>
    </div>
  );
};

export default Layout;
