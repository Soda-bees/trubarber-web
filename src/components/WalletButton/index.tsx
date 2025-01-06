import React from "react";
import images from "../../services/config/images";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
  CheckoutProvider,
} from "@stripe/react-stripe-js";

type Props = {};

const WalletButton = (props: Props) => {
  const stripe = useStripe();
  const elements = useElements();
  return (
    <div className="">
      <form id="payment-form">
        <PaymentElement />
      </form>
    </div>
  );
};
export default WalletButton;
