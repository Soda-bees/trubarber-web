import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import { useSelector } from "react-redux";
import { selectUser } from "../../Store/userDataSlice";
import { useNavigate } from "react-router-dom";
import Button from "../../components/Button";
import { updateAppointmentStatus } from "../../services/config/Api";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import { Toast } from "../../components/Toast";

const Appointment = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>();
  const userData = useSelector(selectUser);
  const navigate = useNavigate()
  const authToken = useSelector(selectAuthToken)

  const [appointmentStatus, setAppointmentStatus] =
    useState<string>("upcoming");

  const [upComingAppointment, setUpComingAppointment] = useState<any>([
    {
      name: "Mike Trim",
      date: "02 Feb/02:00AM",
      service: "Beard",
      serviceCategory: "(Beard)",
      status: "Completed",
      price: 20,
    },
  ]);
  const [cancelAppointmentLoader, setCancelAppointmentLoader] = useState<boolean>(false)

  useEffect(() => {
    const handleBackButton = (event: any) => {
      event.preventDefault();

      const backNavigation = sessionStorage.getItem('backNavigation');
      if (backNavigation) {
        sessionStorage.removeItem('backNavigation');
        navigate(backNavigation, { replace: true });
      } else {
        navigate(-1);
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [navigate]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const handleClick = (item: any) => {
    setSelectedAppointment(item);
    setIsModalOpen(!isModalOpen);
  };

  const calculateTotalAmount = (services: any) => {
    return services?.reduce(
      (total: any, service: any) => total + parseFloat(service.price),
      0
    );
  };

  const handleUpdateAppointmentStatus = async (_id: any) => {
    try {
      setCancelAppointmentLoader(true)
      const response = await updateAppointmentStatus(authToken, _id, 'Cancelled') as { status: any, data: any }
      if (response?.status == 200) {
        setCancelAppointmentLoader(false)
        setIsModalOpen(false)
        Toast("success", 'Appointment cancelled successfully!')
        setSelectedAppointment((prevAppointment: any) => ({
          ...prevAppointment,
          status: 'Cancelled'
        }))
      } else {
        setCancelAppointmentLoader(false)
        Toast("error", response?.data?.message)
      }
    } catch (error) {
      setCancelAppointmentLoader(false)
    }
  }

  return (
    <div className="px-4 md:px-10 mb-5">
      <div className="flex flex-col md:flex-row justify-between border-b-2 pb-4">
        <div className="text-2xl flex justify-center font-bold mb-2">
          Appointments
        </div>
        <div className="flex flex-row justify-between  mb-2"></div>
      </div>
      <div className="mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {userData?.appoinment?.map((item: any, index: number) => {
            return (
              <div className="border rounded-xl p-4" key={index}>
                <div className="flex flex-row justify-between border-b border-black pb-4">
                  <div className="flex flex-row">
                    <img
                      src={
                        item.barber?.profile
                          ? item.barber.profile
                          : item.barber.gender === "male"
                            ? images.male
                            : images.female
                      }
                      className="h-20 object-contain w-16 md:w-20 rounded-xl border"
                    />
                    <div className="flex flex-col self-center ml-3">
                      <div className="text-xl md:text-2xl text-black font-bold">
                        {item?.barber?.name}
                      </div>
                      <div className="text-black font-light">
                        {new Date(item.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                        /{item.time}
                      </div>
                    </div>
                  </div>
                  <div className="border rounded-xl text-white bg-black px-3 py-1 flex self-start">
                    {item.status}
                  </div>
                </div>
                <div className="flex justify-between mt-3" key={index}>
                  <div className="flex">
                    <div className="text-black font-bold">
                      {item?.services[0]?.serviceName}
                    </div>
                    <div className="text-black font-light ml-1">
                      {`(${item?.services[0]?.name})`}
                    </div>
                  </div>
                  <div className="border border-black text-black px-3 rounded-lg">
                    ${item?.services[0]?.price}
                  </div>
                </div>
                <div
                  className="flex items-center justify-between border bg-black rounded-xl py-3 px-4 cursor-pointer mt-4 text-white bottom-0"
                  onClick={() => handleClick(item)}
                >
                  See Details
                  <img src={images.arrowBtn} className="w-3" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4 sm:p-6 z-50  max-w-[2800px] mx-auto">
          <div className="bg-white w-full sm:w-4/5 md:w-2/3 lg:w-1/3 flex flex-col p-2 xs:p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center border-b-2 pb-3">
              <div className="text-xl font-bold">Appointment Details</div>
              <div
                className="bg-black p-3 rounded-xl cursor-pointer"
                onClick={() => { !cancelAppointmentLoader && setIsModalOpen(false) }}
              >
                <img
                  src={images.cross}
                  className="w-4 filter invert brightness-0"
                />
              </div>
            </div>
            <div className="flex justify-between mt-3">
              <div className="text-lg text-black font-bold">Selected Date</div>
              <div className="text-base text-black ">
                {new Date(selectedAppointment.date).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  }
                )}
              </div>
            </div>
            <div className="flex justify-between mt-3 border-b-2 pb-3">
              <div className="text-lg text-black font-bold">Selected Time</div>
              <div className="text-base text-black ">
                {selectedAppointment.time}
              </div>
            </div>
            <div className="flex flex-row my-5">
              <img
                src={
                  selectedAppointment.barber?.profile
                    ? selectedAppointment.barber.profile
                    : selectedAppointment.barber.gender === "male"
                      ? images.male
                      : images.female
                }
                className="h-20 object-contain w-16 md:w-20 rounded-xl border"
              />
              <div className="flex flex-col ml-3">
                <div className="text-xl md:text-2xl text-black font-bold">
                  {selectedAppointment?.barber?.name}
                </div>
                <div className="text-black font-light">
                  {selectedAppointment.time}
                </div>
              </div>
            </div>
            {selectedAppointment.services.map((item: any, index: number) => {
              return (
                <div>
                  <div className="font-bold">{item?.serviceName}</div>
                  <div className="flex justify-between">
                    <div className="font-light mb-4">{item?.name}</div>
                    <div className="rounded-lg">${item?.price}.00</div>
                  </div>
                </div>
              );
            })}

            <div className="flex justify-end mt-10 font-bold">
              {`Total: $${calculateTotalAmount(
                selectedAppointment?.services
              )}.00`}
            </div>
            {
              selectedAppointment?.status === 'Pending' &&
              <Button title="Cancel Appointment" light={false} mt="15px" onClick={() => handleUpdateAppointmentStatus(selectedAppointment?._id)} loader={cancelAppointmentLoader} />
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;
