import React, { useEffect } from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectRole } from "../../Store/Role"; // Adjust the path according to your structure
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import ProtectedRoute from "./protectedRouting";
import Layout from "../../screens/Layout";
import Welcome from "../../screens/Welcome";
import Signin from "../../screens/Signin";
import Signup from "../../screens/Signup";
import CreateUserProfile from "../../screens/CreateUserProfile";
import PrivacyPolicy from "../../screens/PrivacyPolicy";
import About from "../../screens/About";
import CreateBarberProfile from "../../screens/CreateBarberProfile";
import Appointment from "../../screens/Appointment";
import Wallet from "../../screens/Wallet";
import EditProfile from "../../screens/EditProfile";
import Security from "../../screens/Security";
import BarberDashboard from "../../screens/BarberDashboard";
import AllBarbers from "../../screens/AllBarbers";
import BarberDetails from "../../screens/BarberDetails";
import Chat from "../../screens/Chat";
import { selectUser } from "../../Store/userDataSlice";
import { socketService } from "./Socket";


// Component to set up routing
const Routing = () => {
    const role = useSelector(selectRole);
    const authToken = useSelector(selectAuthToken)
    const userData = useSelector(selectUser)
    const dispatch = useDispatch()
    
    useEffect(() => {
        const cleanup = socketService(dispatch , authToken , userData)

        return () => {
            cleanup()
        }
    },[userData])

    if (role === undefined) {
        return <div>Loading...</div>;
    }

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
                { path: '/appointment', element: <ProtectedRoute Component={Appointment} /> },
                { path: '/wallet', element: <ProtectedRoute Component={Wallet} /> },
                { path: '/edit-profile', element: <ProtectedRoute Component={EditProfile} /> },
                { path: '/security', element: <ProtectedRoute Component={Security} /> },
                { path: '/barber-dashboard', element: <ProtectedRoute Component={BarberDashboard} /> },
                { path: '/barbers', element: <AllBarbers /> },
                { path: '/BarberDetails/:_id', element: <BarberDetails /> },
                { path: '/Chat', element: <ProtectedRoute Component={Chat} /> },
            ]
        }
    ]);

    return <RouterProvider router={router} />;
};

export default Routing;
