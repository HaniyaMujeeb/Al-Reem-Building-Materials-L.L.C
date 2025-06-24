import React from 'react'
import Banner from '../Component/Banner'
import LatestCollection from '../Component/LatestCollection'
import BestSeller from '../Component/BestSeller'
import OurPolicy from '../Component/OurPolicy'

const Home = () => {
  return (
    <div>
      <Banner />
      <LatestCollection />
      <BestSeller />
      <OurPolicy />
    </div>
  )
}

export default Home
