import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom';
import images from '../../services/config/images';
import SmallButton from '../../components/SmallButton';
import { getAddressFromCoordinates } from '../../services/config/Api';
import StarRatings from 'react-star-ratings';
import Map from '../../components/Map';
import BarberSection from '../../components/BarberSection';
const moment = require('moment');

type Props = {}

const BarberDetails = (props: Props) => {

    const { showSidebar } = useOutletContext<{ showSidebar: boolean }>();

    const location = useLocation();
    const item = location.state?.item;
    const descriptionRef = useRef<HTMLParagraphElement | null>(null);
    const locationRef = useRef<HTMLParagraphElement | null>(null);

    const [addressLodaer, setAddressLodaer] = useState<boolean>(false)
    const [address, setAddress] = useState<string>('')
    const [isShowDescription, setIsShowDescription] = useState<boolean>(false)
    const [isOverflowingDescription, setIsOverflowingDescription] = useState<boolean>(false);
    const [isShowLocation, setIsShowLocation] = useState<boolean>(false)
    const [isOverflowingLocation, setIsOverflowingLocation] = useState<boolean>(false)
    const [showSliderBtn, setShowSliderBtn] = useState<boolean>(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [reviewsPerPage, setReviewsPerPage] = useState(1)
    const [showServiceDetailsModal, setShowServiceDetailsModal] = useState<boolean>(false)
    const [selectedService, setSelectedService] = useState<any>(null)
    const [styleMenu, setStyleMenu] = useState<[]>([])
    const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(20)

    useEffect(() => {
        if (item) {
            handleGetBarberAddress()
        }
    }, [location?.state])

    useEffect(() => {
        if (descriptionRef.current) {
            setIsOverflowingDescription(descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight);
        }
    }, [item?.description]);

    useEffect(() => {
        if (locationRef.current) {
            setIsOverflowingLocation(locationRef.current.scrollHeight > locationRef.current.clientHeight);
        }
    }, [address]);

    useEffect(() => {
        updateScrollButtonState();
    }, [currentIndex, reviewsPerPage]);

    useEffect(() => {
        const handleResize = () => {
            const breakpoints = [
                { width: 1280, visibleImages: showSidebar ? 4 : 5 },
                { width: 1024, visibleImages: showSidebar ? 3 : 4 },
                { width: 768, visibleImages: showSidebar ? 2 : 3 },
                { width: 500, visibleImages: 2 },
                { width: 544, visibleImages: 1 },
            ];

            const { visibleImages: newVisibleImages } =
                breakpoints.find(
                    (breakpoint) => window.innerWidth >= breakpoint.width
                ) || breakpoints[breakpoints.length - 1];

            setReviewsPerPage(newVisibleImages);
        };

        handleResize();

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [showSidebar]);


    const handleGetBarberAddress = async () => {
        try {
            setAddressLodaer(true)
            const fetchedAddress = await getAddressFromCoordinates(item?.location?.latitude, item?.location?.longitude);
            if (fetchedAddress) {
                setAddress(fetchedAddress)
                setAddressLodaer(false)
            } else {
                setAddressLodaer(false)
            }
        } catch (error) {
            console.log(error);
            setAddressLodaer(false)
        }
    }

    const scrollRight = () => {
        if (currentIndex + reviewsPerPage < item?.reviews.length) {
            setCurrentIndex(currentIndex + reviewsPerPage);
        }
    };

    const scrollLeft = () => {
        if (currentIndex - reviewsPerPage >= 0) {
            setCurrentIndex(currentIndex - reviewsPerPage);
        }
    };

    const updateScrollButtonState = () => {
        if (item?.reviews?.length > reviewsPerPage) {
            setShowSliderBtn(true)
        } else {
            setShowSliderBtn(false)
        }
    };

    const formatDate = async (createdAt: any) => {
        const date = moment(createdAt).format('DD MMMM YYYY');
        return date
    }

    const calculateAverageRating = (reviews: any) => {
        if (reviews && reviews.length > 0) {
            const totalRating = reviews.reduce(
                (sum: any, review: any) => sum + parseFloat(review.rating),
                0,
            );
            return totalRating / reviews.length;
        } else {
            return 0;
        }
    };

    const handleSelectStyle = (index: number, price: any) => {
        const parsedPrice = parseFloat(price);
        console.log(parsedPrice);
        
        setSelectedStyleIndex(prevIndex => {
            if (prevIndex === index) {  
                setTotalPrice(prevPrice => prevPrice - parsedPrice)         
                // setTotalPrice(0)     
                return null 
            } else {
                // setTotalPrice(parsedPrice)
                setTotalPrice(prevPrice => prevPrice - prevPrice)
                setTotalPrice(prevPrice => prevPrice + parsedPrice)
                return index
            }
        })
    }


    return (
        <div className='px-4 mt-10'>
            <div className='max-w-7xl mx-auto'>
                <div className='w-full flex flex-row items-start justify-between'>
                    <div className={`flex flex-col items-start mx-auto w-full ${showSidebar ? 'lg:flex-row' : 'md:flex-row'}`}>
                        <div className={`relative w-full ${showSidebar ? 'lg:w-[270px]' : 'md:w-[270px]'}`}>
                            <img src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female} className={`w-full h-[400px] xs:h-[450px] sm:h-[500px] rounded-lg ${showSidebar ? 'lg:h-[350px]' : 'md:h-[350px]'}`} />
                            <div className='absolute left-2 bottom-2 text-black bg-white flex flex-row px-3 py-1 items-center justify-center rounded-lg cursor-pointer active:opacity-70'>
                                <img src={images.bookmarkBlack} className='w-4 h-4 mt-1 mr-1 object-contain' />
                                save
                            </div>
                        </div>
                        <div className={`mt-4 h-full w-full ${showSidebar ? 'lg:w-[65%] lg:ml-4' : 'md:w-[65%] md:ml-4'}`}>
                            <div className='text-lg font-bold'>{item?.name}</div>
                            <div className='text-sm mt-2 flex flex-col items-start'>
                                <div className="flex flex-row items-start pr-2">
                                    {addressLodaer ? (
                                        <div
                                            className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                                            role="status"
                                        ></div>
                                    ) : (
                                        <img
                                            src={images.Location}
                                            className="w-3 mr-1 mt-[2px]"
                                            alt="Location"
                                        />
                                    )}

                                    <div className="flex items-end w-full text-hoverGray">
                                        <div
                                            ref={locationRef}
                                            className={`flex-1 ${isShowLocation ? 'line-clamp-none' : 'line-clamp-1'}`}
                                        >
                                            {address || (addressLodaer && 'Loading...')}
                                        </div>
                                        {isOverflowingLocation && (
                                            <div
                                                className="cursor-pointer text-sm ml-[3px] text-blue-500"
                                                onClick={() => setIsShowLocation(!isShowLocation)}
                                            >
                                                {isShowLocation ? 'Show Less' : 'Show More'}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className={` w-full mt-4 h-[200px] ${showSidebar ? 'xl:hidden' : 'lg:hidden lg:w-[55%]'}`}>   <Map /></div>
                            </div>
                            <div className='flex flex-row items-center gap-2 mt-4 lg:mt-8'>
                                <SmallButton dark={false} title='Direction' image={images.direction} />
                                <SmallButton dark={false} title='Message' image={images.message} />
                            </div>
                            <div className='mt-4 font-semibold'>About</div>
                            <div className="w-full mt-2 text-hoverGray flex items-end">
                                <div
                                    ref={descriptionRef}
                                    className={`flex-1 ${isShowDescription ? 'line-clamp-none' : 'line-clamp-1'}`}
                                >
                                    {item?.description}
                                </div>
                                {isOverflowingDescription && (
                                    <div
                                        className="cursor-pointer text-sm ml-[3px] text-blue-500"
                                        onClick={() => setIsShowDescription(!isShowDescription)}
                                    >
                                        {isShowDescription ? 'Show Less' : 'Show More'}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={`w-[55%] hidden h-[350px] ${showSidebar ? 'xl:flex' : 'lg:flex'}`}>
                        <Map />
                    </div>
                </div>
                <div className='mt-10'>
                    <div className='mt-4 font-semibold'>Services</div>
                    <div className={`grid grid-cols-1 gap-4 mt-4 ${showSidebar ? 'lg:grid-cols-2' : 'sm:grid-cols-2'}`}>
                        {item?.services?.map((item: any, index: number) => {
                            return (
                                <div key={index}
                                    className='border border-hoverGray rounded-lg p-2 flex flex-row items-start justify-between'
                                // onClick={() => setShowServiceDetailsModal(true)}
                                >
                                    <div className='flex flex-row items-start'>
                                        <div className='bg-inputGray w-20 h-20 flex items-center justify-center rounded-xl'>
                                            <img src={item?.icon} className='w-10 h-10' />
                                        </div>
                                        <div className='ml-2 mt-1'>
                                            <div className='text-lg font-bold'>{item?.name}</div>
                                            <div className='text-hoverGray text-sm'>{item?.description}</div>
                                        </div>
                                    </div>
                                    <div className='bg-black px-5 py-1 rounded-xl text-white active:opacity-70 cursor-pointer'
                                        onClick={() => {
                                            setStyleMenu(item?.options)
                                            setSelectedService(item)
                                            setShowServiceDetailsModal(true)
                                        }}
                                    >
                                        Book
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className='mt-10'>
                    <div className='mt-4 font-semibold'>Reviews</div>
                    <div className='flex flex-col xs:flex-row items-start justify-between bg-appGray rounded-lg p-2'>
                        <div className='flex flex-row xs:flex-col items-center xs:items-start justify-between w-full xs:w-[150px]'>
                            <div className='flex flex-row items-center'>
                                <span className='font-semibold text-sm mr-2'>
                                    {calculateAverageRating(item?.reviews)}
                                </span>
                                <div className='mb-2'>
                                    <StarRatings
                                        rating={calculateAverageRating(item?.reviews)}
                                        starRatedColor="gold"
                                        numberOfStars={5}
                                        starDimension="20px"
                                        starSpacing="2px"
                                    />
                                </div>
                            </div>
                            <div className='font-semibold text-hoverGray'>
                                {
                                    item?.reviews?.length > 0 &&
                                    <div>{item?.reviews?.length} Reviers</div>
                                }
                            </div>
                        </div>
                        <div className='flex flex-row items-center justify-between xs:justify-end w-full xs:w-[210px] mt-4 xs:mt-0'>
                            <SmallButton dark title='Write a Review' />
                            {
                                showSliderBtn &&
                                <div className='flex flex-row items-center gap-8 ml-4'>
                                    <img src={images.greyArrow} className='w-4 h-6 cursor-pointer' onClick={scrollLeft} />
                                    <img src={images.greyArrow} className='rotate-180 w-4 h-6 cursor-pointer' onClick={scrollRight} />
                                </div>
                            }
                        </div>
                    </div>
                    <div
                        className={`gap-4 mt-4 w-full grid grid-cols-1 xs:grid-cols-2  ${showSidebar ? 'md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'}`}
                    >
                        {item?.reviews
                            .slice(currentIndex, currentIndex + reviewsPerPage)
                            .map((review: any, index: number) => (
                                <div
                                    key={index}
                                    className="border border-gray-300 rounded-2xl p-5 flex flex-col justify-between"
                                >
                                    <div className="flex flex-row items-start">
                                        <img
                                            src={review?.userData?.profile ? review?.userData?.profile : review?.userData?.gender === 'male' ? images.male : images.female}
                                            className="w-16 h-16 object-cover rounded-full mr-4"
                                        />
                                        <div>
                                            <div className="text-lg font-semibold">{review?.userData?.name}</div>
                                            <div>{moment(item?.createdAt).format('DD MMMM YYYY')}</div>
                                            <div className="flex items-center mt-1">

                                            </div>
                                        </div>
                                    </div>
                                    <div className='flex flex-row'>
                                        <StarRatings
                                            rating={isNaN(parseFloat(review?.rating)) ? 0 : parseFloat(review?.rating)}
                                            starRatedColor="gold"
                                            numberOfStars={5}
                                            starDimension="20px"
                                            starSpacing="2px"
                                        />
                                    </div>

                                    <div className="mt-4 text-gray-700 line-clamp-3">
                                        {review?.comment}
                                    </div>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
            <BarberSection title='Recommended Barber' />
            {
                showServiceDetailsModal &&
                <div
                    onClick={() => setShowServiceDetailsModal(false)}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg p-6 w-[90%] sm:w-[70%] md:w-[70%] lg:w-[50%] xl:w-[35%] xl:w-[25%] max-h-[80vh] overflow-y-scroll hide-scrollbar md:w-[25%] relative">
                        <div className='flex flex-row items-start justify-between'>
                            <div className='flex flex-row items-center'>
                                <div className='bg-inputGray sm:w-20 w-16 h-16 sm:h-20 flex items-center justify-center rounded-xl'>
                                    <img src={selectedService?.icon} className='sm:w-10 sm:h-10 w-8 h-8' />
                                </div>
                                <div className='text-lg font-semibold ml-4'>{selectedService?.name}</div>
                            </div>
                            <div className='bg-black p-2 cursor-pointer rounded-lg active:opacity-70' onClick={() => setShowServiceDetailsModal(false)}>
                                <img src={images.cross} className='filter invert brightness-0 sm:w-5 sm:h-5 w-3 h-3' />
                            </div>
                        </div>
                        <div className='mt-4 text-sm text-textGray pr-2'>{selectedService?.description}</div>
                        <div className='text-black font-semibold mt-4'>{`Select ${selectedService?.name} style`}</div>
                        <div className='grid grid-cols-1 xs:grid-cols-2 gap-2 mt-2'>
                            {styleMenu?.map((item: any, index: number) => {
                                return (
                                    <div key={index} className={
                                        selectedStyleIndex === index ?
                                            'bg-black px-3 text-white py-1 rounded-lg flex flex-row items-center justify-between cursor-pointer' :
                                            'bg-appGray px-3 py-1 rounded-lg flex flex-row items-center justify-between cursor-pointer'
                                    } onClick={() => handleSelectStyle(index, item?.price)}>
                                        <div className='flex flex-col'>
                                            <div className='font-medium leading-5'>
                                                {item?.name}
                                            </div>
                                            <div className={
                                                selectedStyleIndex === index ?
                                                    'text-xs text-white font-medium' :
                                                    'text-xs text-textGray font-medium'
                                            }>
                                                {`(${item?.time} min)`}
                                            </div>
                                        </div>
                                        <div className='font-medium'>{`$${parseFloat(item?.price)?.toFixed(2)}`}</div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className='text-black font-semibold mt-4'>Images</div>
                        <div className='flex flex-row overflow-x-auto whitespace-nowrap gap-2 mt-2 hide-scrollbar'>
                            {selectedService?.pictures?.map((picture: any, index: number) => {
                                return (
                                    <div key={index} className='w-[180px] flex-shrink-0'>
                                        <img src={picture} className='w-full h-[170px] object-cover rounded-lg' />
                                    </div>
                                )
                            })}
                        </div>
                        <div className='flex flx-row items-center justify-between mt-4'>
                            <div>
                                <div className='text-textGray text-sm font-semibold'>Total Amount</div>
                                <div className='font-semibold text-lg'>{`$${totalPrice?.toFixed(2)}`}</div>
                            </div>
                            <div className='w-[2px] self-stretch bg-appGray'></div>
                            <SmallButton dark title='Book Appointment' onClick={() => alert('hello')} disable/>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default BarberDetails