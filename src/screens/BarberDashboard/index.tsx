import React from 'react'

type Props = {}

const BarberDashboard = (props: Props) => {
  return (
    <div className='bg-pink-300 h-full flex flex-row px-4'>
      <div className='bg-red-500 w-[55%]'>1st</div>
      <div className='bg-yellow-500 w-[45%]'>second</div>
    </div>
  )
}

export default BarberDashboard