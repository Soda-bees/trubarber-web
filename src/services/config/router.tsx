// import React from "react";
// import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import Layout from "../../screens/Layout";
// import Signin from "../../screens/Signin";
// import Signup from "../../screens/Signup";
// import Welcome from "../../screens/Welcome";
// import CreateUserProfile from "../../screens/CreateUserProfile";


// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <Layout />,
//         children: [
//             { index: true, element: <Welcome /> },
//             { path: '/signin', element: <Signin /> },
//             { path: '/signup', element: <Signup /> },
//             { path: '/createuserprofile', element: <CreateUserProfile /> },
//         ]
//     }
// ])


// type Props = {}

// const Routing = (props: Props) => {
//     return <RouterProvider router={router} />
// }

// export default Routing 

import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectRole } from "../../Store/Role"; // Adjust the path according to your structure
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import ProtectedRoute from "./protectedRouting";
import Layout from "../../screens/Layout";
import Welcome from "../../screens/Welcome";
import Signin from "../../screens/Signin";
import Signup from "../../screens/Signup";
import CreateUserProfile from "../../screens/CreateUserProfile";
import CreateBarberProfile from "../../screens/CreateBarberProfile";
import BarberDashboard from "../../screens/BarberDashboard";

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
                { path: '/create-barber-profile', element: <CreateBarberProfile /> },
                { path: '/barber-dashboard', element: <ProtectedRoute Component={BarberDashboard} /> },
            ]
        }
    ]);

    return <RouterProvider router={router} />;
};

export default Routing;
