import React, { useEffect, useState } from "react";
import Slider from "../../components/Slider";
import Header from "../../components/Header";
import LandingDiscover from "../../components/LandingDiscover";
import LogoLine from "../../components/LogoLine";
import BarberSection from "../../components/BarberSection";
import BarberServiceDisplay from "../../components/BarberServiceDisplay";
import CustomerReview from "../../components/CustomerReview";
import { useDispatch, useSelector } from "react-redux";
import { selectBarbers } from "../../Store/BarbersSlice";
import { useLocation, useOutletContext } from "react-router-dom";
import { selectUser } from "../../Store/userDataSlice";
import { setLocation } from "../../Store/LocationSlice";
import { selectRole } from "../../Store/Role";

type Props = {};

const Welcome = (props: Props) => {
  const { showSidebar } = useOutletContext<{ showSidebar: boolean }>();
  const dispatch = useDispatch();
  const barbers = useSelector(selectBarbers);
  const role = useSelector(selectRole);

  const location = useSelector<any>((state) => state.location);
  console.log("Location from Redux:", location);

  const [currentPosition, setCurrentPosition] = useState({
    lat: 30.8157976264542,
    lng: 70.04061958392309,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          console.log("Current Position:", newPosition);
          dispatch(setLocation(newPosition));
          const mapPosition = {
            lat: newPosition.latitude,
            lng: newPosition.longitude,
          };
          setCurrentPosition(mapPosition);
        },
        (error) => {
          console.error("Error fetching geolocation:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [dispatch]);

  return (
    <div>
      <Slider />
      <LandingDiscover />
      <LogoLine />
      <BarberSection showDes showBtn />
      <BarberServiceDisplay />
      <LogoLine />
      <CustomerReview />
    </div>
  );
};

export default Welcome;
