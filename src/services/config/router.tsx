import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Welcome from "../../Screens/Welcome";
import Layout from "../../Screens/Layout";
import Signin from "../../Screens/Signin";
import Signup from "../../Screens/Signup";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Welcome /> },
            { path: '/signin', element: <Signin /> },
            { path: '/signup', element: <Signup /> },
            { path: '/createuserprofile', element: <Signup /> },
        ]
    }
])


type Props = {}

const Routing = (props: Props) => {
    return <RouterProvider router={router} />
}

export default Routing 