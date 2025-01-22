import React, { useEffect, useRef, useState } from "react";
import images from "../../services/config/images";
import { useSelector } from "react-redux";
import { selectUser } from "../../Store/userDataSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import Button from "../../components/Button";
import { updateAppointmentStatus } from "../../services/config/Api";
import { selectAuthToken } from "../../Store/AuthTokenSlice";
import { Toast } from "../../components/Toast";
import { selectRole } from "../../Store/Role";
import '../../App.css'
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from "moment";

const Appointment = () => {

  const { search, headerFooterHeight, headerHeight } =
    useOutletContext<{ search: string, headerFooterHeight: number, headerHeight: number }>()

  const calendarRef = useRef<FullCalendar | null>(null);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>();
  const userData = useSelector(selectUser);
  const navigate = useNavigate()
  const authToken = useSelector(selectAuthToken)
  const role = useSelector(selectRole)

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
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [showDateModal, setShowDateModal] = useState<boolean>(false)
  const [showDays, setShowDays] = useState<number>(1)
  const [barberAppointments, setBarberAppointments] = useState<[]>([])

  useEffect(() => {
    const breakpoints = {
      xs: "(min-width: 500px)",
      sm: "(min-width: 640px)",
      md: "(min-width: 768px)",
      lg: "(min-width: 1024px)",
      xl: "(min-width: 1280px)",
      "2xl": "(min-width: 1536px)",
    };

    const updateBreakpoint = () => {
      if (window.matchMedia(breakpoints["2xl"]).matches) {
        setShowDays(7)
      } else if (window.matchMedia(breakpoints["xl"]).matches) {
        setShowDays(6)
      } else if (window.matchMedia(breakpoints["lg"]).matches) {
        setShowDays(5);
      } else if (window.matchMedia(breakpoints["md"]).matches) {
        setShowDays(3);
      } else if (window.matchMedia(breakpoints["xs"]).matches) {
        setShowDays(2);
      } else {
        setShowDays(1)
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);

    return () => {
      window.removeEventListener("resize", updateBreakpoint);
    };
  }, []);

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
    if (isModalOpen || showDateModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen, showDateModal]);

  useEffect(() => {
    if (role === 'barber') {
      if (userData?.appoinment) {
        const filteredAppointment = userData?.appoinment?.filter(
          (item: any) => item.status !== 'Pending' && item.status !== 'Rejected',
        )
        mapBackendDataToAppointmentTimeline(filteredAppointment);
      }
      setNextAppointmentData();
    }
  }, [userData])

  const mapBackendDataToAppointmentTimeline = async (backendData: any) => {
    if (!backendData) return null

    const transformedData = backendData
      .map((appointment: any) => {
        if (!appointment) return null;

        const startDate = moment(
          `${appointment?.date} ${appointment?.time}`,
          'MM-DD-YYYY h:mm A',
        );
        const endDate = moment(startDate).add(1, 'hour');

        return {
          clientName: appointment?.user?.name || '',
          service:
            appointment?.services
              ?.map((service: any) => service?.serviceName)
              .join(' & ') || '',
          start: startDate.format('YYYY-MM-DDTHH:mm:ss'),
          end: endDate.format('YYYY-MM-DDTHH:mm:ss'),
          duration: appointment?.time || '',
          status: appointment?.status || '',
          date: appointment?.date || '',
          id: appointment?._id || '',
          time: appointment?.time,
        };
      })
      .filter((item: any) => item !== null);

    setBarberAppointments(transformedData)

  }

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

  const handleDateChange = (date: Date | null) => {

    if (date) {
      // Set startDate to the selected date with time set to 00:00:00
      const newDate = new Date(date);
      newDate.setHours(0, 0, 0, 0); // Set time to 00:00
      console.log(newDate);
      setStartDate(newDate);
    } else {
      alert('null')
      setStartDate(null);
    }// Update start date directly
  };

  const handleDatesSet = (rangeInfo: any) => {
    if (rangeInfo.start) {
      setStartDate(rangeInfo.start);
    }
  };
  useEffect(() => {
    if (calendarRef.current && startDate) {
      const calendarApi = calendarRef.current.getApi();

      const currentViewDate = calendarApi.getDate();
      if (currentViewDate.toISOString().split('T')[0] !== startDate.toISOString().split('T')[0]) {
        calendarApi.gotoDate(startDate);
      }
    }
  }, [startDate]);

  const renderEventContent = (eventInfo: any) => {
    const { start, end, title, extendedProps } = eventInfo.event
    return (
      <div className="text-black ml-2" onClick={() => alert('hello')}>
        <div className="font-bold">{extendedProps?.clientName}</div>
        <div className="text-sm">{extendedProps?.service}</div>
        <div className="text-sm">{extendedProps?.time}</div>
      </div>
    );
  };

  const formatDateShort = (dateString: any) => {
    if (!dateString) return '';

    const parts = dateString.split('-');
    if (parts.length !== 3) return '';

    const day = parseInt(parts[1], 10);
    const month = parseInt(parts[0], 10) - 1;
    const year = parseInt(parts[2], 10);

    const dateObj = new Date(year, month, day);

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    };

    return dateObj.toLocaleDateString('en-US', options);
  };

  const setNextAppointmentData = async () => {
    const currentDate = moment();
    let allAppointments = userData?.appoinment ? [...userData.appoinment] : [];
    let appointments = allAppointments.filter(
      item => item.status !== 'Pending' && item.status !== 'Rejected',
    );
    const sortedAppointments = appointments.sort((a, b) => {
      const aDateTime = moment(
        `${a.date || ''} ${a.time || ''}`,
        'MM-DD-YYYY h:mm A',
      );
      const bDateTime = moment(
        `${b.date || ''} ${b.time || ''}`,
        'MM-DD-YYYY h:mm A',
      );
      return aDateTime.diff(bDateTime);
    });
    const nextAppointment = sortedAppointments.find(appointment => {
      const appointmentDateTime = moment(
        `${appointment?.date} ${appointment?.time}`,
        'MM-DD-YYYY h:mm A',
      );
      return appointmentDateTime?.isAfter(currentDate);
    });
    if (nextAppointment) {
      const allServices = nextAppointment?.services
        ?.map((service: any) => service?.name)
        .join(' & ');
      const allStyles = nextAppointment?.services
        ?.map((service: any) => service?.serviceName)
        .join(' & ');
      const data = {
        name: nextAppointment?.user?.name,
        date: formatDateShort(nextAppointment?.date),
        time: nextAppointment?.time,
        style: allServices,
        services: allStyles
      }
      // setClientName(nextAppointment?.user?.name);
      // setClientDate(formatDateShort(nextAppointment?.date));
      // setClientTime(nextAppointment?.time);
      // const allServices = nextAppointment?.services
      //   ?.map(service => service?.name)
      //   .join(' & ');
      // setStyle(allServices);

      // const allStyles = nextAppointment?.services
      //   ?.map(service => service?.serviceName)
      //   .join(' & ');
      // setService(allStyles);
      console.log("next appointment ==>", data);

    } else {
      console.log('No future appointments found.');
    }
  }

  const availableHeightInVH = 100 - headerHeight || 100

  return (
    <div className="px-4 md:px-10 ">
      {
        role === 'user' ? (
          <div>
            <div className="flex flex-col md:flex-row justify-between border-b-2 pb-4">
              <div className="text-2xl flex justify-center font-bold mb-2">
                Appointments
              </div>
              <div className="flex flex-row justify-between  mb-2"></div>
            </div>
            <div className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4 pb-5">
                {
                  userData?.appoinment?.length > 0 ? (
                    userData?.appoinment?.map((item: any, index: number) => {
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
                    })
                  ) : (
                    <div className="font-semibold">  You have not booked any appointments yet.</div>
                  )
                }
                {/* {userData?.appoinment?.map((item: any, index: number) => {
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
                })} */}
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
        ) : (
          // <div className="">
          //   <div className="flex flex-row items-center justify-between py-2 px-1 font-semibold" onClick={() => setShowDateModal(true)}>
          //     <div>
          //       {startDate ? moment(startDate).format('MMMM') : "No Date Selected"}
          //     </div>
          //     <div className="cursor-pointer">
          //       {startDate ? moment(startDate).format('YYYY-MM-DD') : "No Date Selected"}
          //     </div>
          //   </div>
          //   {
          //     showDateModal &&
          //     <div
          //       onClick={() => setShowDateModal(false)}
          //       className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
          //       <div onClick={(e) => e.stopPropagation()} className="">
          //         <DatePicker
          //           className="w-[100px] text-center py-1 rounded-lg cursor-pointer outline-none shadow-xl"
          //           selected={startDate}
          //           onChange={handleDateChange}
          //           showTimeSelect={false}
          //           dateFormat="yyyy-MM-dd"
          //         />
          //       </div>
          //     </div>
          //   }
          //   <FullCalendar
          //     ref={calendarRef}
          //     plugins={[timeGridPlugin]}
          //     events={barberAppointments}
          //     slotMinTime="00:00:00"
          //     slotMaxTime="24:00:00"
          //     slotDuration="01:00:00"
          //     allDaySlot={false}
          //     dayHeaderContent={(arg) => {
          //       const weekday = arg.date.toLocaleString('en-US', { weekday: 'short' });
          //       const day = arg.date.getDate();
          //       return <div className="text-start">
          //         <div>{day}</div>
          //         <div>{weekday}</div>
          //       </div>
          //     }}
          //     slotLabelFormat={{
          //       hour: '2-digit',
          //       hour12: true,
          //     }}
          //     titleFormat={{
          //       year: "numeric",
          //       month: "short",
          //       day: "numeric",
          //     }}
          //     initialView="customTwoDay"
          //     views={{
          //       customTwoDay: {
          //         type: "timeGrid",
          //         duration: { days: showDays },
          //       },
          //     }}
          //     eventContent={renderEventContent}
          //     datesSet={handleDatesSet}
          //     headerToolbar={false}
          //     nowIndicator={true}
          //   />
          // </div>
          // overflow-y-auto hide-scrollbar
          <div className="w-full h-full flex flex-row" style={{
            minHeight: `${availableHeightInVH}vh`,
            maxHeight: `${availableHeightInVH}vh`,
          }}>
            <div className="w-[70%] flex flex-col">
              <div className="flex flex-row items-start">
                <div className="w-[45%] mb-4">
                  <div className="text-2xl font-bold mb-2">
                    Appointments
                  </div>
                  <div className="mt-14">
                    <div className="text-lg font-semibold">My Schedule</div>
                    <div className="w-[90%] text-sm text-textGray">Your Schedule Overview: Keep track of upcoming and completed appointments here.</div>
                  </div>
                </div>
                <div className="bg-inputGray h-full w-[2px]"></div>
                <div className="w-[55%]  mb-4">
                  <div className="w-[85%] mx-auto">next client</div>
                  <div className=" w-[85%] mx-auto ">details</div>
                </div>
              </div>
              <div className="h-full overflow-y-auto hide-scrollbar">
                <div className="flex flex-row items-center justify-between py-2 px-1 font-semibold" onClick={() => setShowDateModal(true)}>
                  <div>
                    {startDate ? moment(startDate).format('MMMM') : "No Date Selected"}
                  </div>
                  <div className="cursor-pointer">
                    {startDate ? moment(startDate).format('YYYY-MM-DD') : "No Date Selected"}
                  </div>
                </div>
                {
                  showDateModal &&
                  <div
                    onClick={() => setShowDateModal(false)}
                    className="fixed inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-50">
                    <div onClick={(e) => e.stopPropagation()} className="">
                      <DatePicker
                        className="w-[100px] text-center py-1 rounded-lg cursor-pointer outline-none shadow-xl"
                        selected={startDate}
                        onChange={handleDateChange}
                        showTimeSelect={false}
                        dateFormat="yyyy-MM-dd"
                      />
                    </div>
                  </div>
                }
                <FullCalendar
                  ref={calendarRef}
                  plugins={[timeGridPlugin]}
                  events={barberAppointments}
                  slotMinTime="00:00:00"
                  slotMaxTime="24:00:00"
                  slotDuration="01:00:00"
                  allDaySlot={false}
                  dayHeaderContent={(arg) => {
                    const weekday = arg.date.toLocaleString('en-US', { weekday: 'short' });
                    const day = arg.date.getDate();
                    return <div className="text-start">
                      <div>{day}</div>
                      <div>{weekday}</div>
                    </div>
                  }}
                  slotLabelFormat={{
                    hour: '2-digit',
                    hour12: true,
                  }}
                  titleFormat={{
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }}
                  initialView="customTwoDay"
                  views={{
                    customTwoDay: {
                      type: "timeGrid",
                      duration: { days: showDays },
                    },
                  }}
                  eventContent={renderEventContent}
                  datesSet={handleDatesSet}
                  headerToolbar={false}
                  nowIndicator={true}
                />
              </div>
            </div>
            <div className="w-[30%] bg-pink-500">seond</div>
          </div>
        )
      }
    </div >
  );
};

export default Appointment;
