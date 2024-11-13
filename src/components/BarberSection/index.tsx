import React, { useEffect, useRef, useState } from "react";
import images from "../../services/config/images";
import Button from "../Button";
import { getAddressFromCoordinates, getAllBarbers } from "../../services/config/Api";
import CardLoader from "../CardLoader";
import ScrollToTopLink from "../ScrollToTopLink";
import { useDispatch, useSelector } from "react-redux";
import { selectBarbers, setBarbers } from "../../Store/BarbersSlice";
import { useOutletContext } from "react-router-dom";
import useNavigate from "../ScrollToTopNavigate";

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

  const sliderRef = useRef<HTMLDivElement>(null);

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
        { width: 1280, visibleImages: showSidebar ? 5 : 6 },
        { width: 1024, visibleImages: 4 },
        { width: 768, visibleImages: showSidebar ? 2 : 3 },
        { width: 450, visibleImages: 2 },
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
  }, [showSidebar]);

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

  const handleNext = () => {
    if (startIndex + visibleImages < sliderData.length) {
      setStartIndex(startIndex + 1);
    } else {
      setStartIndex(0);
    }
    // if (sliderRef.current) {
    //   sliderRef.current.scrollBy({ left: 250, behavior: 'smooth' });
    // }
  };

  const handlePrevious = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    } else {
      setStartIndex(sliderData.length - visibleImages);
    }
    // if (sliderRef.current) {
    //   sliderRef.current.scrollBy({ left: -250, behavior: 'smooth' });
    // }
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
  }, [sliderData, showSidebar]);

  return (
    <div className="flex flex-col w-full p-4 ">
      <div className="flex flex-col mt-4 justify-between p-4 w-full">
        <div className="flex flex-row items-center justify-between">
          <div className="text-3xl md:text-6xl md:w-[70%] lg:w-[60%] font-semibold">
            {
              title ? title : 'Discover Expert Barbers Online Effortlessly'
            }
            {/* Discover Expert Barbers Online Effortlessly */}
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
      </div>

      {/* <div className="relative bg-red-500 w-[40%]">
        <div className='flex flex-row items-end gap-4 overflow-x-auto whitespace-x my-4 hide-scrollbar'
          ref={sliderRef}>
          {barbers?.length > 0 && barbers.map((item, index) => {
            return (
              <div key={index} className="w-[240px] md:w-[340px] flex-shrink-0 cursor-pointer relative rounded-2xl">
                {loader ? <CardLoader /> :
                  <div>
                    <img
                      src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female}
                      className="w-full h-[310px] md:h-[410px] rounded-xl"
                      // style={{ height: "380px", width: "100%" }}
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
      </div> */}

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
                    <Button light={false} title="Book Appointment" mt={'10px'} onClick={() => navigate(`/BarberDetails/${item?._id}`, { state: { item } })} />
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

// import React, { useEffect, useRef, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { useOutletContext } from 'react-router-dom';
// import { selectBarbers, setBarbers } from '../../Store/BarbersSlice';
// import { getAddressFromCoordinates, getAllBarbers } from '../../services/config/Api';
// import images from '../../services/config/images';
// import ScrollToTopLink from '../ScrollToTopLink';
// import Button from '../Button';

// interface Barber {
//   appoinment: any;
//   businessProfile: null | string;
//   businessVerification: null | string;
//   chat: any;
//   createdAt: string;
//   description: string;
//   email: string;
//   gender: string;
//   instagram: string;
//   location: any;
//   name: string;
//   notification: any;
//   offDays: any;
//   phone: string | any;
//   profile: null | string;
//   reviews: any;
//   role: string;
//   services: any;
//   tagSelection: any;
//   time: string;
//   updatedAt: string;
//   __v: number;
//   _id: string;
// }


// const BarberSection: React.FC = () => {

//   const { showSidebar } = useOutletContext<{ showSidebar: boolean }>();
//   const dispatch = useDispatch()
//   const barbers = useSelector(selectBarbers)

//   const [sliderData, setSliderData] = useState<Barber[]>([]);
//   const [loader, setLoader] = useState(false)
//   const [addresses, setAddresses] = useState<string[]>([]);

//   const sliderRef = useRef<HTMLDivElement>(null);
//   const [isDown, setIsDown] = useState(false);
//   const [startX, setStartX] = useState(0);
//   const [scrollLeft, setScrollLeft] = useState(0);

//   useEffect(() => {
//     handleGetAllBarbers()
//   }, [])

//   const handleMouseDown = (e: React.MouseEvent) => {
//     setIsDown(true);
//     if (sliderRef.current) {
//       setStartX(e.pageX - sliderRef.current.offsetLeft);
//       setScrollLeft(sliderRef.current.scrollLeft);
//     }
//   };

//   const handleMouseLeave = () => {
//     setIsDown(false);
//   };

//   const handleMouseUp = () => {
//     setIsDown(false);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     if (!isDown || !sliderRef.current) return;
//     e.preventDefault();
//     const x = e.pageX - sliderRef.current.offsetLeft;
//     const walk = (x - startX) * 1; // 1 is the speed factor
//     sliderRef.current.scrollLeft = scrollLeft - walk;
//   };

//   const handleGetAllBarbers = async () => {
//     try {
//       setLoader(true)
//       const response = await getAllBarbers() as { status: any, data: any }
//       if (response?.status == 200) {
//         setLoader(false)
//         setSliderData(response?.data?.barbers)
//         dispatch(setBarbers(response?.data?.barbers))
//       } else {
//         setLoader(false)
//       }
//     } catch (error) {
//       setLoader(false)
//       console.log(error);
//     }
//   }

//   const calculateAverageRating = (reviews: any) => {
//     if (reviews && reviews.length > 0) {
//       const totalRating = reviews.reduce(
//         (sum: any, review: any) => sum + parseFloat(review.rating),
//         0,
//       );
//       return totalRating / reviews.length;
//     } else {
//       return 0;
//     }
//   };

//   const getAddress = async (location: any) => {
//     try {
//       const fetchedAddress = await getAddressFromCoordinates(location?.latitude, location?.longitude);
//       return fetchedAddress;
//     } catch (error) {
//       console.log(error);
//       return 'Address not available';
//     }
//   };

//   const fetchAllAddresses = async () => {
//     const fetchedAddresses = await Promise.all(
//       sliderData.map((item) => getAddress(item?.location))
//     );
//     setAddresses(fetchedAddresses);
//   };

//   useEffect(() => {
//     if (sliderData.length > 0) {
//       fetchAllAddresses();
//     }
//   }, [sliderData]);


//   return (
//     <div className="flex flex-col ">
//       {/* <div className="flex flex-col mt-4 justify-between p-4 w-full">
//         <div className="flex flex-row items-center justify-between">
//           <div className="text-3xl md:text-6xl md:w-[70%] lg:w-[60%] font-semibold">
//             Discover Expert Barbers Online Effortlessly
//           </div>
//           <div className="hidden md:flex flex-row w-[7%] justify-between mr-1">
//             <div
//               // onClick={handlePrevious}
//               className="bg-white text-black rounded-full flex justify-center"
//             >
//               <img
//                 src={images.greyArrow}
//                 className="w-[40%] h-full cursor-pointer"
//               />
//             </div>

//             <div
//               // onClick={handleNext}
//               className="bg-white text-black rounded-full flex justify-center"
//             >
//               <img
//                 src={images.greyArrow}
//                 className="w-[40%] h-full rotate-180 cursor-pointer"
//               />
//             </div>
//           </div>
//         </div>
//         <div className="flex flex-row items-center justify-between mt-7">
//           <div className="text-sm w-full md:text-xl md:w-[70%] lg:w-[30%] font-light">
//             Effortlessly locate and connect with top-rated barbers in your area
//             using our easy-to-use online platform.
//           </div>
//           <ScrollToTopLink to="/barbers" className="hidden border border-black/50 p-2 rounded-xl md:flex justify-center cursor-pointer lg:w-[8%]">
//             View All
//           </ScrollToTopLink>
//         </div>
//         <div className="md:hidden flex flex-row justify-between mt-4">
//           <ScrollToTopLink to="/barbers" className="border border-black/50 p-2 px-5 rounded-xl flex justify-center cursor-pointer mr-2">
//             View All
//           </ScrollToTopLink>
//           <div className="flex flex-row justify-between w-[15%] h-[15%] mt-3">
//             <div
//               // onClick={handlePrevious}
//               className="bg-white text-black rounded-full flex justify-center mr-3"
//             >
//               <img src={images.greyArrow} className="w-3 h-5" />
//             </div>

//             <div
//               // onClick={handleNext}
//               className="bg-white text-black rounded-full flex justify-center"
//             >
//               <img src={images.greyArrow} className="rotate-180 w-3 h-5" />
//             </div>
//           </div>
//         </div>
//       </div> */}
//       <div
//         ref={sliderRef}
//         onMouseDown={handleMouseDown}
//         onMouseLeave={handleMouseLeave}
//         onMouseUp={handleMouseUp}
//         onMouseMove={handleMouseMove}
//         className="overflow-x-scroll hide-scrollbar mb-4 relative w-[100%] bg-red-500"
//         style={{ overflowY: 'hidden' }}
//       >
//         <div className="flex snap-x snap-mandatory gap-4"
//         style={{ width: 'max-content' }}
//         >
//           {sliderData.map((item, index) => {
//             return (
//               // <div>
//               //   <img
//               //     src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female}
//               //     className="w-full h-auto rounded-xl"
//               //     style={{ height: "380px", width: "100%" }}
//               //   />
//               //   <div className="absolute flex flex-row items-center top-3 right-3 bg-white/30 backdrop-blur-lg text-black font-bold px-2 py-1 rounded-lg">
//               //     {calculateAverageRating(item?.reviews)}
//               //     <img src={images.star} className="w-4 ml-2" />
//               //   </div>
//               //   <div className="absolute bottom-20 left-[5%] text-black bg-white/20 backdrop-blur-lg p-2 w-[90%] rounded-xl">
//               //     <div className="font-bold text-lg">{item.name}</div>
//               //     <div className="text-sm flex flex-row items-center">
//               //       <img src={images.Location} className="w-[5%] h-full mr-1" />
//               //       <span className="truncate whitespace-nowrap overflow-hidden w-full">
//               //         {addresses[index] ? (
//               //           addresses[index]
//               //         ) : (
//               //           <span className="w-full flex items-center justify-center">
//               //             <span
//               //               className="inline-block min-h-[1em] w-full flex-auto cursor-wait bg-black align-middle opacity-30"></span>
//               //           </span>
//               //         )}
//               //       </span>
//               //     </div>
//               //   </div>
//               //   <Button light={false} title="Book Appointment" mt={'10px'} onClick={() => alert(index)} />
//               // </div>
//               <div key={index} className="flex-none w-[280px] snap-center ">
//                 <div className="rounded-xl overflow-hidden relative">
//                   <img src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female}
//                     className="w-full h-[350px]" />
//                   <div className="absolute border border-inputGray flex flex-row items-center top-3 right-3 bg-white/30 backdrop-blur-lg text-black font-bold px-2 py-1 rounded-lg">
//                     {calculateAverageRating(item?.reviews)}
//                     <img src={images.star} className="w-4 ml-2" />
//                   </div>
//                   <div className="absolute bottom-4 left-[5%] text-black bg-white/20 backdrop-blur-lg p-2 w-[90%] rounded-xl">
//                     <div className="font-bold text-lg">{item.name}</div>
//                     <div className="text-sm flex flex-row items-center">
//                       <img src={images.Location} className="w-[5%] h-full mr-1" />
//                       <span className="truncate whitespace-nowrap overflow-hidden w-full">
//                         {addresses[index] ? (
//                           addresses[index]
//                         ) : (
//                           <span className="w-full flex items-center justify-center">
//                             <span
//                               className="inline-block min-h-[1em] w-full flex-auto cursor-wait bg-black align-middle opacity-30"></span>
//                           </span>
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <Button light={false} title="Book Appointment" mt={'8px'} onClick={() => alert(index)} />
//               </div>
//             )
//           })}
//         </div>
//       </div>

//       {/* some better */}
//       {/* <div className="overflow-hidden mb-4 relative w-full max-w-[69vw] xl:max-w-[79vw] 2xl:max-w-[80vw]">
//         <div
//           ref={sliderRef}
//           onMouseDown={handleMouseDown}
//           onMouseLeave={handleMouseLeave}
//           onMouseUp={handleMouseUp}
//           onMouseMove={handleMouseMove}
//           className="overflow-x-auto hide-scrollbar w-full "
//         >
//           <div className="flex gap-4">
//             {sliderData.map((item, index) => (
//               <div key={index} className="flex-none w-[280px] snap-start">
//                 <div className="rounded-xl overflow-hidden relative">
//                   <img
//                     src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female}
//                     className="w-full h-[350px]"
//                     alt={item?.name}
//                   />
//                   <div className="absolute border border-inputGray flex flex-row items-center top-3 right-3 bg-white/30 backdrop-blur-lg text-black font-bold px-2 py-1 rounded-lg">
//                     {calculateAverageRating(item?.reviews)}
//                     <img src={images.star} className="w-4 ml-2" />
//                   </div>
//                   <div className="absolute bottom-4 left-[5%] text-black bg-white/20 backdrop-blur-lg p-2 w-[90%] rounded-xl">
//                     <div className="font-bold text-lg">{item.name}</div>
//                     <div className="text-sm flex flex-row items-center">
//                       <img src={images.Location} className="w-[5%] h-full mr-1" />
//                       <span className="truncate whitespace-nowrap overflow-hidden w-full">
//                         {addresses[index] ? (
//                           addresses[index]
//                         ) : (
//                           <span className="w-full flex items-center justify-center">
//                             <span className="inline-block min-h-[1em] w-full flex-auto cursor-wait bg-black align-middle opacity-30"></span>
//                           </span>
//                         )}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//                 <Button light={false} title="Book Appointment" mt={'8px'} onClick={() => alert(index)} />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div> */}


//     </div>

//   );
// };

// export default BarberSection;

// {/* <div
//       ref={sliderRef}
//       onMouseDown={handleMouseDown}
//       onMouseLeave={handleMouseLeave}
//       onMouseUp={handleMouseUp}
//       onMouseMove={handleMouseMove}
//       className="overflow-x-scroll scrollbar-hide mb-4 relative px-0.5"
//       style={{ overflowY: 'hidden' }}
//     >
//       <div className="flex snap-x snap-mandatory gap-4" style={{ width: 'max-content' }}>
//         {cards.map((card) => (
//           <div key={card.id} className="flex-none w-64 snap-center">
//             <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-4">
//               <img src={card.image} alt={card.title} className="w-full h-40 object-cover" />
//               <div className="p-4">
//                 <h3 className="text-lg leading-6 font-bold text-gray-900">{card.title}</h3>
//                 <p className="text-gray-600 mt-2 text-sm">{card.description}</p>
//                 <div className="flex justify-between items-center mt-4">
//                   <span className="text-2xl font-extrabold text-gray-900">${card.price.toFixed(2)}</span>
//                   <a
//                     href={card.link}
//                     className="text-white bg-fuchsia-950 hover:bg-fuchsia-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
//                   >
//                     <svg
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       strokeWidth="1.5"
//                       stroke="currentColor"
//                       className="w-5 h-5"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
//                       />
//                     </svg>
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div> */}


