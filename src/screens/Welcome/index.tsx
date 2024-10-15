import React, { useEffect, useState } from 'react'
import Slider from '../../components/Slider'
import Header from '../../components/Header'
import LandingDiscover from '../../components/LandingDiscover'
import LogoLine from '../../components/LogoLine'
import BarberSection from '../../components/BarberSection'
import BarberServiceDisplay from '../../components/BarberServiceDisplay'
import CustomerReview from '../../components/CustomerReview'
import { useSelector } from 'react-redux'
import { selectBarbers } from '../../Store/BarbersSlice'
import { selectUser } from '../../Store/userDataSlice'

type Props = {}

const Welcome = (props: Props) => {
  const barbers = useSelector(selectBarbers)
  
  return (
    <div className='flex flex-col w-full' >
      <Slider />
      <LandingDiscover />
      <LogoLine />
      <BarberSection />
      <BarberServiceDisplay />
      <LogoLine />
      <CustomerReview />
    </div>
  )
}

export default Welcome