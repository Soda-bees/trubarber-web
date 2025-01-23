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
import BottomToTopAnimation from "../../components/BottomToTopAnimation";
import SmallButton from "../../components/SmallButton";

type NextClientType = {
  name: string,
  date: string,
  time: string,
  style: string,
  services: string
}

type SelectedAppointmentForBarberView = {
  clientName: string,
  date: string,
  service: string,
  status: string,
  time: string,
  id: string
}

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

  const [cancelAppointmentLoader, setCancelAppointmentLoader] = useState<boolean>(false)
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [showDateModal, setShowDateModal] = useState<boolean>(false)
  const [showDays, setShowDays] = useState<number>(1)
  const [barberAppointments, setBarberAppointments] = useState<[]>([])
  const [nextClient, setNextClient] = useState<NextClientType | null>(null)
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(window.innerWidth < 1177)
  const [isShowRequest, setIsShowRequest] = useState<boolean>(false)
  const [selectedAppointmentForBarberView, setSelectedAppointmentForBarberView] = useState<SelectedAppointmentForBarberView | null>(null)


  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1177px)");

    const handleScreenResize = (event: MediaQueryListEvent) => {
      setIsSmallScreen(!mediaQuery.matches);


    };
    mediaQuery.addEventListener("change", handleScreenResize);

    return () => {
      mediaQuery.removeEventListener("change", handleScreenResize);
    };
  }, []);

  useEffect(() => {
    if (!isSmallScreen) {
      setIsShowRequest(false)
    }
  }, [isSmallScreen]);

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
          start: startDate.format('YYYY-MM-DDTHH:mm:ss'),
          end: endDate.format('YYYY-MM-DDTHH:mm:ss'),
          extendedProps: {
            clientName: appointment?.user?.name || '',
            service: appointment?.services
              ?.map((service: any) => service?.serviceName)
              .join(' & ') || '',
            duration: appointment?.time || '',
            status: appointment?.status || '',
            date: appointment?.date || '',
            id: appointment?._id || '', // Include the ID here
            time: appointment?.time,
          },
          // clientName: appointment?.user?.name || '',
          // service:
          //   appointment?.services
          //     ?.map((service: any) => service?.serviceName)
          //     .join(' & ') || '',
          // start: startDate.format('YYYY-MM-DDTHH:mm:ss'),
          // end: endDate.format('YYYY-MM-DDTHH:mm:ss'),
          // duration: appointment?.time || '',
          // status: appointment?.status || '',
          // date: appointment?.date || '',
          // id: appointment?._id || '',
          // time: appointment?.time,
        };
      })
      .filter((item: any) => item !== null);

    setBarberAppointments(transformedData)

  }

  const handleClick = (item: any) => {
    console.log(item);

    setSelectedAppointment(item);
    setIsModalOpen(!isModalOpen);
  };

  const calculateTotalAmount = (services: any) => {
    return services?.reduce(
      (total: any, service: any) => total + parseFloat(service.price),
      0
    );
  };

  const handleUpdateAppointmentStatus = async (_id: any, status: string) => {
    try {
      setCancelAppointmentLoader(true)
      const response = await updateAppointmentStatus(authToken, _id, status) as { status: any, data: any }
      if (response?.status == 200) {
        setCancelAppointmentLoader(false)
        setIsModalOpen(false)
        Toast("success", response?.data?.message)
        if (userData?.role === 'user') {
          setSelectedAppointment((prevAppointment: any) => ({
            ...prevAppointment,
            status: 'Cancelled'
          }))
        }
        if (userData?.role === 'barber') {
          setSelectedAppointmentForBarberView(null)
          // if(status === 'Completed'){
          //   setSelectedAppointmentForBarberView((prevState:any) => ({
          //     ...prevState,
          //     status:'Completed'
          //   }))
          // }
        }
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
    const { start, end, title, extendedProps, date } = eventInfo.event

    return (
      <div className="text-black ml-2" onClick={() => {
        const date = moment(start).format('ddd, MMM D');
        const updatedProps = {
          ...extendedProps,
          date
        };
        setSelectedAppointmentForBarberView(updatedProps)
      }}>
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
      setNextClient(data)
      console.log("next client", data);

    } else {
      console.log('No future appointments found.');
    }
  }

  const convertDateFormat = (dateString: any) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    // Split the input date string into parts
    const [month, day, year] = dateString.split('-');

    // Get the month name from the months array
    const monthName = months[parseInt(month, 10) - 1];

    // Format the date in "DD/MM" format
    return `${day}-${monthName}`;
  };

  const isFutureTime = (startTime: any, formattedDate: any) => {
    console.log("Formatted Date:", formattedDate);
    console.log("Start Time Range:", startTime);

    const startTimeSingle = startTime.split('-')[0].trim();

    const dateTime = moment(
      `${formattedDate} ${startTimeSingle}`,
      'ddd, MMM D h:mm A'
    );

    const currentDateTime = moment();
    console.log("Parsed DateTime:", dateTime.format('ddd, MMM D YYYY h:mm A'));
    console.log("Current DateTime:", currentDateTime.format('ddd, MMM D YYYY h:mm A'));
    console.log("Is Future:", dateTime.isAfter(currentDateTime));

    return dateTime.isAfter(currentDateTime);
  };

  const availableHeightInVH = 100 - headerHeight || 100

  return (
    <div className="px-4 ">
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
                    }).reverse()
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
                    <Button title="Cancel Appointment" light={false} mt="15px" onClick={() => handleUpdateAppointmentStatus(selectedAppointment?._id, "Cancelled")} loader={cancelAppointmentLoader} />
                  }
                </div>
              </div>
            )}
          </div>
        ) : (
          isShowRequest ? (
            <div className="" style={{
              minHeight: `${availableHeightInVH}vh`,
              maxHeight: `${availableHeightInVH}vh`,
            }}>
              <div className={isSmallScreen ? 'w-full flex items-end justify-start md:justify-start' : 'hidden'}>
                <div className='flex flex-row items-center bg-appGray border border-black rounded-lg p-1 mt-4 md:mt-0'>
                  <div className={`cursor-pointer px-8 py-1 ${!isShowRequest && 'bg-black rounded-lg text-white'}`}
                    onClick={() => setIsShowRequest(false)}>Appointments</div>
                  <div className={`cursor-pointer px-8 py-1 ${isShowRequest && 'bg-black rounded-lg text-white'}`}
                    onClick={() => setIsShowRequest(true)}>Requests</div>
                </div>
              </div>
              <div className="h-full overflow-y-auto hide-scrollbar grid grid-cols-1 gap-4 pb-24 mt-4 auto-rows-min" style={{
                minHeight: `${availableHeightInVH}vh`,
                maxHeight: `${availableHeightInVH}vh`,
              }}>

                {
                  userData?.appoinment?.filter((item: any) => item.status === 'Pending')
                    ?.length > 0 ? (
                    userData?.appoinment?.filter((item: any) => item.status === 'Pending')?.map((item: any, index: number) => {
                      return (
                        <div key={index} className="border border-gray-300 rounded-lg shadow-sm p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center">
                              <img
                                src={item?.user?.profile ? item?.user?.profile : item?.user?.gender === 'male' ? images.male : images.female}
                                alt="Profile"
                                className="w-10 h-10 rounded-full"
                              />
                              <div className="ml-4">
                                <h2 className="text-lg font-bold">{item?.user?.name}</h2>
                              </div>
                            </div>
                            <button className="text-black font-medium hover:underline">Reject</button>
                          </div>
                          <div className="border-t border-gray-200 py-4">
                            <h3 className="text-sm font-semibold mb-2">Services</h3>
                            {
                              item?.services?.map((service: any, index: number) => {
                                return (
                                  <div key={index} className="flex justify-between text-sm mb-1">
                                    <p>{`${service?.name} (${service?.serviceName}) (${service?.time} min)`}</p>
                                    <p>{`$${Number(service?.price || 0).toFixed(2)}`}</p>
                                  </div>
                                )
                              })
                            }

                          </div>
                          <div className="border-t border-gray-200 py-4">
                            <div className="flex justify-between text-base font-semibold">
                              <p>Total Amount</p>
                              <p>{`$${(calculateTotalAmount(item?.services) || 0).toFixed(2)}`}</p>
                            </div>
                            <div className="text-gray-500 text-sm mt-1">
                              {`${convertDateFormat(item?.date)} / ${item?.time} `}
                            </div>
                          </div>
                          <button className="w-full bg-black text-white py-2 mt-4 rounded-md">
                            Accept
                          </button>
                        </div>
                      )
                    })
                  ) : (
                    <div>You have not booked any appointments yet.</div>
                  )
                }
              </div>
            </div>) : (
            <div className="w-full h-full flex flex-row gap-4 pb-4"
              style={{
                minHeight: `${availableHeightInVH}vh`,
                maxHeight: `${availableHeightInVH}vh`,
              }}>
              <div className={isSmallScreen ? "w-full flex flex-col" : userData?.appoinment?.filter((item: any) => item.status === 'Pending')
                ?.length > 0 ? "w-[70%] flex flex-col " : "w-full flex flex-col "}>
                <div className="flex flex-col lg:flex-row items-start pb-4">
                  <div className="w-full lg:w-[45%] mb-4">
                    <div className={isSmallScreen ? "hidden" : "text-2xl font-bold mb-2"}>
                      Appointments
                    </div>
                    <div className={isSmallScreen ? 'w-full flex items-end justify-start md:justify-start' : 'hidden'}>
                      <div className='flex flex-row items-center bg-appGray border border-black rounded-lg p-1 mt-4 md:mt-0'>
                        <div className={`cursor-pointer px-8 py-1 ${!isShowRequest && 'bg-black rounded-lg text-white'}`}
                          onClick={() => setIsShowRequest(false)}>Appointments</div>
                        <div className={`cursor-pointer px-8 py-1 ${isShowRequest && 'bg-black rounded-lg text-white'}`}
                          onClick={() => setIsShowRequest(true)}>Requests</div>
                      </div>
                    </div>
                    <div className="lg:mt-14 mt-2">
                      <div className="text-lg font-semibold ">My Schedule</div>
                      <div className="w-[90%] text-sm text-textGray">Your Schedule Overview: Keep track of upcoming and completed appointments here.</div>
                    </div>
                  </div>
                  {
                    nextClient &&
                    <div className="bg-inputGray h-full w-[2px]"></div>
                  }
                  {
                    nextClient &&
                    <div className="w-full lg:w-[55%] mb-4 flex flex-col items-start justify-between h-full">
                      <div className="w-[85%] lg:mx-auto text-lg font-semibold">Next client</div>
                      <div className="w-full lg:w-[85%] mx-auto border-2 border-inptgray xs:py-4 p-2 xs:px-6 rounded-xl">
                        <div className="flex flex-ro items-center">
                          <img src={images.user} className="w-5 h-5" />
                          <div className="text-lg font-semibold ml-2">{nextClient?.name}</div>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                          <div>
                            <div className="flex flex-row items-center">
                              <img src={images.appointment} className="w-4 h-4 filter invert dark-0" />
                              <div className="ml-2">{nextClient?.date}</div>
                            </div>
                            <div className="flex flex-row items-center mt-2">
                              <img src={images.clock} className="w-4 h-4" />
                              <div className="ml-2">{nextClient?.time}</div>
                            </div>
                          </div>
                          <div className="bg-inputGray h-[50px] w-[2px]"></div>
                          <div className="text-sm">
                            <div>
                              <div className="font-semibold">Services</div>
                              <div>{nextClient?.services}</div>
                            </div>
                            <div>
                              <div className="font-semibold">Style</div>
                              <div>{nextClient?.style}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
                <div className="h-full overflow-y-scroll hide-scrollbar">
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
                    height={"100%"}
                  />
                </div>
              </div>
              {userData?.appoinment?.filter((item: any) => item.status === 'Pending')
                ?.length > 0 &&
                <div className={isSmallScreen ? "hidden" : "w-[30%]"}>
                  <div className="h-full overflow-y-auto hide-scrollbar grid grid-cols-1 gap-4 auto-rows-min" >
                    {
                      userData?.appoinment?.filter((item: any) => item.status === 'Pending')?.map((item: any, index: number) => {
                        return (
                          <div key={index} className="border border-gray-300 rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                <img
                                  src={item?.user?.profile ? item?.user?.profile : item?.user?.gender === 'male' ? images.male : images.female}
                                  alt="Profile"
                                  className="w-10 h-10 rounded-full"
                                />
                                <div className="ml-4">
                                  <h2 className="text-lg font-bold">{item?.user?.name}</h2>
                                </div>
                              </div>
                              <button className="text-black font-medium hover:underline" onClick={() => { handleUpdateAppointmentStatus(item?._id, 'Rejected') }}>Reject</button>
                            </div>
                            <div className="border-t border-gray-200 py-4">
                              <h3 className="text-sm font-semibold mb-2">Services</h3>
                              {
                                item?.services?.map((service: any, index: number) => {
                                  return (
                                    <div key={index} className="flex justify-between text-sm mb-1">
                                      <p>{`${service?.name} (${service?.serviceName}) (${service?.time} min)`}</p>
                                      <p>{`$${Number(service?.price || 0).toFixed(2)}`}</p>
                                    </div>
                                  )
                                })
                              }

                            </div>
                            <div className="border-t border-gray-200 py-4">
                              <div className="flex justify-between text-base font-semibold">
                                <p>Total Amount</p>
                                <p>{`$${(calculateTotalAmount(item?.services) || 0).toFixed(2)}`}</p>
                              </div>
                              <div className="text-gray-500 text-sm mt-1">
                                {`${convertDateFormat(item?.date)} / ${item?.time} `}
                              </div>
                            </div>
                            <button className="w-full bg-black text-white py-2 mt-4 rounded-md" onClick={() => handleUpdateAppointmentStatus(item?._id, 'Scheduled')}>
                              Accept
                            </button>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>
              }
              {
                selectedAppointmentForBarberView &&
                <div
                  onClick={() => setSelectedAppointmentForBarberView(null)}
                  className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
                  <div onClick={(e) => e.stopPropagation()}>
                    <BottomToTopAnimation className="bg-white w-full max-w-[500px] md:max-w-[400px] lg:max-w-[400px] p-4 sm:p-6 rounded-xl shadow-lg">
                      <div className="flex items-center justify-center text-center font-semibold text-lg sm:text-xl">
                        Service Completion Confirmation
                      </div>

                      <div className="grid grid-cols-3 mt-4">
                        <div className="font-semibold text-sm sm:text-base">Service</div>
                        <div className="col-span-2 text-gray-400 text-sm sm:text-base">
                          {selectedAppointmentForBarberView?.service}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 mt-2">
                        <div className="font-semibold text-sm sm:text-base">Status</div>
                        <div className="col-span-2 text-gray-400 text-sm sm:text-base">
                          {selectedAppointmentForBarberView?.status}
                        </div>
                      </div>

                      <div className="flex items-center mt-4">
                        <img src={images.clock} className="w-5 h-5" alt="Clock Icon" />
                        <div className="ml-2 text-sm sm:text-base">
                          {`${selectedAppointmentForBarberView?.date} - ${selectedAppointmentForBarberView?.time}`}
                        </div>
                      </div>

                      <div className="flex items-center mt-4 mb-4">
                        <img src={images.user} className="w-5 h-5" alt="User Icon" />
                        <div className="ml-2 text-sm sm:text-base font-medium">
                          {selectedAppointmentForBarberView?.clientName}
                        </div>
                      </div>
                      <SmallButton dark={true} title="Confirm" onClick={() => {
                        handleUpdateAppointmentStatus(selectedAppointmentForBarberView?.id, 'Completed')
                      }}
                        loader={cancelAppointmentLoader}
                        disable={
                          isFutureTime(selectedAppointmentForBarberView?.time, selectedAppointmentForBarberView?.date) ||
                          selectedAppointmentForBarberView?.status === 'Completed' ||
                          selectedAppointmentForBarberView?.status === 'Cancelled'
                        }
                      />
                    </BottomToTopAnimation>
                  </div>
                </div>

              }
            </div>
          )
        )
      }
    </div >
  );
};

export default Appointment;
