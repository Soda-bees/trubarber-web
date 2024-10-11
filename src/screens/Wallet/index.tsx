import React from "react";
import images from "../../services/config/images";

type Props = {};

const Wallet = (props: Props) => {
  return (
    <div className="px-4 md:px-10">
      <div className="text-2xl font-bold border-b-2 pb-4">Wallet</div>
      <div className="flex flex-row">
        <div className="flex flex-col items-center">
          <div>Available Balance</div>
          <div>This is your current balance available for payments</div>
          <div className="flex flex-row items-center border">
            <img src={images.walletBlack} className="w-[35%]"/>
            <div>
              <div>Current Balance</div>
              <div>$123456</div>
            </div>
          </div>
        </div>
        <div ></div>
      </div>
    </div>
  );
};

export default Wallet;
