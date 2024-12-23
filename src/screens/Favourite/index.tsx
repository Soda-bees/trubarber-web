import React, { useEffect, useState } from 'react'
import images from '../../services/config/images'
import { useSelector } from 'react-redux'
import { selectBarbers } from '../../Store/BarbersSlice'
import Button from '../../components/Button'
import { useOutletContext } from "react-router-dom";
import { getAddressFromCoordinates } from '../../services/config/Api'
import useNavigate from '../../components/ScrollToTopNavigate'
import { selectUser } from '../../Store/userDataSlice'

type Props = {}

const Favourite = (props: Props) => {
    const { showSidebar } = useOutletContext<{ showSidebar: boolean }>();
    const barbers = useSelector(selectBarbers)
    const navigate = useNavigate()
    const userData = useSelector(selectUser)
    console.log("das" , userData);
    

    const [addresses, setAddresses] = useState<string[]>([]);
    const [selectedService, setSelectedService] = useState<string>('')
    const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth < 768);
        };

        handleResize(); // Check screen size on component mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

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
    const getAddress = async (location: any) => {
        try {
            const fetchedAddress = await getAddressFromCoordinates(location?.latitude, location?.longitude);
            return fetchedAddress;
        } catch (error) {
            console.log(error);
            return 'Address not available';
        }
    };

    const fetchAllAddresses = async () => {
        const fetchedAddresses = await Promise.all(
            barbers.map((item) => getAddress(item?.location))
        );
        setAddresses(fetchedAddresses);
    };

    const handleToggleService = (service: string) => {
        setSelectedService((prevService) => {
            return prevService === service ? '' : service;
        });
    }

    useEffect(() => {
        if (barbers.length > 0) {
            fetchAllAddresses();
        }
    }, [barbers, showSidebar]);

    return (
        <div>
            <div
                className='bg-cover md:bg-center lg:bg-contain xl:bg-cover bg-no-repeat relative w-full h-[35vh] xs:h-[30vh] sm:h-[35vh] md:h-[40vh] lg:h-[45vh] flex flex-col items-start justify-end sm:items-center sm:justify-center'>
                <img src={images.BG} className='w-full h-full absolute' />
                <div className='z-10 sm:text-2xl md:text-4xl lg:text-6xl text-white font-bold px-3'>Save Barbers</div>
                <div className='z-10 text-white text-xs sm:text-base lg:text-lg mt-2 px-3 pb-2 sm:px-0 sm:pb-0 sm:text-center sm:w-[80%] xl:w-[60%]'>Quickly save and access your favorite or most important barbers.</div>
            </div>
            <div className='p-4 px-4 lg:px-8 mt-10'>

                <div
                >
                    {
                        userData?.favourites?.length > 0 ? (
                            <div className={`gap-4 mt-8 grid grid-cols-2 ${showSidebar ? 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'xs:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'}`}>
                                {
                                    userData?.favourites
                                        ?.map((item: any, index: number) => {
                                            return (
                                                <div key={index} className='relative'>
                                                    <img
                                                        src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female}
                                                        className={"w-full h-[180px]  md:h-[320px] rounded-xl"}
                                                        style={{ width: "100%" }}
                                                    />
                                                    <div className="absolute flex flex-row items-center top-3 right-3 bg-white/30 backdrop-blur-lg text-black font-bold px-2 py-1 rounded-lg">
                                                        {calculateAverageRating(item?.reviews)}
                                                        <img src={images.star} className="w-4 ml-2" />
                                                    </div>
                                                    <div className="absolute bottom-16 md:bottom-20 left-[5%] text-black bg-white/20 backdrop-blur-lg p-2 w-[90%] rounded-xl">
                                                        <div className="font-bold text-sm md:text-lg truncate">{item.name}</div>
                                                        <div className="text-xs md:text-sm flex flex-row items-center">
                                                            <img src={images.Location} className="w-[5%] h-full mr-1" />
                                                            <span className="truncate whitespace-nowrap overflow-hidden w-full">
                                                                {addresses[index] ? (
                                                                    addresses[index]
                                                                ) : (
                                                                    <span className="w-full flex items-center justify-center">
                                                                        <span
                                                                            className="inline-block min-h-[1em] w-full flex-auto cursor-wait bg-black align-middle opacity-30"></span>
                                                                    </span>
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Button light={false} title="Book Appointment" mt={'10px'} fontSize={isSmallScreen ? '14px' : undefined} px={isSmallScreen ? '10px' : undefined}
                                                        onClick={() => navigate(`/BarberDetails/${item?._id}`, { state: { item } })}
                                                    />
                                                </div>
                                            )
                                        })
                                }
                            </div>
                        ) : (
                            <div className='font-bold text-xl text-center'>No save barbers found</div>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Favourite