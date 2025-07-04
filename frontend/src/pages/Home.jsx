import React from 'react'
import Header from '../components/Header'
import SpecialityMenu from '../components/SpecialityMenu'
import TopLawyers from '../components/TopLawyers'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
            <Header/>
            <SpecialityMenu />
            <TopLawyers />
            <Banner />
    </div>
  )
}

export default Home
