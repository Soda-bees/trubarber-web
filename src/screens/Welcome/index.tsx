import React from 'react'
import Slider from '../../components/Slider'
import Header from '../../components/Header'
import LandingDiscover from '../../components/LandingDiscover'
import LogoLine from '../../components/LogoLine'
import BarberSection from '../../components/BarberSection'
import BarberServiceDisplay from '../../components/BarberServiceDisplay'
import CustomerReview from '../../components/CustomerReview'
import Footer from '../../components/Footer'

type Props = {}

const Welcome = (props: Props) => {
  return (
    <div>
      <Slider />
      <LandingDiscover />
      <LogoLine />
      <BarberSection />
      <BarberServiceDisplay />
      <LogoLine />
      <CustomerReview />
      <Footer />
    </div>
  )
}

export default Welcome