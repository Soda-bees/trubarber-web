import React from "react";
import { Link as ReactRouterLink, LinkProps } from "react-router-dom";

interface ScrollToTopLinkProps extends LinkProps {
  to: string; // Assuming 'to' is always a string
  children: React.ReactNode; // Define children type
}

const ScrollToTopLink: React.FC<ScrollToTopLinkProps> = ({ to, children, ...rest }) => {
  const handleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <ReactRouterLink to={to} onClick={handleClick} {...rest}>
      {children}
    </ReactRouterLink>
  );
};

export default ScrollToTopLink;