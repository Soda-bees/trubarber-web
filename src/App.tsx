import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Header from "./components/Header";
import Slider from "./components/Slider";
import { Provider } from "react-redux";
import { persistor, store } from "./Store";
import { PersistGate } from "redux-persist/integration/react";
import Routing from "./services/config/router";
import SideBar from "./components/SideBar";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useElements, useStripe } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  // "pk_live_51GQwmHKQE6LZkVRAWEQurGafjjOkpMRCWly7m3O4cNDMZXsgtrzywCw0sk00LFfdeSmL86j1uqpQijtKDhlP77gT00t92A6i4B"
  "pk_test_51Q0i3SFWqbkEzf6rhMiTwrzirJFjPqfNVrorak6wVpD9GazCAsvC2GHrE2KSpTIdN06l3428lIyS1KmGxzcMvhvu00by6KVvm9"
);

function App() {
  const stripe = useStripe();
  const elements = useElements();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* <Elements stripe={stripePromise}> */}
        <Routing />
        {/* <SideBar /> */}
        {/* </Elements> */}
      </PersistGate>
    </Provider>
  );
}

export default App;
