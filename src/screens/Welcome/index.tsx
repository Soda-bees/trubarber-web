import React from 'react'
import Slider from '../../components/Slider'
import Header from '../../components/Header'
import LandingDiscover from '../../components/LandingDiscover'
import LogoLine from '../../components/LogoLine'
import BarberSection from '../../components/BarberSection'

type Props = {}

const Welcome = (props: Props) => {
  return (
    <div>
      <Slider />
      <LandingDiscover />
      <LogoLine />
      <BarberSection />
    </div>
  )
}

export default Welcome