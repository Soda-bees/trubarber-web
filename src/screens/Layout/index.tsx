import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type Props = {};

const Layout = (props: Props) => {
  const location = useLocation();
  const noHeaderPaths = ['/signin', '/signup', '/create-user-profile' , '/create-barber-profile'];
  const shouldShowHeader = !noHeaderPaths.includes(location.pathname);
  return (
    <div>
      {
        shouldShowHeader &&
        <Header />
      }
      <Outlet />
      <ToastContainer />
    </div>
  );
};

export default Layout;
