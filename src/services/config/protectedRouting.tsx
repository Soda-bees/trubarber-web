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
            navigate("/signin");
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