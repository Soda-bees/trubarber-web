import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import images from '../../services/config/images';
import SmallButton from '../../components/SmallButton';
import { getAddressFromCoordinates } from '../../services/config/Api';

type Props = {}

const BarberDetails = (props: Props) => {
    const location = useLocation();
    const item = location.state?.item;
    console.log(item);

    const [addressLodaer, setAddressLodaer] = useState<boolean>(false)
    const [address, setAddress] = useState<string>('')

    useEffect(() => {
        if (item) {
            handleGetBarberAddress()
        }
    }, [location?.state])

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

    return (
        <div className='px-4 mt-10'>
            <div className='max-w-7xl mx-auto'>
                <div className='w-full flex flex-row items-start justify-between'>
                    <div className='flex flex-col md:flex-row items-start mx-auto w-full'>
                        <div className='relative w-full md:w-[270px]'>
                            <img src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female} className='w-full h-[400px] xs:h-[450px] sm:h-[500px] md:h-[350px] rounded-lg' />
                            <div className='absolute left-2 bottom-2 text-black bg-white flex flex-row px-3 py-1 items-center justify-center rounded-lg cursor-pointer active:opacity-70'>
                                <img src={images.bookmarkBlack} className='w-4 h-4 mt-1 mr-1 object-contain' />
                                save
                            </div>
                        </div>
                        <div className='md:ml-4 mt-4 h-full w-full md:w-[65%]'>
                            <div className='text-lg font-bold'>{item?.name}</div>
                            <div className='text-sm mt-2 flex flex-col items-start'>
                                <div className='flex flex-row items-start'>
                                    {
                                        addressLodaer ?
                                            <div
                                                className="inline-block h-4 w-4 animate-spin rounded-full border-2  border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                                                role="status">
                                            </div> :
                                            <img
                                                src={images.Location}
                                                className="w-3 mr-1 mt-[3px]"
                                                alt="Location"
                                            />
                                    }
                                    {address || addressLodaer && 'Loading...'}
                                </div>
                                <div className='bg-pink-200 w-full lg:w-[55%] mt-4 lg:hidden h-20'>Map</div>
                            </div>
                            <div className='flex flex-row items-center gap-2 mt-4 lg:mt-8'>
                                <SmallButton dark={false} title='Direction' image={images.direction} />
                                <SmallButton dark={false} title='Message' image={images.message} />
                            </div>
                            <div className='mt-4 font-semibold'>About</div>
                            <div className='w-full mt-2 text-hoverGray bg-red-500'>{item?.description}</div>
                        </div>
                    </div>
                    <div className='bg-pink-200 w-[55%] hidden lg:flex h-20'>Map</div>
                </div>
                <div className='mt-10'>
                    <div className='mt-4 font-semibold'>Services</div>
                    {/* <div className='grid grid-cols-2 gap-4'>
                        {item?.services?.map((item: any, index: number) => {
                            return (
                                <div key={index}
                                    className='border border-hoverGray rounded-lg p-2 flex flex-row items-start justify-between'
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
                                    <div className='bg-black px-5 py-1 rounded-xl text-white active:opacity-70 cursor-pointer'>
                                        Book
                                    </div>
                                </div>
                            )
                        })}
                    </div> */}
                </div>
            </div>

        </div>
    )
}

export default BarberDetails