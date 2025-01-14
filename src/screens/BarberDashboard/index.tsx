import React, { useEffect, useState } from 'react'
import images from '../../services/config/images'
import { useSelector } from 'react-redux'
import { selectUser } from '../../Store/userDataSlice'
import useNavigate from '../../components/ScrollToTopNavigate'

type Props = {}

const BarberDashboard = (props: Props) => {

  const userData = useSelector(selectUser)
  const navigate = useNavigate()

  const [pendingAppointments, setPendingAppointments] = useState<number>(0)
  const [scheduledAppointments, setScheduledAppointments] = useState<number>(0)

  useEffect(() => {
    if (userData?.appoinment) {
      filterAndSetAppointments(userData?.appoinment);
    }
  }, [userData])

  const filterAndSetAppointments = (appointments: any) => {
    const completedAppointments = appointments.filter(
      (appointment: any) => appointment?.status.toLowerCase() === 'scheduled',
    );
    const pendingAppointments = appointments.filter(
      (appointment: any) => appointment?.status.toLowerCase() === 'pending',
    );

    setScheduledAppointments(completedAppointments.length);
    setPendingAppointments(pendingAppointments.length);
  };
  return (
    <div className='h-full flex flex-col xl:flex-row px-4 gap-2'>
      <div className='xl:w-[55%]'>
        <div className='text-lg font-semibold'>Dashboard</div>
        <div className='grid grid-cols-1 xs:grid-cols-2 gap-2'>
          <div className='bg-inputGray flex flex-row items-start justify-between p-3 rounded-lg'>
            <img src={images.appointment} className='w-6 filter invert dark-0' />
            <div>
              <div className='text-end text-lg font-semibold'>{pendingAppointments}</div>
              <div className='text-end'>Pending Appointments</div>
            </div>
          </div>
          <div className='bg-inputGray flex flex-row items-start justify-between p-3 rounded-lg'>
            <img src={images.appointment} className='w-6 filter invert dark-0' />
            <div>
              <div className='text-end text-lg font-semibold'>{scheduledAppointments}</div>
              <div className='text-end'>Scheduled Appointments</div>
            </div>
          </div>
        </div>
        <div className='mt-6 flex flex-row items-center justify-between'>
          <div className='text-lg font-semibold'>Dashboard</div>
          <div className='border border-black py-1 px-3 rounded-2xl flex flex-row items-center cursor-pointer active:opacity-40' onClick={() => navigate('/appointment')} >
            View all
            <img src={images.arrowBtnBlack} className='ml-2 w-3 h-5' />
          </div>
        </div>
        {
          userData?.appoinment?.length > 0 &&
          <div className='grid grid-cols-5 gap-2 border border-inputGray p-2 rounded-lg mt-2'>
            <div className='col-span-2 font-semibold'>Service</div>
            <div className='font-semibold'>Price</div>
            <div className='font-semibold'>Date & Time</div>
            <div className='font-semibold'>Status</div>
          </div>
        }
      </div>
      <div className='bg-yellow-500 xl:w-[45%]'>
        <div className='text-lg font-semibold'>Reviews</div>
      </div>
    </div>
  )
}

export default BarberDashboard