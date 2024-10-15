import React, { useEffect, useState } from 'react'
import images from '../../services/config/images'
import { useSelector } from 'react-redux'
import { selectBarbers } from '../../Store/BarbersSlice'
import Button from '../../components/Button'
import { useOutletContext } from "react-router-dom";
import { getAddressFromCoordinates } from '../../services/config/Api'

type Props = {}

const AllBarbers = (props: Props) => {
  const { showSidebar } = useOutletContext<{ showSidebar: boolean }>();
  const barbers = useSelector(selectBarbers)
  const [addresses, setAddresses] = useState<string[]>([]);

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
      barbers.map((item) => getAddress(item?.location))
    );
    setAddresses(fetchedAddresses);
  };

  useEffect(() => {
    if (barbers.length > 0) {
      fetchAllAddresses();
    }
  }, [barbers , showSidebar]);

  return (
    <div>
      <div className='bg-cover md:bg-center lg:bg-contain xl:bg-cover bg-no-repeat relative w-full h-[30vh] xs:h-[25vh] sm:h-[30vh] md:h-[35vh] lg:h-[40vh] flex flex-col items-start justify-end sm:items-center sm:justify-center'>
        <img src={images.BG} className='w-full h-full absolute' />
        <div className='z-10 sm:text-2xl md:text-4xl lg:text-6xl text-white font-bold px-3'>Meet Our Barbers</div>
        <div className='z-10 text-white text-xs sm:text-base lg:text-lg mt-2 px-3 pb-2 sm:px-0 sm:pb-0 sm:text-center sm:w-[80%] xl:w-[60%]'>At TRU Barber, our team is made up of skilled professionals who are passionate about delivering the perfect cut, shave, and style. Each barber brings their unique expertise to ensure you leave looking your best.</div>
      </div>
      <div className='p-4'>
        <div>
          <div>Find Your Barber</div>
          <div>Explore our team of barbers and choose the one that best fits your style. Check out their profiles, see their specialties, and book your next appointment with confidence.</div>
        </div>
        <div className={`gap-4 mt-8 grid grid-cols-2`}>
          {barbers?.map((item: any, index: number) => {
            return (
              <div key={index} className='relative'>
                <img
                  src={item?.profile ? item?.profile : item?.gender === 'male' ? images.male : images.female}
                  className="w-full h-auto rounded-xl"
                  style={{ height: "180px", width: "100%" }}
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
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AllBarbers