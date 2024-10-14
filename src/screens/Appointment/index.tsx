import React, { useState } from "react";
import images from "../../services/config/images";

const Appointment = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>()
  const [appointmentStatus, setAppointmentStatus] =
    useState<string>("upcoming");

  type upcoming = {
    name: string;
    date: string;
    service: string;
    status: string;
    serviceCategory: string;
    price: number;
  };

  const [upComingAppointment, setUpComingAppointment] = useState<any>([
    {
      name: "Mike Trim",
      date: "02 Feb/02:00AM",
      service: "Beard",
      serviceCategory: "(Beard)",
      status: "Completed",
      price: 20,
    },
    {
      name: "Redbox  Barber",
      date: "02 Feb/02:00AM",
      service: "Haircut",
      serviceCategory: "(Buzcut)",
      status: "Completed",
      price: 20,
    },
    {
      name: "Mike Trim",
      date: "02 Feb/02:00AM",
      service: "Beard",
      serviceCategory: "(Beard)",
      status: "Pending",
      price: 20,
    },
    {
      name: "Redbox  Barber",
      date: "02 Feb/02:00AM",
      service: "Haircut",
      serviceCategory: "(Buzcut)",
      status: "Completed",
      price: 20,
    },
    {
      name: "Mike Trim",
      date: "02 Feb/02:00AM",
      service: "Beard",
      serviceCategory: "(Beard)",
      status: "Pending",
      price: 20,
    },
    {
      name: "Redbox  Barber",
      date: "02 Feb/02:00AM",
      service: "Haircut",
      serviceCategory: "(Buzcut)",
      status: "Completed",
      price: 20,
    },
  ]);

  const handleClick = (item: any) => {
    console.log(item);
    
    setSelectedAppointment(item);
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className="px-4 md:px-10 mb-5">
    <div className="flex flex-col md:flex-row justify-between border-b-2 pb-4">
      <div className="text-2xl flex justify-center font-bold mb-2">Appointments</div>
      <div className="flex flex-row justify-between md:w-[220px] mb-2">
        <div
          className={`text-lg font-light border px-4 md:px-6 rounded-xl cursor-pointer ${
            appointmentStatus === "upcoming" ? "bg-black text-white" : ""
          }`}
          title="Upcoming"
          onClick={() => setAppointmentStatus("upcoming")}
        >
          Upcoming
        </div>
        <div
          className={`text-lg font-light border px-4 md:px-6 rounded-xl cursor-pointer ${
            appointmentStatus === "past" ? "bg-black text-white" : ""
          }`}
          title="Past"
          onClick={() => setAppointmentStatus("past")}
        >
          Past
        </div>
      </div>
    </div>
    <div className="mt-6">
      {appointmentStatus === "upcoming" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {upComingAppointment.map((item: any, index: number) => (
            <div className="border rounded-xl p-4" key={index}>
              <div className="flex flex-row justify-between border-b border-black pb-4">
                <div className="flex flex-row">
                  <img src={images.barberAppointmentImg} className="w-16 md:w-20" />
                  <div className="flex flex-col self-center ml-3">
                    <div className="text-xl md:text-2xl text-black font-bold">
                      {item.name}
                    </div>
                    <div className="text-black font-light">{item.date}</div>
                  </div>
                </div>
                <div className="border rounded-xl text-white bg-black px-3 py-1 flex self-start">
                  {item.status}
                </div>
              </div>
              <div className="flex justify-between mt-3">
                <div className="flex">
                  <div className="text-black font-bold">{item.service}</div>
                  <div className="text-black font-light ml-1">
                    {item.serviceCategory}
                  </div>
                </div>
                <div className="border border-black text-black px-3 rounded-lg">
                  ${item.price}
                </div>
              </div>
              <div
                className="flex items-center justify-between border bg-black rounded-xl py-3 px-4 cursor-pointer mt-4 text-white"
                onClick={() => handleClick(item)}
              >
                See Details
                <img src={images.arrowBtn} className="w-2" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>Past Appointments</div>
      )}
    </div>
    {isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6 z-50  max-w-[2800px] mx-auto">
        <div className="bg-white w-full sm:w-4/5 md:w-2/3 lg:w-1/3 flex flex-col p-2 xs:p-6 rounded-xl shadow-lg">
          <div className="flex justify-between items-center border-b-2 pb-3">
            <div className="text-xl font-bold">Appointment Details</div>
            <div
              className="bg-black p-3 rounded-xl cursor-pointer"
              onClick={() => setIsModalOpen(false)}
            >
              <img
                src={images.cross}
                className="w-4 filter invert brightness-0"
              />
            </div>
          </div>
          <div className="flex justify-between mt-3">
            <div className="text-lg text-black font-bold">Selected Date</div>
            <div className="text-base text-black ">02/Feb/2024</div>
          </div>
          <div className="flex justify-between mt-3 border-b-2 pb-3">
            <div className="text-lg text-black font-bold">Selected Time</div>
            <div className="text-base text-black ">02:00 PM</div>
          </div>
          <div className="flex flex-row my-5">
            <img src={images.barberAppointmentImg} className="w-16 md:w-20" />
            <div className="flex flex-col ml-3">
              <div className="text-xl md:text-2xl text-black font-bold">
                {selectedAppointment?.name}
              </div>
              <div className="text-black font-light">02:00-02:45</div>
            </div>
          </div>
          <div>{selectedAppointment?.service}</div>
          <div className="flex justify-between mt-3">
            <div className="font-light">{selectedAppointment?.serviceCategory}</div>
            <div className="rounded-lg">${selectedAppointment?.price}.00</div>
          </div>
          <div className="flex justify-end mt-10 font-bold">
            Total: ${selectedAppointment?.price}.00
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default Appointment;
