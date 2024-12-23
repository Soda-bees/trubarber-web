import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useOutletContext } from 'react-router-dom';
import images from '../../services/config/images';
import SmallButton from '../../components/SmallButton';
import { addFavorite, createChatRoom, deleteReviewApi, getAddressFromCoordinates, postReview, updateReviewApi } from '../../services/config/Api';
import StarRatings from 'react-star-ratings';
import Map from '../../components/Map';
import BarberSection from '../../components/BarberSection';
import { useDispatch, useSelector } from 'react-redux';
import { removePendingAppointment, selectPendingAppointment, setPendingAppointment, updatePendingAppointment } from '../../Store/PendingAppointment';
import { Toast } from '../../components/Toast';
import { addFavouritesRedux, selectUser } from '../../Store/userDataSlice';
import { selectAuthToken } from '../../Store/AuthTokenSlice';
import useNavigate from '../../components/ScrollToTopNavigate';
import Button from '../../components/Button';
import { selectBarbers } from '../../Store/BarbersSlice';
const moment = require('moment');

type Props = {}

const BarberDetails = (props: Props) => {

    const { showSidebar } = useOutletContext<{ showSidebar: boolean }>();
    const pendingAppointment = useSelector(selectPendingAppointment)
    const userData = useSelector(selectUser)
    const authToken = useSelector(selectAuthToken)
    const barbers = useSelector(selectBarbers)

    const dispatch = useDispatch()

    const location = useLocation();
    // const item = location.state?.item;
    const descriptionRef = useRef<HTMLParagraphElement | null>(null);
    const locationRef = useRef<HTMLParagraphElement | null>(null);
    const navigate = useNavigate()

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
    const [styleMenu, setStyleMenu] = useState<any>([])
    const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null);
    const [totalPrice, setTotalPrice] = useState<number>(0)
    const [isNotSameBarberModal, setIsNotSameBarberModal] = useState<boolean>(false)
    const [chatRoomId, setChatRoomId] = useState<string | null>(null);
    const [isReviewPosted, setIsReviewPosted] = useState<boolean>(false)
    const [showWriteReviewModal, setShowWriteReviewModal] = useState<boolean>(false)
    const [rating, setRating] = useState<number>(0);
    const [reviewComment, setReviewComment] = useState<string>('')
    const [reviewDeleteLoader, setReviewDeleteLoader] = useState<boolean>(false)
    const [reviewPostLoader, setReviewPostLoader] = useState<boolean>(false)
    const [item, setItem] = useState<any>(location.state?.item)
    const [isFavorite, setIsFavorite] = useState(false)
    const [favoriteLoader, setFavoriteLoader] = useState(false)

    useEffect(() => {
        if (showServiceDetailsModal || showWriteReviewModal) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }

        return () => {
            document.body.style.overflow = "auto";
        };
    }, [showServiceDetailsModal, showWriteReviewModal]);

    useEffect(() => {
        setRating(0)
        setReviewComment('')
        if (item) {
            const path = location?.pathname
            const _id = path.substring(path.lastIndexOf('/') + 1);
            const matchedItem = barbers?.find((barber) => barber._id === _id);
            setItem(location.state?.item || matchedItem)
            handleGetBarberAddress()
            setReviewPost(location.state?.item?.reviews || matchedItem?.reviews)
            findChat()
        } else {
            const path = location?.pathname
            const _id = path.substring(path.lastIndexOf('/') + 1);
            const matchedItem = barbers?.find((barber) => barber._id === _id);
            if (matchedItem) {
                setItem(matchedItem);
                handleGetBarberAddress()
                setReviewPost(matchedItem.reviews)
                findChat()
            }
        }
    }, [location?.state, authToken])

    useEffect(() => {
        const path = location?.pathname
        const _id = path.substring(path.lastIndexOf('/') + 1);
        const matchedItem = barbers?.find((barber) => barber._id === _id);
        handleCheckIsFavorite(matchedItem?._id)
    }, [userData])

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

    const handleCheckIsFavorite = async (barberId: any) => {
        const isFavorite = userData?.favourites?.some(
            (fav: any) => fav._id === barberId)
        if (isFavorite) {
            setIsFavorite(true)
        } else {
            setIsFavorite(false)
        }
    }

    const setReviewPost = async (reviews: any) => {
        const userId = userData?._id
        const reviewsCopy = [...reviews];

        const index = reviewsCopy.findIndex((review) => review.userData?._id === userId);
        if (index > 0) {
            const [matchingReview] = reviewsCopy.splice(index, 1);

            reviewsCopy.unshift(matchingReview);
        }

        setItem((prevItem: any) => ({
            ...prevItem,
            reviews: reviewsCopy,
        }));

        const userReviewExist = reviews?.some((review: any) => review?.userData?._id === userId)
        if (userReviewExist) {
            setIsReviewPosted(true)
        } else {
            setIsReviewPosted(false)
        }

    }

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
            const averageRating = totalRating / reviews.length;
            return parseFloat(averageRating.toFixed(1)); // Round to one decimal place
        } else {
            return 0;
        }
    };
    const handleSelectStyle = (index: number, price: any) => {
        const parsedPrice = parseFloat(price);
        if (selectedStyleIndex === index) {
            setSelectedStyleIndex(null)
            setTotalPrice((prevPrice) => prevPrice - parsedPrice)
        } else {
            setTotalPrice((prevPrice) => prevPrice - prevPrice + parsedPrice)
            setSelectedStyleIndex(index)
        }
    }

    const bookAppointment = () => {
        if (pendingAppointment) {
            if (pendingAppointment?.barber !== selectedService?.barber) {
                setIsNotSameBarberModal(true)
            } else {
                const serviceNameExist = pendingAppointment?.services.some(
                    (service: any) => service.serviceName === selectedService?.name
                )
                if (serviceNameExist) {
                    let matchedIndex = selectedStyleIndex !== null && { ...styleMenu[selectedStyleIndex] };
                    matchedIndex.serviceName = selectedService?.name
                    matchedIndex.serviceIcon = selectedService?.icon
                    const services = [matchedIndex];
                    const obj = {
                        barber: selectedService?.barber,
                        services,
                        status: 'Pending',
                    }
                    dispatch(updatePendingAppointment(obj))
                    navigate('/book-appointment')
                } else {
                    const oldPendingAppointment = pendingAppointment
                    let matchedIndex = selectedStyleIndex !== null && { ...styleMenu[selectedStyleIndex] };
                    matchedIndex.serviceName = selectedService?.name
                    matchedIndex.serviceIcon = selectedService?.icon
                    const services = [matchedIndex];
                    const newPendingAppointment = {
                        ...oldPendingAppointment,
                        services: [...oldPendingAppointment?.services, ...services]
                    }
                    dispatch(setPendingAppointment(newPendingAppointment))
                    navigate('/book-appointment')
                }
            }
        } else {
            let matchedIndex = selectedStyleIndex !== null && { ...styleMenu[selectedStyleIndex] };
            matchedIndex.serviceName = selectedService?.name
            matchedIndex.serviceIcon = selectedService?.icon
            const services = [matchedIndex];
            const obj = {
                barber: selectedService?.barber,
                services,
                status: 'Pending',
            }
            dispatch(setPendingAppointment(obj))
            navigate('/book-appointment')
        }

    }

    const handleAddNewBarber = () => {
        dispatch(removePendingAppointment())
        if (selectedStyleIndex !== null) {
            const matchedIndex = { ...styleMenu[selectedStyleIndex] };
            matchedIndex.serviceName = selectedService?.name
            matchedIndex.serviceIcon = selectedService?.icon
            const services = [matchedIndex];
            const obj = {
                barber: selectedService?.barber,
                services,
                status: 'Pending',
            }
            dispatch(setPendingAppointment(obj))
            setIsNotSameBarberModal(false)
            navigate('/book-appointment')
        }
    }

    const handleClickedServicesBook = (item: any) => {
        setSelectedStyleIndex(null)
        if (pendingAppointment?.barber === item?.barber) {
            const metchedService = pendingAppointment?.services.find(
                (service: any) => service?.serviceName === item?.name
            )
            if (metchedService) {
                const index = item?.options?.findIndex(
                    (option: any) => option.name === metchedService?.name &&
                        option?.price === metchedService?.price
                )
                if (index !== -1) {
                    setSelectedStyleIndex(index)
                }
            }
        }
        setStyleMenu(item?.options)
        setSelectedService(item)
        setShowServiceDetailsModal(true)
    }

    const findChat = async () => {
        try {
            const isChat = await findChatInRedux();
            if (!isChat) {
                const path = location?.pathname
                const id = path.substring(path.lastIndexOf('/') + 1);
                const body = {
                    user: userData?._id,
                    barber: item?._id || id,
                }
                const response = await createChatRoom(authToken, body) as { status: number; data?: any; message?: string }
                if (response?.status === 201) {
                    setChatRoomId(response?.data?.newChat?._id)
                } else {
                    setChatRoomId(null)
                }
            }
        } catch (error) {
            console.log("chat error", error);

        }
    }

    const findChatInRedux = async () => {
        const name = item?._id + userData?._id
        const name2 = userData?._id + item?._id
        const chat = await userData?.chat?.find(
            (chat: any) => chat?.name === name || chat?.name === name2
        )
        if (chat) {
            setChatRoomId(chat?._id)
            return true
        } else {
            setChatRoomId(null)
            return false
        }
    }

    const handleNavigateToChat = () => {
        if (authToken) {
            if (chatRoomId) {
                navigate('/chat')
            } else {
                Toast('error', 'Something wents wrong, try again')
            }
        } else {
            sessionStorage.setItem('redirectAfterLogin', location?.pathname)
            navigate('/signin')
        }

    }

    const handleRatingChange = (newRating: number) => {
        setRating(newRating);
    };

    const handleOpenReviewModal = () => {
        if (authToken) {
            if (isReviewPosted) {
                const userReviewExist = item?.reviews?.find((review: any) => review?.userData?._id === userData?._id)
                setRating(Number(userReviewExist?.rating));
                setReviewComment(userReviewExist?.comment)
                setShowWriteReviewModal(true)
            } else {
                setShowWriteReviewModal(true)
            }
        } else {
            sessionStorage.setItem('redirectAfterLogin', location?.pathname)
            navigate('/signin')
        }
    }

    const handlePostReview = async () => {
        try {
            if (!rating) {
                return Toast('error', 'Please provide rating to post your review')
            }
            if (!reviewComment) {
                return Toast('error', 'Please provide comments to post your review')
            }
            const body = {
                barberData: item?._id,
                comment: reviewComment,
                rating,
            }
            setReviewPostLoader(true)
            const response = await postReview(authToken, body)
            if (response?.success) {
                const newReview = response?.review
                setItem((prevItem: any) => {
                    const updatedReviews = [...prevItem.reviews, newReview];

                    const updatedItem = {
                        ...prevItem,
                        reviews: updatedReviews,
                    };

                    navigate(".", {
                        replace: true,
                        state: { ...location.state, item: updatedItem },
                    });

                    return updatedItem;
                });
                setIsReviewPosted(true)
                setReviewPostLoader(false)
                setShowWriteReviewModal(false)
                Toast('success', 'Review Posted!')
            } else {
                setReviewPostLoader(false)
                Toast('error', response?.message)
            }
        } catch (error) {
            console.log(error);
            setReviewPostLoader(false)
        }
    }

    const handleUpdateReview = async () => {
        try {
            if (!reviewComment || !rating) {
                Toast('error', 'Please provide rating and some comments to update your review')
            }
            setReviewPostLoader(true)
            const userReviewExist = item?.reviews?.find((review: any) => review?.userData?._id === userData?._id)
            const body = {
                reviewId: userReviewExist?._id,
                comment: reviewComment,
                rating,
            }
            const response = await updateReviewApi(authToken, body)
            if (response?.success) {
                const updatedReview = response?.review
                setItem((prevItem: any) => {
                    const updatedReviews = prevItem?.reviews?.map((review: any) =>
                        review._id === updatedReview._id ? updatedReview : review
                    );

                    const updatedItem = {
                        ...prevItem,
                        reviews: updatedReviews,
                    };

                    navigate(".", {
                        replace: true,
                        state: { ...location.state, item: updatedItem },
                    });

                    return updatedItem;
                });
                setReviewPostLoader(false)
                setShowWriteReviewModal(false)
                Toast('success', 'Review Updated!')
            } else {
                Toast('error', response?.message)
                console.log(response?.message);
                setReviewPostLoader(false)
            }
        } catch (error) {
            console.log(error);
            setReviewPostLoader(false)
        }
    }

    const handleDeleteReview = async () => {
        try {
            setReviewDeleteLoader(true)
            const userReviewExist = item?.reviews?.find((review: any) => review?.userData?._id === userData?._id)
            const reviewId = userReviewExist?._id
            const response = await deleteReviewApi(authToken, reviewId)
            console.log("delete resp===>", response);
            if (response?.success) {
                setItem((prevItem: any) => {
                    const updatedReviews = prevItem.reviews.filter((review: any) => review._id !== reviewId);

                    const updatedItem = {
                        ...prevItem,
                        reviews: updatedReviews,
                    };

                    navigate(".", {
                        replace: true,
                        state: { ...location.state, item: updatedItem },
                    });

                    return updatedItem;
                });
                setReviewDeleteLoader(false)
                setShowWriteReviewModal(false)
                Toast('success', 'Review Deleted!')
            } else {
                Toast('error', response?.message)
                setReviewDeleteLoader(false)
            }
        } catch (error) {
            console.log(error);
            setReviewDeleteLoader(false)

        }

    }

    const handleAddFavorite = async () => {
        try {
            if (!authToken) {
                sessionStorage.setItem('redirectAfterLogin', location?.pathname)
                navigate('/signin')
                return
            }
            console.log("sadadssa", item);

            setFavoriteLoader(true)
            const body = {
                barberId: item?._id
            }
            const response = await addFavorite(authToken, body)
            if (response?.success) {
                setFavoriteLoader(false)
                dispatch(addFavouritesRedux(item))
                Toast('success', response?.message)
            } else {
                setFavoriteLoader(false)
                Toast('error', response?.message)
            }
        } catch (error) {
            console.log(error);
            setFavoriteLoader(false)
        }
    }

    const handleNavigateToInatagram = async () => {
        console.log(item?.instagram);
        const instagramUrl = item?.instagram
        if (!instagramUrl) {
            return Toast('error', 'Instagram profile URL is not available')
        }
        try {
            window.open(instagramUrl, "_blank", "noopener,noreferrer");
        } catch (error) {
            console.error("Failed to open Instagram profile:", error);
            Toast('error', 'occurred while trying to open the Instagram profile')
        }
    }


    return (
        <div className='px-4 mt-10'>
            <div className='max-w-7xl mx-auto'>
                <div className='w-full flex flex-row items-start justify-between'>
                    <div className={`flex flex-col items-start mx-auto w-full ${showSidebar ? 'lg:flex-row' : 'md:flex-row'}`}>
                        <div className={`relative w-full ${showSidebar ? 'lg:w-[270px]' : 'md:w-[270px]'}`}>
                            <img src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female} className={`w-full h-[400px] xs:h-[450px] sm:h-[500px] rounded-lg ${showSidebar ? 'lg:h-[350px]' : 'md:h-[350px]'}`} />
                            {/* <div className='absolute left-2 bottom-2 text-black bg-white flex flex-row px-3 py-1 items-center justify-center rounded-lg cursor-pointer active:opacity-70'>
                                <img src={images.bookmarkBlack} className='w-4 h-4 mt-1 mr-1 object-contain' />
                                save
                            </div> */}
                            <div
                                onClick={() => !favoriteLoader && handleAddFavorite()}
                                className={`absolute left-2 bottom-2 bg-white flex flex-row px-3 py-1 items-center justify-center rounded-lg cursor-pointer active:opacity-70 ${isFavorite ? 'text-black' : 'text-hoverGray'}`}
                            >
                                {
                                    favoriteLoader ?
                                        <div
                                            className="inline-block h-4 w-4 mr-1 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                                            role="status">
                                        </div>
                                        : <img src={isFavorite ? images.bookmarkBlack : images.bookmarkDissable} className='w-4 h-4 mt-1 mr-1 object-contain' />
                                }
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
                                <SmallButton dark={false} title='Direction' image={images.direction} onClick={() => console.log(item)
                                } />
                                <SmallButton dark={false} title='Message' image={images.message} onClick={handleNavigateToChat} />
                                <SmallButton dark={false} title='Instagram' image={images.instagram} onClick={handleNavigateToInatagram} />
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
                    <div className='mt-4 font-semibold mb-2'>Schedule</div>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4`}>
                        {
                            item?.scheduled?.map((item: any, index: number) => {
                                return (
                                    <div key={index} className='flex flex-row items-center'>
                                        <div className={`w-12 h-10 rounded-md flex flex-row items-center justify-center mr-2 ${item?.available ? 'bg-inputGray' : 'bg-disable'}`}>
                                            <div className={`w-[15px] h-[15px] rounded-sm ${item?.available ? 'bg-green' : 'bg-red-500'}`}></div>
                                        </div>
                                        <div className={`h-10 w-full flex flex-row items-center justify-between rounded-md px-2 ${item?.available ? 'bg-inputGray' : 'bg-disable'}`}>
                                            <div>{item?.day}</div>
                                            <div>{item?.time}</div>
                                        </div>
                                    </div>
                                )
                            }
                            )
                        }
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
                                            handleClickedServicesBook(item)
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
                            <SmallButton dark title={isReviewPosted ? 'Edit Review' : 'Write a Review'} onClick={handleOpenReviewModal} />
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
                        {
                            // barbers?.find((barber: any) => barber?._id === item?._id)
                            item?.reviews
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
                                                <div className="text-lg font-semibold flex flex-riw items-center">{review?.userData?.name}
                                                    {
                                                        review?.userData?._id === userData?._id &&
                                                        <div className='text-sm ml-1'>(You)</div>
                                                    }
                                                </div>

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
                                        {/* <div className='font-medium'>{item?.price}</div> */}
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
                                {/* <div className='font-semibold text-lg'>{totalPrice}</div> */}
                            </div>
                            <div className='w-[2px] self-stretch bg-appGray'></div>
                            <SmallButton dark title='Book Appointment' onClick={bookAppointment} disable={selectedStyleIndex === null || selectedStyleIndex === undefined} />
                        </div>
                    </div>
                </div>
            }
            {
                isNotSameBarberModal &&
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg p-6 w-[90%] sm:w-[70%] md:w-[70%] lg:w-[50%] xl:w-[35%] xl:w-[22%] max-h-[80vh] overflow-y-scroll hide-scrollbar md:w-[25%] relative">
                        <div className='text-center'>  You have already selected a different barber. Are you sure you want
                            to remove the previously selected barber? Please confirm to proceed.</div>
                        <div className='flex flex-row w-full items-center justify-evenly mt-6'>
                            <SmallButton dark title='Confirm' long onClick={() => handleAddNewBarber()} />
                            <SmallButton dark={false} title='Cancel' long onClick={() => setIsNotSameBarberModal(false)} />
                        </div>
                    </div>
                </div>
            }
            {
                showWriteReviewModal &&
                <div
                    onClick={() => !reviewPostLoader && !reviewDeleteLoader && setShowWriteReviewModal(false)}
                    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-lg p-6 w-[90%] sm:w-[70%] md:w-[70%] lg:w-[50%] xl:w-[35%] xl:w-[22%] max-h-[80vh] overflow-y-scroll hide-scrollbar md:w-[25%] relative flex flex-col items-center justify-center">
                        <img src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female}
                            className='w-24 h-24 rounded-full object-cover'
                        />
                        <div className='text-lg font-bold mt-4 border border-inputGrey py-1 px-2 rounded-lg mb-4'>{item?.name}</div>
                        <StarRatings
                            rating={rating}
                            starRatedColor="gold"
                            numberOfStars={5}
                            starDimension="25px"
                            starSpacing="3px"
                            changeRating={handleRatingChange}
                            starHoverColor='gold'
                        />
                        <div className='mt-4 text-center'>{`Tell us about your experience at ${item?.name}`}</div>
                        <div className='flex flex-row items-center justify-between w-full sm:w-[70%] md:w-[50%] mt-4'>
                            <div>Comment</div>
                            {
                                isReviewPosted &&
                                <div className='bg-inputGray rounded-lg cursor-pointer w-8 h-8 flex flex-row items-center justify-center border border-hoverGray active:opacity-60'>
                                    {
                                        reviewDeleteLoader ?
                                            <div
                                                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                                                role="status">
                                            </div>
                                            : <img src={images.deleteIcon} className='w-4' onClick={handleDeleteReview} />
                                    }
                                </div>
                            }
                        </div>
                        <textarea
                            className='w-full sm:w-[70%] md:w-[50%] mt-2 resize-none border border-inputGray rounded-md p-2 focus:outline-none hide-scrollbar'
                            placeholder='Enter Your Message'
                            rows={4}
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                        />
                        <div className='w-full sm:w-[70%] md:w-[50%] mt-4'>

                            <Button light={false} title='Submit' loader={reviewPostLoader} onClick={() => isReviewPosted ? handleUpdateReview() : handlePostReview()} />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default BarberDetails