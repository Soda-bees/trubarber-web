import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "../../screens/Layout";
import Signin from "../../screens/Signin";
import Signup from "../../screens/Signup";
import Welcome from "../../screens/Welcome";
import CreateUserProfile from "../../screens/CreateUserProfile";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Layout />,
        children: [
            { index: true, element: <Welcome /> },
            { path: '/signin', element: <Signin /> },
            { path: '/signup', element: <Signup /> },
            { path: '/createuserprofile', element: <CreateUserProfile /> },
        ]
    }
])


type Props = {}

const Routing = (props: Props) => {
    return <RouterProvider router={router} />
}

export default Routing 