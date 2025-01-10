import React from 'react'
import images from '../../services/config/images'

type Props = {}

const BarberDashboard = (props: Props) => {
  return (
    <div className='h-full flex flex-row px-4 gap-2'>
      <div className='w-[55%]'>
        <div className='text-lg font-semibold'>Dashboard</div>
        <div className='grid grid-cols-2 gap-2'>

        <div className='bg-inputGray flex flex-row items-center justify-between p-3 rounded-lg'>
          <img src={images.appointment} className='w-6 filter invert dark-0' />
          <div>
            <div className='text-end text-lg font-semibold'>03</div>
            <div className=''>Pending Appointments</div>
          </div>
        </div>
        <div className='bg-inputGray flex flex-row items-center justify-between p-3 rounded-lg'>
          <img src={images.appointment} className='w-6 filter invert dark-0' />
          <div>
            <div className='text-end text-lg font-semibold'>03</div>
            <div className=''>Scheduled Appointments</div>
          </div>
        </div>
        </div>

        
      </div>
      <div className='bg-yellow-500 w-[45%]'>
      <div className='text-lg font-semibold'>Reviews</div>
      </div>
    </div>
  )
}

export default BarberDashboard