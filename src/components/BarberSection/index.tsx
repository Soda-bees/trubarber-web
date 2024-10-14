import React, { useEffect, useState } from "react";
import images from "../../services/config/images";
import Button from "../Button";
import { getAddressFromCoordinates, getAllBarbers } from "../../services/config/Api";
import CardLoader from "../CardLoader";
import ScrollToTopLink from "../ScrollToTopLink";
import { useDispatch, useSelector } from "react-redux";
import { selectBarbers, setBarbers } from "../../Store/BarbersSlice";

type Props = {};

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

const BarberSection = (props: Props) => {
  const dispatch = useDispatch()
  const barbers = useSelector(selectBarbers)

  const [sliderData, setSliderData] = useState<Barber[]>([]);

  const [visibleImages, setVisibleImages] = useState(5);
  const [startIndex, setStartIndex] = useState(0);
  const [loader, setLoader] = useState(false)
  const [addresses, setAddresses] = useState<string[]>([]);

  useEffect(() => {
    handleGetAllBarbers()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      const breakpoints = [
        { width: 1280, visibleImages: 5 },
        { width: 1024, visibleImages: 4 },
        { width: 768, visibleImages: 3 },
        { width: 556, visibleImages: 2 },
        { width: 544, visibleImages: 1 },
      ];

      const { visibleImages: newVisibleImages } =
        breakpoints.find(
          (breakpoint) => window.innerWidth >= breakpoint.width
        ) || breakpoints[breakpoints.length - 1];

      setVisibleImages(newVisibleImages);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleGetAllBarbers = async () => {
    try {
      setLoader(true)
      const response = await getAllBarbers() as { status: any, data: any }
      if (response?.status == 200) {
        setLoader(false)
        setSliderData(response?.data?.barbers)
        dispatch(setBarbers(response?.data?.barbers))
      } else {
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
      console.log(error);
    }
  }

  const handleNext = () => {
    if (startIndex + visibleImages < sliderData.length) {
      setStartIndex(startIndex + 1);
    } else {
      setStartIndex(0);
    }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else {
      setStartIndex(sliderData.length - visibleImages);
    }
  };

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
  }, [sliderData]);

  return (
    <div className="flex flex-col w-full p-4 ">
      <div className="flex flex-col mt-4 justify-between p-4 w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="text-3xl md:text-6xl md:w-[70%] lg:w-[60%] font-semibold">
            Discover Expert Barbers Online Effortlessly
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
          <div className="text-sm w-full md:text-xl md:w-[70%] lg:w-[30%] font-light">
            Effortlessly locate and connect with top-rated barbers in your area
            using our easy-to-use online platform.
          </div>
          <ScrollToTopLink to="/barbers" className="hidden border border-black/50 p-2 rounded-xl md:flex justify-center cursor-pointer lg:w-[8%]">
            View All
          </ScrollToTopLink>
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
      </div>

      <div className="bg-purplegray">
        <div className="flex flex-row gap-2 overflow-hidden">
          {barbers?.length > 0 && barbers.map((item, index) => {
            return (
              <div
                key={index}
                className={`w-full ${index >= startIndex && index < startIndex + visibleImages
                  ? "block"
                  : "hidden"
                  } ${visibleImages === 8
                    ? "xl:w-1/8 relative"
                    : visibleImages === 6
                      ? "lg:w-1/6 relative"
                      : visibleImages === 4
                        ? "md:w-1/2 relative"
                        : "sm:w-1/2 relative"
                  }`}
              >
                {loader ? <CardLoader /> :
                  <div>
                    <img
                      src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female}
                      className="w-full h-auto rounded-xl"
                      style={{ height: "380px", width: "100%" }}
                    />
                    <div className="absolute flex flex-row items-center top-3 right-3 bg-white/30 backdrop-blur-lg text-black font-bold px-2 py-1 rounded-lg">
                      {calculateAverageRating(item?.reviews)}
                      <img src={images.star} className="w-4 ml-2" />
                    </div>
                    <div className="absolute bottom-20 left-[5%] text-black bg-white/20 backdrop-blur-lg p-2 w-[90%] rounded-xl">
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
                    <Button light={false} title="Book Appointment" mt={'10px'} onClick={() => alert(index)} />
                  </div>
                }
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
};

export default BarberSection;

