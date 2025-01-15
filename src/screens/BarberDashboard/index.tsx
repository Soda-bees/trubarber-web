import React, { useEffect, useState } from 'react'
import images from '../../services/config/images'
import { useSelector } from 'react-redux'
import { selectUser } from '../../Store/userDataSlice'
import useNavigate from '../../components/ScrollToTopNavigate'
import moment from 'moment'
import StarRatings from 'react-star-ratings'
import ProgressBar from "@ramonak/react-progress-bar";
import { useOutletContext } from 'react-router-dom'

type Props = {}

const BarberDashboard = (props: Props) => {

  const { search, headerFooterHeight, headerHeight } =
    useOutletContext<{ search: string, headerFooterHeight: number, headerHeight: number }>()

  const userData = useSelector(selectUser)
  const navigate = useNavigate()

  const [pendingAppointments, setPendingAppointments] = useState<number>(0)
  const [scheduledAppointments, setScheduledAppointments] = useState<number>(0)
  const [barberReview, setBarberReview] = useState<any[]>([])
  const [totalRating, setTotalRating] = useState<Array<{ star: string }>>([
    { star: '5' },
    { star: '4' },
    { star: '3' },
    { star: '2' },
    { star: '1' },
  ]);

  useEffect(() => {
    if (userData?.appoinment) {
      filterAndSetAppointments(userData?.appoinment);
    }
    if (userData?.reviews) {
      const sortedReviews = [...userData.reviews].sort((a, b) =>
        moment(b.createdAt).diff(moment(a.createdAt)),
      );
      setBarberReview(sortedReviews);
    }
  }, [userData])

  const filterAndSetAppointments = (appointments: any) => {
    const completedAppointments = appointments.filter(
      (appointment: any) => appointment?.status.toLowerCase() === 'scheduled',
    );
    const pendingAppointments = appointments.filter(
      (appointment: any) => appointment?.status.toLowerCase() === 'pending',
    );

    setScheduledAppointments(completedAppointments.length);
    setPendingAppointments(pendingAppointments.length);
  };

  const calculateTotalAmount = (services: any) => {
    return services.reduce(
      (total: any, service: any) => total + parseFloat(service.price),
      0,
    );
  };

  const formatDateShort = (dateString: string): string => {
    if (!dateString) return '';

    const parts = dateString.split('-');
    if (parts.length !== 3) return '';

    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);

    const dateObj = new Date(year, month, day);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };

    return dateObj.toLocaleDateString('en-US', options);
  };

  const getStartTime = (timeRange: string): string => {
    return timeRange.split(' - ')[0];
  };

  const calculateAverageRating = (reviews: any) => {
    if (reviews && reviews.length > 0) {
      const totalRating = reviews.reduce(
        (sum: any, review: any) => sum + parseFloat(review.rating),
        0,
      );
      const averageRating = totalRating / reviews.length;
      return parseFloat(averageRating.toFixed(1));
    } else {
      return 0;
    }
  };

  const calculateStarPercentage = (barberReviews: any, numberOfStars: any) => {
    if (!barberReviews || barberReviews.length === 0) {
      return 0;
    }

    const totalReviews = barberReviews.length;
    const matchingReviews = barberReviews.filter(
      (review: any) => Number(review.rating) == numberOfStars,
    ).length;

    const percentage = (matchingReviews / totalReviews) * 100;
    return percentage.toFixed(1);
  };

  const formatCreatedAt = (date: any) => moment(date).format("DD / MMM / YYYY");

  const availableHeightInVH = 100 - headerHeight || 100

  return (
    <div className='h-full flex flex-col xl:flex-row px-4 gap-2'
      style={window.innerWidth >= 1280 ? {
        minHeight: `${availableHeightInVH}vh`,
        maxHeight: `${availableHeightInVH}vh`,
      } : {}}
    >
      <div className='xl:w-[55%]'>
        <div className='text-lg font-semibold'>Dashboard</div>
        <div className='grid grid-cols-1 xs:grid-cols-2 gap-2 mt-2'>
          <div className='bg-inputGray flex flex-row items-start justify-between p-3 rounded-lg'>
            <img src={images.appointment} className='w-6 filter invert dark-0' />
            <div>
              <div className='text-end text-lg font-semibold'>{pendingAppointments}</div>
              <div className='text-end'>Pending Appointments</div>
            </div>
          </div>
          <div className='bg-inputGray flex flex-row items-start justify-between p-3 rounded-lg'>
            <img src={images.appointment} className='w-6 filter invert dark-0' />
            <div>
              <div className='text-end text-lg font-semibold'>{scheduledAppointments}</div>
              <div className='text-end'>Scheduled Appointments</div>
            </div>
          </div>
        </div>
        <div className='mt-6 flex flex-row items-center justify-between'>
          <div className='text-lg font-semibold'>Appointments</div>
          <div className='border border-black py-1 px-3 rounded-2xl flex flex-row items-center cursor-pointer active:opacity-40' onClick={() => navigate('/appointment')} >
            View all
            <img src={images.arrowBtnBlack} className='ml-2 w-3 h-5' />
          </div>
        </div>
        {
          userData?.appoinment?.length > 0 &&
          <div className='grid sm:grid-cols-5 grid-cols-4 gap-2 border border-inputGray p-2 rounded-lg mt-2 text-sm sm:text-base font-semibold'>
            <div className='sm:col-span-2'>Service</div>
            <div className=''>Price</div>
            <div className='text-center'>Date Time</div>
            <div className='text-center'>Status</div>
          </div>
        }
        {
          userData?.appoinment?.length > 0 ? (
            userData?.appoinment?.slice(0, 4)?.map((item: any, index: number) => {
              return (
                <div className='grid sm:grid-cols-5 grid-cols-4 gap-2 border border-inputGray p-2 rounded-lg mt-2 text-sm sm:text-base' key={index}>
                  <div className='sm:col-span-2'>{item?.services[0]?.serviceName}</div>
                  <div className=''> $ {calculateTotalAmount(item?.services)}</div>
                  <div className='text-center'>
                    <div className=''>{formatDateShort(item?.date)}</div>
                    <div className='text-sm'>{getStartTime(item?.time)}</div>
                  </div>
                  <div className='text-center text-red-700'> {item?.status}</div>
                </div>
              )
            })
          ) : (
            <div className='text-center mt-2 font-semibold'>You have no scheduled appointments at this moment.</div>
          )
        }
      </div>

      <div className='xl:w-[45%] h-full overflow-y-auto hide-scrollbar'>
        <div className='flex flex-row items-center justify-between'>
          <div className='text-lg font-semibold'>Reviews</div>
        </div>
        {
          barberReview?.length > 0 ? (
            <div>
              <div className='flex flex-col xs:flex-row items-center justify-center gap-2 xs:gap-10 border py-4 rounded-xl'>
                <div className='flex flex-col items-center'>
                  <div className='text-2xl font-semibold'>{calculateAverageRating(barberReview)}</div>
                  <div className='mb-2'>
                    <StarRatings
                      rating={calculateAverageRating(barberReview)}
                      starRatedColor="#ffd700"
                      numberOfStars={5}
                      starDimension="20px"
                      starSpacing="2px"
                    />
                  </div>
                  <div>{barberReview?.length} Reviews</div>
                </div>
                <div className=''>
                  {
                    totalRating?.map((item, index) => {
                      return (
                        <div className='flex flex-row items-center gap-3 text-[#ffd700] text-sm' key={index}>
                          <div className=''>{item?.star}</div>
                          <img src={images.starLight} className='w-4' />
                          <ProgressBar completed={calculateStarPercentage(barberReview, item?.star)} width='150px' height='5px' bgColor='#ffd700' isLabelVisible={false} />
                          <div>{calculateStarPercentage(barberReview, item?.star)} %</div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
              <div className='gap-2'>
                {
                  barberReview?.map((item: any, index: number) => {
                    return (
                      <div key={index} className='border'>
                        <div className='flex flex-row items-center justify-between'>
                          <div className='flex flex-row items-center '>
                            <img
                              className='w-8 h-8 rounded-full '
                              src={item?.userData?.profile ? item?.userData?.profile : item?.userData?.gender === "male" ? images.male : images.female} />
                            <div>
                              <div>{item?.userData?.name}</div>
                              <div>{formatCreatedAt(item?.createdAt)}</div>
                            </div>
                          </div>
                          <StarRatings
                            rating={parseFloat(item.rating)}
                            starRatedColor="gold"
                            numberOfStars={5}
                            starDimension="20px"
                            starSpacing="2px"
                          />
                        </div>
                        <div>{item?.comment}</div>
                      </div>
                    )
                  })
                }
              </div>
            </div>
          ) : (
            <div className='text-center mt-4 font-semibold'>No reviews have been provided yet.</div>
          )
        }
      </div>



    </div>
  )
}

export default BarberDashboard