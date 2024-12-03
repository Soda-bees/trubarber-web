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
        // if (!authToken) {
        //     console.log("work");
            
        //     console.log("path=====>" ,  window.location.pathname);
            
        //     sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
        //     navigate("/signin");
        // }
        if (!authToken) {
            const currentPath = window.location.pathname;

            // Prevent re-saving the redirect path for /signin
            if (currentPath !== "/signin") {
                console.log("work");
                console.log("path=====>", currentPath);

                sessionStorage.setItem('redirectAfterLogin', currentPath);
                navigate("/signin");
            }
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