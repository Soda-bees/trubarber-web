import React, { useEffect, useRef, useState } from 'react'
import BackButton from '../../components/BackButton'
import { useDispatch, useSelector } from 'react-redux'
import { deletePendingAppointmentsItem, selectPendingAppointment } from '../../Store/PendingAppointment'
import { selectBarbers } from '../../Store/BarbersSlice'
import { selectAuthToken } from '../../Store/AuthTokenSlice'
import { handleGetBookAppointment } from '../../services/config/Api'
import moment from 'moment'
import images from '../../services/config/images'
import { Toast } from '../../components/Toast'
import useNavigate from '../../components/ScrollToTopNavigate'
import Button from '../../components/Button'

type Props = {}

const BookAppointment = (props: Props) => {
    const dateScrollRef = useRef<HTMLDivElement | null>(null);
    const timeScrollRef = useRef<HTMLDivElement | null>(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const pendingAppointment = useSelector(selectPendingAppointment)
    const barbers = useSelector(selectBarbers)
    const authToken = useSelector(selectAuthToken)

    const [barber, setBarber] = useState<any>()
    const [bookedTime, setBookedTime] = useState<any>([])
    const [totalAmount, setTotalAmount] = useState<number>()
    const [dates, setDates] = useState<any>(null)
    const [selected, setSelected] = useState(null)
    const [dateData, setDatedata] = useState<any | null>()
    const [selectedDate, setSelectedDate] = useState<any | null>(null)
    const [totalDuration, setTotalDuration] = useState()

    useEffect(() => {
        findBarber()
        setTotalPrice()
        getNext30Days()
        handleSetTotalDuration()
    }, [pendingAppointment])

    const findBarber = async () => {
        const barber = await barbers.find((barber: any) => barber._id === pendingAppointment?.barber)
        setBarber(barber)
        getBookedAppointment(barber?._id)
    }

    const getBookedAppointment = async (id: any) => {
        try {
            const response = await handleGetBookAppointment(authToken, id) as { status: number; data?: any; }
            if (response?.status === 200) {
                setBookedTime(response?.data?.appointments)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const setTotalPrice = async () => {
        let totalPrice = 0;
        pendingAppointment?.services?.forEach((service: any) => {
            totalPrice += parseFloat(service?.price)
        });
        setTotalAmount(totalPrice)
    }

    const getNext30Days = async () => {
        const daysArray = []

        for (let i = 0; i < 30; i++) {
            const currentDate = moment().add(i, 'days')
            daysArray.push({
                date: currentDate.format('MM-DD-YYYY'),
                day: currentDate.format('ddd'),
            })
        }
        setDates(daysArray)
    }

    const handleSetTotalDuration = async () => {
        const services = pendingAppointment?.services
        const totalTime = services?.reduce(
            (acc: any, service: any) => acc + parseInt(service?.time, 10), 0,
        )
        setTotalDuration(totalTime)
    }

    const getMonthsFromDateArray = (dateArray: any) => {
        const months = new Set();
        dateArray.forEach((item: any) => {
            const month = moment(item.date, 'MM-DD-YYYY').format('MMM');
            months.add(month);
        });
        return Array.from(months);
    }

    const getDayFromDate = (dateString: any) => {
        const date = moment(dateString, 'MM-DD-YYYY');
        return date.format('DD');
    }

    const dateScrollLeft = () => {
        if (dateScrollRef.current) {
            dateScrollRef.current.scrollBy({
                left: -80,
                behavior: 'smooth',
            });
        }
    };

    const dateScrollRight = () => {
        if (dateScrollRef.current) {
            dateScrollRef.current.scrollBy({
                left: 80,
                behavior: 'smooth',
            });
        }
    }

    const timeScrollLeft = () => {
        if (timeScrollRef.current) {
            timeScrollRef.current.scrollBy({
                left: -80,
                behavior: 'smooth',
            });
        }
    };

    const timeScrollRight = () => {
        if (timeScrollRef.current) {
            timeScrollRef.current.scrollBy({
                left: 80,
                behavior: 'smooth',
            });
        }
    }

    const getDayObject = (shortDay: keyof typeof dayMap) => {
        const dayMap = {
            Sun: 'Sunday',
            Mon: 'Monday',
            Tue: 'Tuesday',
            Wed: 'Wednesday',
            Thu: 'Thursday',
            Fri: 'Friday',
            Sat: 'Saturday',
        };

        const fullDayName = dayMap[shortDay];
        return barber?.scheduled.find((item: any) => item.day === fullDayName) || null;
    };

    const checkAndReturnTime = (startTime: any, formattedDate: any) => {
        const dateTime = moment(
            `${formattedDate} ${startTime}`,
            'MM-DD-YYYY h:mm A',
        );
        const currentDateTime = moment();

        // Function to round minutes to the nearest 5-minute interval
        const roundToNearest5 = (minutes: any) => {
            return Math.ceil(minutes / 5) * 5;
        };

        const adjustedDateTime = dateTime.isAfter(currentDateTime)
            ? dateTime
            : currentDateTime;

        const minutes = adjustedDateTime.minutes();
        const roundedMinutes = roundToNearest5(minutes);

        // Update the adjustedDateTime with rounded minutes
        adjustedDateTime.minutes(roundedMinutes);
        if (roundedMinutes === 60) {
            adjustedDateTime.hours(adjustedDateTime.hours() + 1);
            adjustedDateTime.minutes(0);
        }
        return adjustedDateTime.format('hh:mm A');
    };

    const handleCreateTimeSlotSecond = (
        startTime: any,
        endTime: any,
        timeToRemove: any,
        duration: any,
    ) => {

        const timeSlots = [];

        const convertTo24HourFormat = (time: any) => {
            let [hour, minutes] = time.split(':');
            minutes = minutes.slice(0, 2);
            const modifier = time.slice(-2);
            hour = parseInt(hour);
            minutes = parseInt(minutes);

            if (modifier === 'PM' && hour !== 12) {
                hour += 12;
            }
            if (modifier === 'AM' && hour === 12) {
                hour = 0;
            }
            return { hour, minutes };
        };

        const convertToMinutes = (hour: any, minutes: any) => hour * 60 + minutes;

        let { hour: startHour, minutes: startMinutes } =
            convertTo24HourFormat(startTime);
        let { hour: endHour, minutes: endMinutes } = convertTo24HourFormat(endTime);

        // Adjust the endHour to include the last slot
        if (endMinutes > 0) {
            endHour += 1;
        }

        let startTotalMinutes = convertToMinutes(startHour, startMinutes);
        let endTotalMinutes = convertToMinutes(endHour, endMinutes);
        endTotalMinutes -= duration; // Subtract to avoid going past the end time

        while (startTotalMinutes < endTotalMinutes) {
            const hours = Math.floor(startTotalMinutes / 60) % 24;
            const ampm = hours >= 12 ? 'PM' : 'AM';
            const formattedHour = hours % 12 === 0 ? 12 : hours % 12;
            const formattedMinutes = startTotalMinutes % 60;
            const formattedTime = `${formattedHour}:${formattedMinutes
                .toString()
                .padStart(2, '0')} ${ampm}`;

            timeSlots.push(formattedTime);

            console.log('loop');

            // Update start time for the next slot
            startTotalMinutes += 10;

            // Check if we go past the end time
            if (startTotalMinutes >= endTotalMinutes) {
                break;
            }
        }

        // Filter out time slots that fall within the removal intervals or cannot accommodate the service duration
        let filteredTimeSlots = [];
        if (timeToRemove) {
            filteredTimeSlots = timeSlots
                .filter(slot => {
                    const slotStartTime = moment(slot, 'h:mm A');
                    const slotEndTime = slotStartTime.clone().add(duration, 'minutes');
                    return !timeToRemove.some((range: any) => {
                        const [removeStartTime, removeEndTime] = range
                            .split(' - ')
                            .map((time: any) => moment(time, 'h:mm A'));
                        // Check if the slot cannot be accommodated within removal intervals
                        return (
                            slotStartTime.isBefore(removeEndTime) &&
                            slotEndTime.isAfter(removeStartTime)
                        );
                    });
                })
                .filter(slot => {
                    const slotStartTime = moment(slot, 'h:mm A');
                    const slotEndTime = slotStartTime.clone().add(duration, 'minutes');
                    // Ensure the slot + duration does not exceed the end time
                    return slotEndTime.isBefore(
                        moment(endTime, 'h:mm A').add(1, 'minute'),
                    );
                });
        } else {
            filteredTimeSlots = timeSlots.filter(slot => {
                const slotStartTime = moment(slot, 'h:mm A');
                const slotEndTime = slotStartTime.clone().add(duration, 'minutes');
                // Ensure the slot + duration does not exceed the end time
                return slotEndTime.isBefore(moment(endTime, 'h:mm A').add(1, 'minute'));
            });
        }

        return filteredTimeSlots;
    };

    const handleDateSelected = async (formattedDate: any, day: any) => {
        const dayObject = getDayObject(day);
        setSelected(null);
        if (dayObject?.available == false) {
            setDatedata(null);
            setSelected(null);
            setSelectedDate(null);
            return Toast('error', 'Barber is not available today kindly choose another day')
        } else {
            setSelectedDate(formattedDate);
            const bookedTimesForSelectedDate = bookedTime
                .filter((booking: any) => booking.date === formattedDate)
                .map((booking: any) => booking.time);
            const [startTime1, endTime] = dayObject.time.split(' - ');
            const startTime = checkAndReturnTime(startTime1, formattedDate);
            const availableTimeSlot = handleCreateTimeSlotSecond(
                startTime,
                endTime,
                bookedTimesForSelectedDate,
                totalDuration,
            );
            console.log("time", startTime, totalDuration);

            console.log("time slot", availableTimeSlot);
            setDatedata(availableTimeSlot);
        }
    }

    const getOneHourLater = (selected: any) => {
        let selectedTime = moment(selected, 'hh:mm A');
        selectedTime = selectedTime.add(totalDuration, 'minutes');
        return selectedTime.format('hh:mm A');
    };

    const deleteOption = (item: any) => {
        setDatedata(null)
        dispatch(deletePendingAppointmentsItem(item))
    }


    return (
        <div className='px-4'>
            <BackButton light title='Book Appoinment' />
            <div className='w-full md:w-[70%] lg:w-[60%] xl:w-[40%] mx-auto mt-10'>
                <div className='flex flex-row items-center justify-between xs:px-[34px] font-semibold mb-1'>
                    <div>Select Date</div>
                    <div>
                        {dates ? getMonthsFromDateArray(dates)?.join('-') : null}
                    </div>
                </div>
                <div className='flex flex-row items-center'>
                    <div className='border-2 border-lineBG shadow-lg px-[6px] py-[4px] mr-1 rounded-md cursor-pointer active:opacity-70 hidden xs:flex' onClick={dateScrollLeft}>
                        <img src={images.arrowBtnBlack} className='w-3 rotate-180' />
                    </div>
                    <div
                        ref={dateScrollRef}
                        className="w-full flex overflow-x-auto hide-scrollbar border-2 border-lineBG rounded-lg shadow-md whitespace-nowrap">
                        {
                            dates &&
                            dates.map((item: any, index: number) => {
                                return (
                                    <div key={index} className=" inline-block w-[40px] md:w-[50px] select-none shrink-0 cursor-pointer"
                                        onClick={() => handleDateSelected(item?.date, item?.day)}
                                    >
                                        <div className='bg-inputGray py-1 text-center text-sm md:text-base'>{item?.day}</div>
                                        <div className={
                                            item?.date === selectedDate ? 'py-3 text-center font-semibold text-sm md:text-lg bg-black text-white' : 'py-3 text-center font-semibold text-sm md:text-lg'
                                        }>{getDayFromDate(item?.date)}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='border-2 border-lineBG shadow-lg px-[6px] py-[4px] ml-1 rounded-md cursor-pointer active:opacity-70 hidden xs:flex' onClick={dateScrollRight}>
                        <img src={images.arrowBtnBlack} className='w-3' />
                    </div>
                </div>
                {
                    dateData?.length > 0 &&
                    <div>
                        <div className='flex flex-row items-center justify-between xs:px-[34px] font-semibold mb-1 mt-6'>
                            <div>Select a time slot</div>
                        </div>
                        <div className='flex flex-row items-center'>
                            <div className='border-2 border-lineBG shadow-lg px-[6px] py-[4px] mr-1 rounded-md cursor-pointer active:opacity-70 hidden xs:flex' onClick={timeScrollLeft}>
                                <img src={images.arrowBtnBlack} className='w-3 rotate-180' />
                            </div>
                            <div
                                ref={timeScrollRef}
                                className="w-full flex gap-2 border-2 border-lineBG rounded-lg shadow-md p-1 overflow-x-auto hide-scrollbar grid grid-rows-2 [grid-auto-flow:column] whitespace-nowrap"
                            >
                                {dateData?.length > 0 &&
                                    dateData.map((item: any, index: number) => {
                                        return (
                                            // <div key={index} className="text-center  ">
                                            <div key={index}
                                                onClick={() => setSelected(item)}
                                                className={
                                                    item === selected ? 'py-1 px-6 text-sm bg-black md:text-base rounded-md font-medium text-center cursor-pointer text-white'
                                                        : 'py-1 px-6 text-sm bg-inputGray md:text-base rounded-md font-medium text-center text-center cursor-pointer'
                                                }>{item}</div>
                                            // </div>
                                        );
                                    })}
                            </div>
                            <div className='border-2 border-lineBG shadow-lg px-[6px] py-[4px] ml-1 rounded-md cursor-pointer active:opacity-70 hidden xs:flex' onClick={timeScrollRight}>
                                <img src={images.arrowBtnBlack} className='w-3' />
                            </div>
                        </div>
                    </div>
                }
                <div className='mt-10'>
                    <div className='text-lg text-semibold font-semibold'>Barber</div>
                    <div className='flex flex-row items-center mt-2'>
                        <img
                            className='w-20 h-20 rounded-xl object-cover'
                            src={barber?.profile ? barber?.profile : barber?.gender === 'male' ? images.male : images.female} />
                        <div className='flex flex-col ml-2'>
                            <div className='text-lg font-semibold leading-5'>{barber?.name}</div>
                            <div className='text-sm leading-4 text-textGray'>{selected && `${selected} - ${getOneHourLater(selected)}`}</div>
                        </div>
                    </div>
                    <div className='mt-2 flex flex-col'>
                        {
                            pendingAppointment &&
                            pendingAppointment?.services?.map((item: any, index: number) => {
                                return (
                                    <div key={index} className='mt-4'>
                                        <div className='font-semibold'>{item?.serviceName}</div>
                                        <div className='flex flex-row items-center justify-between'>
                                            <div className='flex flex-row items-center'>
                                                <div className='bg-black inline-block p-1 rounded-md cursor-pointer' onClick={() => deleteOption(item)}>
                                                    <img src={images.cross} className='w-4 h-4 invert' />
                                                </div>
                                                <div className='ml-2'>
                                                    <div className='leading-5 text-textGray'>{item?.name}</div>
                                                    <div className='leading-3 text-textGray text-xs'>{`(${item?.time} min)`}</div>
                                                </div>
                                            </div>
                                            <div>{`$${(Number(item?.price) || 0).toFixed(2)}`}</div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                        <div className='self-end font-semibold mt-4'>
                            {`Total: $ ${totalAmount?.toFixed(2)}`}
                        </div>
                        <div className='flex flkex-row items-center cursor-pointer hover:underline' onClick={() => navigate(-1)}>
                            <img src={images.addWhite} className='filter brightness-0 mr-1' />
                            Add Another Service</div>
                        <div className='w-[90%] sm:w-[50%] mx-auto my-20'>
                            <Button light={false} disable={pendingAppointment?.services?.length > 0 ? false : true} title='Book' onClick={() => alert('work')} />
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BookAppointment