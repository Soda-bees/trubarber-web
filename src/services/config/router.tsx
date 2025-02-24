import React, { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectRole } from "../../Store/Role";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import ProtectedRoute from "./protectedRouting";
import { selectUser } from "../../Store/userDataSlice";
import { socketService } from "./Socket";
import Welcome from "../../Screens/Welcome";
import Layout from "../../Screens/Layout";
import Signin from "../../Screens/Signin";
import Signup from "../../Screens/Signup";
import CreateUserProfile from "../../Screens/CreateUserProfile";
import PrivacyPolicy from "../../Screens/PrivacyPolicy";
import About from "../../Screens/About";
import CreateBarberProfile from "../../Screens/CreateBarberProfile";
import Appointment from "../../Screens/Appointment";
import Wallet from "../../Screens/Wallet";
import EditProfile from "../../Screens/EditProfile";
import Security from "../../Screens/Security";
import BarberDashboard from "../../Screens/BarberDashboard";
import AllBarbers from "../../Screens/AllBarbers";
import BarberDetails from "../../Screens/BarberDetails";
import Chat from "../../Screens/Chat";
import BookAppointment from "../../Screens/BookAppointment";
import Favourite from "../../Screens/Favourite";
import Catalouge from "../../Screens/Catalouge";
import EditBusinessProfile from "../../Screens/EditBusinessProfile";


// Component to set up routing
const Routing = () => {
  const role = useSelector(selectRole);
  const authToken = useSelector(selectAuthToken);
  const userData = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const cleanup = socketService(dispatch, authToken, userData);

    return () => {
      cleanup();
    };
  }, [userData]);

  if (role === undefined) {
    return <div>Loading...</div>;
  }

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        // { index: true, element: role === 'barber' ? <Navigate to="/barber-dashboard" /> : <Welcome /> },
        {
          index: true,
          element: !authToken ? (
            <Welcome />
          ) : role === "barber" ? (
            <Navigate to="/barber-dashboard" />
          ) : (
            <Welcome />
          ),
        },
        { path: "/signin", element: <Signin /> },
        { path: "/signup", element: <Signup /> },
        { path: "/create-user-profile", element: <CreateUserProfile /> },
        { path: "/privacy-policy", element: <PrivacyPolicy /> },
        { path: "/about", element: <About /> },
        { path: "/create-barber-profile", element: <CreateBarberProfile /> },
        {
          path: "/appointment",
          element: <ProtectedRoute Component={Appointment} />,
        },
        { path: "/wallet", element: <ProtectedRoute Component={Wallet} /> },
        {
          path: "/edit-profile",
          element: <ProtectedRoute Component={EditProfile} />,
        },
        { path: "/security", element: <ProtectedRoute Component={Security} /> },
        {
          path: "/barber-dashboard",
          element: <ProtectedRoute Component={BarberDashboard} />,
        },
        { path: "/barbers", element: <AllBarbers /> },
        { path: "/BarberDetails/:_id", element: <BarberDetails /> },
        { path: "/chat", element: <ProtectedRoute Component={Chat} /> },
        { path: "/book-appointment", element: <BookAppointment /> },
        {
          path: "/favourite",
          element: <ProtectedRoute Component={Favourite} />,
        },
        {
          path: "/catalouge",
          element: <ProtectedRoute Component={Catalouge} />,
        },
        {
          path: "/edit-business-profile",
          element: <ProtectedRoute Component={EditBusinessProfile} />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default Routing;
