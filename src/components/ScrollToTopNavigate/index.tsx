import React from "react";
import { useNavigate as useReactRouterNavigate, NavigateOptions } from "react-router-dom";

const useNavigate = () => {
    const navigate = useReactRouterNavigate();

    const customNavigate = (to:  string | number, options?: NavigateOptions) => {
        window.scrollTo(0, 0); // Scroll to the top
        navigate(to as string, options);
    };

    return customNavigate;
};

export default useNavigate;