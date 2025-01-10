import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import { useDispatch, useSelector } from "react-redux";
import { selectUser, updateWalletRedux } from "../../Store/userDataSlice";
import { Toast } from "../../components/Toast";
import axios from "axios";
import { baseURL } from "../../services/config/axiosInstance";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import { handleIncreaseWallet } from "../../services/config/Api";
import {
  CardElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import SmallButton from "../../components/SmallButton";
import { loadStripe } from "@stripe/stripe-js";
import WalletButton from "../../components/WalletButton";

type Props = {};

const Wallet = (props: Props) => {
  const userData = useSelector(selectUser);
  const authToken = useSelector(selectAuthToken);
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();
  // console.log("userDataWallet", userData);
  const [loader, setLoader] = useState(false);
  const [btnLoader, setBtnLoader] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [enterPaymentAmount, setEnterPaymentAmount] = useState(false);
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<any>("");
  // const [stripe, setStripe] = useState<any>(null);
  // const [amount, setLocalAmount] = useState("");

  const togglePaymentAmount = () => {
    setEnterPaymentAmount(true);
  };

  const handlePayment = async () => {
    try {
      const numberValue = Number(amount);

      if (isNaN(numberValue) || numberValue <= 0) {
        Toast("error", "Please enter valid amount");
        setAmount("");
        return;
      }

      setBtnLoader(true);
      const response = await axios.post(
        `${baseURL}user/createPaymentIntent`,
        {
          amount: numberValue,
          _id: userData?._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const { clientSecret } = response.data;
      setClientSecret(clientSecret);

      if (!clientSecret) {
        setBtnLoader(false);
        setAmount("");
        return Toast("error", "Failed to initialize Payment");
      }

      if (!stripe || !Elements) {
        setBtnLoader(false);
        return Toast("error", "Stripe has not been initialized");
      }

      const cardElement = elements?.getElement(CardNumberElement);
      const { error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: userData?.name,
              email: userData?.email,
            },
          },
        }
      );

      if (confirmError) {
        setBtnLoader(false);
        setAmount("");
        return Toast(
          "error",
          confirmError.message || "Payment failed. Please try again."
        );
      }

      const responseSecond = (await handleIncreaseWallet(
        userData?._id,
        authToken,
        { amount: numberValue }
      )) as { data: any };
      if (responseSecond?.data?.success) {
        setAmount("");
        setWallet(responseSecond?.data?.balance);
        dispatch(updateWalletRedux(responseSecond?.data?.balance));
        setBtnLoader(false);
        Toast("success", "Payment successful!");
        setShowModal(false);
      } else {
        setBtnLoader(false);
        setAmount("");
        Toast("error", responseSecond?.data?.message || "Error occurred");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setBtnLoader(false);
      setAmount("");
      Toast("error", "Payment failed");
    }
  };

  const handleButtonPress = () => {
    if (enterPaymentAmount) {
      console.log("if");

      setEnterPaymentAmount(false);
      // handlePayment();
    } else {
      console.log("else");

      togglePaymentAmount();
    }
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        iconColor: "#666EE8",
        color: "#424770",
        fontWeight: "400",
        // fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: "15px",
        fontSmoothing: "antialiased",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        iconColor: "#FFC7EE",
        color: "#FFC7EE",
      },
    },
    hidePostalCode: true,

    showIcon: true, // Ensure this is included
  };

  // const CARD_ELEMENT_OPTIONS = {
  //   style: {
  //     base: {
  //       fontSize: "15px",
  //       color: "#424770",
  //       "::placeholder": {
  //         color: "#aab7c4",
  //       },
  //     },
  //     invalid: {
  //       color: "#9e2146",
  //     },
  //   },
  //   hidePostalCode: true,
  //   showIcon: true,
  // };

  return (
    <div className="px-4 md:px-10 mb-5">
      <div className="text-2xl font-bold border-b-2 pb-4">Wallet</div>
      <div className="flex flex-col md:flex-row justify-center items-center mt-20">
        <div className="flex flex-col items-center w-full md:w-[45%]">
          <div className="font-bold text-2xl">Available Balance</div>
          <div className="text-lg font-light text-center">
            This is your current balance available for payments
          </div>
          <div className="flex flex-row items-center justify-center border rounded-2xl w-full mt-5 p-4 h-[200px]">
            <img
              src={images.walletBlack}
              className="w-20 md:w-10 lg:w-20"
              alt="Wallet Icon"
            />
            <div className="ml-3">
              <div className="font-semibold text-lg lg:text-lg md:text-sm">
                Current Balance
              </div>
              <div className="font-bold text-4xl lg:text-4xl md:text-2xl truncate max-w-xs">{`$ ${
                wallet || userData?.wallet
              }.00`}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full md:w-[45%] mt-10 md:mt-0 md:ml-5">
          <div className="font-bold text-2xl">Add Funds</div>
          <div className="text-lg font-light text-center">
            Top up your wallet instantly to make seamless payments.
          </div>
          <div
            className="flex flex-row items-center justify-center border rounded-2xl w-full mt-5 p-4 h-[200px] cursor-pointer active:opacity-20 hover:bg-gray-100"
            onClick={() => setShowModal(true)}
          >
            <img
              src={images.cross}
              className="object-contain rotate-45 w-6 md:w-4 lg:w-6"
              alt="Add Money Icon"
            />
            <div className="ml-3">
              <div className="font-semibold text-2xl">Add Money</div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 z-50">
          <div className="bg-white w-full max-w-sm sm:max-w-md p-4 rounded-xl shadow-lg">
            <div className="flex justify-center font-semibold text-lg mb-4">
              Enter Amount and Card Details
            </div>
            <div>
              <form>
                <div className="mb-4">
                  <label className="font-semibold ml-2">Card Number</label>
                  <CardNumberElement
                    options={CARD_ELEMENT_OPTIONS}
                    className="border p-2 rounded-lg bg-inputGray mt-1 w-full"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="font-semibold ml-2">Expiry Date</label>
                    <CardExpiryElement
                      options={CARD_ELEMENT_OPTIONS}
                      className="border p-2 rounded-lg bg-inputGray mt-1 w-full"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="font-semibold ml-2">CVC</label>
                    <CardCvcElement
                      options={CARD_ELEMENT_OPTIONS}
                      className="border p-2 rounded-lg bg-inputGray mt-1 w-full"
                    />
                  </div>
                </div>
              </form>
              <div className="flex justify-center mt-5">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="p-2 border rounded-lg w-full max-w-xs"
                />
              </div>
            </div>
            <div className="modal-footer flex justify-center mt-6">
              <div className="w-28">
                <SmallButton
                  disable={btnLoader}
                  onClick={handlePayment}
                  dark={true}
                  loader={btnLoader}
                  title={"Pay Now"}
                />
              </div>
              <div className="ml-4 w-28">
                <SmallButton
                  dark
                  onClick={() => setShowModal(false)}
                  title={"Close"}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wallet;
