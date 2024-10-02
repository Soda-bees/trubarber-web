import React from "react";
import images from "../../services/config/images";

type Props = {};

const BarberSection = (props: Props) => {
  return (
    <div>
      <div>
        <div className="flex flex-row items-center border rounded-[12px] w-[4%] justify-between py-1 px-2 ml-[10%] mt-5 fixed bg-white/30 backdrop-blur-lg text-white">
          5.0
          <img src={images.star} className="w-[30%]" />
        </div>
        <div className="border bg-white/30 backdrop-blur-lg w-[14%] rounded-[12px] fixed mt-[17%] ml-2">
          <div className="font-bold text-2xl">Jake Clipper</div>
          <div className="flex flex-row items-center">
            <img src={images.Location} className="w-[3%]"/>
            <div className="font-light">location</div>
          </div>
        </div>
        <img
          src={images.barberImg}
          alt="barber"
          className="w-[15%] absolute -z-10 flex"
        />
      </div>
    </div>
  );
};

export default BarberSection;
