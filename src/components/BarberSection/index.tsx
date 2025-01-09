import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router-dom';
import { selectBarbers, setBarbers } from '../../Store/BarbersSlice';
import { getAddressFromCoordinates, getAllBarbers } from '../../services/config/Api';
import images from '../../services/config/images';
import ScrollToTopLink from '../ScrollToTopLink';
import Button from '../Button';
import useNavigate from '../ScrollToTopNavigate';
import { motion, AnimatePresence } from "framer-motion";
import LeftToRightAnimation from '../LeftToRightAnimation';
import RightToLeftAnimation from '../RightToLeftAnimation';

interface Barber {
  appoinment: any;
  businessProfile: null | string;
  businessVerification: null | string;
  chat: any;
  createdAt: string;
  description: string;
  email: string;
  gender: string;
  instagram: string;
  location: any;
  name: string;
  notification: any;
  offDays: any;
  phone: string | any;
  profile: null | string;
  reviews: any;
  role: string;
  services: any;
  tagSelection: any;
  time: string;
  updatedAt: string;
  __v: number;
  _id: string;
}

type Props = {
  title?: string,
  showDes?: boolean
  showBtn?: boolean
}


const BarberSection = ({ title, showDes, showBtn }: Props) => {

  const { showSidebar } = useOutletContext<{ showSidebar: boolean }>();
  const dispatch = useDispatch()
  const barbers = useSelector(selectBarbers)
  const navigate = useNavigate()

  const [sliderData, setSliderData] = useState<Barber[]>([]);
  const [loader, setLoader] = useState(false)
  const [addresses, setAddresses] = useState<string[]>([]);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    handleGetAllBarbers()
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDown(true);
    if (sliderRef.current) {
      setStartX(e.pageX - sliderRef.current.offsetLeft);
      setScrollLeft(sliderRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 1; // 1 is the speed factor
    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleGetAllBarbers = async () => {
    try {
      setLoader(true)
      const response = await getAllBarbers() as { status: any, data: any }
      if (response?.status == 200) {
        const allBarbers = response?.data?.barbers
        const filteredBarbers = allBarbers?.filter((barber: any) => !barber?.isDeleted)
        setLoader(false)
        setSliderData(filteredBarbers)
        dispatch(setBarbers(filteredBarbers))
      } else {
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
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
      sliderData.map((item) => getAddress(item?.location))
    );
    setAddresses(fetchedAddresses);
  };

  useEffect(() => {
    if (sliderData.length > 0) {
      fetchAllAddresses();
    }
  }, [sliderData, showSidebar]);

  const handleNext = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };


  return (
    <div className="flex flex-col">
      <RightToLeftAnimation className="flex flex-col mt-4 justify-between p-4 w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="text-3xl md:text-6xl md:w-[70%] lg:w-[60%] font-semibold">
            {
              title ? title : 'Discover Expert Barbers Online Effortlessly'
            }
          </div>
          <div className="hidden md:flex flex-row w-[7%] justify-between mr-1">
            <div
              onClick={handlePrevious}
              className="bg-white text-black rounded-full flex justify-center"
            >
              <img
                src={images.greyArrow}
                className="w-[40%] h-full cursor-pointer"
              />
            </div>

            <div
              onClick={handleNext}
              className="bg-white text-black rounded-full flex justify-center"
            >
              <img
                src={images.greyArrow}
                className="w-[40%] h-full rotate-180 cursor-pointer"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between mt-7">
          {
            showDes &&
            <div className="text-sm w-full md:text-xl md:w-[70%] lg:w-[30%] font-light">
              Effortlessly locate and connect with top-rated barbers in your area
              using our easy-to-use online platform.
            </div>
          }
          {
            showBtn &&
            <ScrollToTopLink to="/barbers" className="hidden border border-black/50 p-2 rounded-xl md:flex justify-center cursor-pointer lg:w-[8%]">
              View All
            </ScrollToTopLink>
          }
        </div>
        <div className="md:hidden flex flex-row justify-between mt-4">
          <ScrollToTopLink to="/barbers" className="border border-black/50 p-2 px-5 rounded-xl flex justify-center cursor-pointer mr-2">
            View All
          </ScrollToTopLink>
          <div className="flex flex-row justify-between w-[15%] h-[15%] mt-3">
            <div
              onClick={handlePrevious}
              className="bg-white text-black rounded-full flex justify-center mr-3"
            >
              <img src={images.greyArrow} className="w-3 h-5" />
            </div>

            <div
              onClick={handleNext}
              className="bg-white text-black rounded-full flex justify-center"
            >
              <img src={images.greyArrow} className="rotate-180 w-3 h-5" />
            </div>
          </div>
        </div>
      </RightToLeftAnimation>
      <div className='relative w-[98%] mx-auto h-[440px] rounded-lg shadow-md'>
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          className="absolute top-0 left-0 right-0 bottom-0 whitespace-nowrap overflow-x-scroll overflow-y-hidden hide-scrollbar"
        >
            <motion.div
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: false, amount: 0.8 }}
              className="inline-block box-border flex flex-row gap-2">
              {barbers?.length > 0 && barbers.map((item, index) => {
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.95, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.5 }}
                    transition={{
                      duration: 0.9,
                      delay: index * 0.1,
                      ease: "easeOut",
                    }}
                    className="w-[280px] snap-center flex-none"
                  >
                    <div className="rounded-xl overflow-hidden relative">
                      <img src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female}
                        className="w-full h-[350px]" />
                      <div className="absolute border border-inputGray flex flex-row items-center top-3 right-3 bg-white/30 backdrop-blur-lg text-black font-bold px-2 py-1 rounded-lg">
                        {calculateAverageRating(item?.reviews)}
                        <img src={images.star} className="w-4 ml-2" />
                      </div>
                      <div className="absolute bottom-4 left-[5%] text-black bg-white/20 backdrop-blur-lg p-2 w-[90%] rounded-xl">
                        <div className="font-bold text-lg">{item.name}</div>
                        <div className="text-sm flex flex-row items-center">
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
                    </div>
                    <Button light={false} title="Book Appointment" mt={'10px'} onClick={() => navigate(`/BarberDetails/${item?._id}`, { state: { item } })} />
                  </motion.div>

                )
              })}
            </motion.div>
        </div>
      </div>
    </div>

  );
};

export default BarberSection;

