import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "../../Store/Role"; // Adjust the path according to your structure
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import ProtectedRoute from "./protectedRouting";
import Layout from "../../Screens/Layout";
import Welcome from "../../Screens/Welcome";
import Signin from "../../Screens/Signin";
import Signup from "../../Screens/Signup";
import CreateUserProfile from "../../Screens/CreateUserProfile";
import PrivacyPolicy from "../../Screens/PrivacyPolicy";
import About from "../../Screens/About";
import CreateBarberProfile from "../../Screens/CreateBarberProfile";
import BarberDashboard from "../../Screens/BarberDashboard";
import Appointment from "../../Screens/Appointment";
import Wallet from "../../Screens/Wallet";
import EditProfile from "../../Screens/EditProfile";
import Security from "../../Screens/Security";


// Component to set up routing
const Routing = () => {
    const role = useSelector(selectRole);
    const authToken = useSelector(selectAuthToken)

    if (role === undefined) {
        return <div>Loading...</div>;
    }

    // Set up the router
    const router = createBrowserRouter([
        {
            path: '/',
            element: <Layout />,
            children: [
                // { index: true, element: role === 'barber' ? <Navigate to="/barber-dashboard" /> : <Welcome /> },
                {
                    index: true,
                    element: !authToken ? <Welcome /> : role === 'barber' ? <Navigate to="/barber-dashboard" /> : <Welcome />
                },
                { path: '/signin', element: <Signin /> },
                { path: '/signup', element: <Signup /> },
                { path: '/create-user-profile', element: <CreateUserProfile /> },
                { path: '/privacy-policy', element: <PrivacyPolicy /> },
                { path: '/about', element: <About /> },
                { path: '/create-barber-profile', element: <CreateBarberProfile /> },
                { path: '/appointment', element: <Appointment /> },
                { path: '/wallet', element: <Wallet /> },
                { path: '/edit-profile', element: <EditProfile /> },
                { path: '/security', element: <Security /> },
                { path: '/barber-dashboard', element: <ProtectedRoute Component={BarberDashboard} /> },
            ]
        }
    ]);

    return <RouterProvider router={router} />;
};

export default Routing;
