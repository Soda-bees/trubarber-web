import React, { useEffect, useRef, useState } from 'react'
import BackButton from '../../components/BackButton'
import { useSelector } from 'react-redux'
import { selectPendingAppointment } from '../../Store/PendingAppointment'
import { selectBarbers } from '../../Store/BarbersSlice'
import { selectAuthToken } from '../../Store/AuthTokenSlice'
import { handleGetBookAppointment } from '../../services/config/Api'
import moment from 'moment'
import images from '../../services/config/images'

type Props = {}

const BookAppointment = (props: Props) => {
    const dateScrollRef = useRef<HTMLDivElement | null>(null);

    const pendingAppointment = useSelector(selectPendingAppointment)
    const barbers = useSelector(selectBarbers)
    const authToken = useSelector(selectAuthToken)

    const [barber, setBarber] = useState<any>()
    const [bookedTime, setBookedTime] = useState<any>([])
    const [totalAmount, setTotalAmount] = useState<number>()
    const [dates, setDates] = useState<any>(null)

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
        console.log("toital time-=-=-=-=>", totalTime);

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

    return (
        <div className='px-4'>
            <BackButton light title='Book Appoinment' />
            <div className='w-full mx-auto'>

                <div className='flex flex-row items-center justify-between px-[34px] font-semibold mb-1'>
                    <div>Select Date</div>
                    <div>
                        {dates ? getMonthsFromDateArray(dates)?.join('-') : null}
                    </div>
                </div>
                <div className='flex flex-row items-center'>
                    <div className='border-2 border-lineBG shadow-lg px-[6px] py-[4px] mr-1 rounded-md cursor-pointer active:opacity-70' onClick={dateScrollLeft}>
                        <img src={images.arrowBtnBlack} className='w-3 rotate-180' />
                    </div>
                    <div
                        ref={dateScrollRef}
                        className="w-full flex overflow-x-auto hide-scrollbar border-2 border-lineBG rounded-lg shadow-md whitespace-nowrap"
                        // style={{ whiteSpace: "nowrap" }}
                    >                              {
                            dates &&
                            dates.map((item: any, index: number) => {
                                return (
                                    <div key={index} className=" inline-block w-[60px] select-none shrink-0"
                                        // style={{ flexShrink: 0 }}
                                        >
                                        <div className='bg-inputGray py-1 text-center'>{item?.day}</div>
                                        <div className='py-3 text-center font-semibold text-lg'>{getDayFromDate(item?.date)}</div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className='border-2 border-lineBG shadow-lg px-[6px] py-[4px] ml-1 rounded-md cursor-pointer active:opacity-70' onClick={dateScrollRight}>
                        <img src={images.arrowBtnBlack} className='w-3' />
                    </div>
                </div>
            </div>

        </div>
    )
}

export default BookAppointment