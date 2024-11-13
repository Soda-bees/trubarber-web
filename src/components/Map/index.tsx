import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import React, { useEffect, useState } from "react";

const googleApiKey = process.env.GOOGLE_API_KEY as string;

const Map = () => {
  const containerStyle = {
    width: "100%",
    height: "100%",
  };

  const [currentPosition, setCurrentPosition] = useState({
    lat: 30.8157976264542,
    lng: 70.04061958392309,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleApiKey,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Current Position:", newPosition);
          setCurrentPosition(newPosition);
          map?.panTo(newPosition);
        },
        (error) => {
          console.error("Error fetching geolocation:", error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [map]);

  return (
    <div className="w-[100%] h-[100%]">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={currentPosition}
          zoom={20}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <Marker position={currentPosition} />
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Map;
