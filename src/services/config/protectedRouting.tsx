import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';
import useNavigate from '../../components/ScrollToTopNavigate';
import { selectAuthToken } from '../../Store/AuthTokenSlice';

type ProtectedRouteProps = {
    Component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ Component }) => {
    const navigate = useNavigate();
    const authToken = useSelector(selectAuthToken)

    const haveUser = async () => {
        if (!authToken) {
            const currentPath = window.location.pathname;

            // Exclude redirect path saving for specific routes
            if (currentPath !== "/signin" && currentPath !== "/signup" && currentPath !== "/barber-dashboard") {
                console.log("path=====> protected router", currentPath);

                sessionStorage.setItem("redirectAfterLogin", currentPath);
            }

            // Redirect to signin for unauthorized access
            if (currentPath !== "/signin") {
                navigate("/signin");
            }
        } else {
            // If authenticated, allow access
            console.log("User is authenticated");
        }
    };

    useEffect(() => {
        haveUser();
    }, [authToken]);

    return (
        <Component />
    )
}

export default ProtectedRoute 