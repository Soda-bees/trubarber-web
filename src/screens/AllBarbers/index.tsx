import React from 'react'
import images from '../../services/config/images'

type Props = {}

const AllBarbers = (props: Props) => {
  return (
    <div>
        <div className='bg-cover md:bg-center lg:bg-contain xl:bg-cover bg-no-repeat relative w-full h-[30vh] xs:h-[25vh] sm:h-[30vh] md:h-[35vh] lg:h-[40vh] flex flex-col items-start justify-end sm:items-center sm:justify-center'>
            <img src={images.BG} className='w-full h-full absolute' />
            <div className='z-10 sm:text-2xl md:text-4xl lg:text-6xl text-white font-bold px-3'>Meet Our Barbers</div>
            <div className='z-10 text-white text-xs sm:text-base lg:text-lg mt-2 px-3 pb-2 sm:px-0 sm:pb-0 sm:text-center sm:w-[80%] xl:w-[60%]'>At TRU Barber, our team is made up of skilled professionals who are passionate about delivering the perfect cut, shave, and style. Each barber brings their unique expertise to ensure you leave looking your best.</div>
        </div>
    </div>
  )
}

export default AllBarbers