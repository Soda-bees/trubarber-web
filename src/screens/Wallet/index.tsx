import React from "react";
import images from "../../services/config/images";
import { useSelector } from "react-redux";
import { selectUser } from "../../Store/userDataSlice";

type Props = {};

const Wallet = (props: Props) => {
  const userData = useSelector(selectUser);
  console.log("userDataWallet", userData);
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
              <div className="font-bold text-4xl lg:text-4xl md:text-2xl truncate max-w-xs">{`$ ${userData?.wallet}.00`}</div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center w-full md:w-[45%] mt-10 md:mt-0 md:ml-5">
          <div className="font-bold text-2xl">Add Funds</div>
          <div className="text-lg font-light text-center">
            Top up your wallet instantly to make seamless payments.
          </div>
          <div className="flex flex-row items-center justify-center border rounded-2xl w-full mt-5 p-4 h-[200px] cursor-pointer active:opacity-20 hover:bg-gray-100">
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
    </div>
  );
};

export default Wallet;
