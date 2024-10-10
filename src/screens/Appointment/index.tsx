import React from "react";

type Props = {};

const Appointment = (props: Props) => {
  return (
    <div className="px-10">
      <div className="flex flex-row justify-between">
        <div className="text-2xl font-bold">Appointments</div>
        <div className="flex flex-row justify-between bg-red-500 w-60">
          <div >Upcoming</div>
          <div>Past</div>
        </div>
      </div>
    </div>
  );
};

export default Appointment;
