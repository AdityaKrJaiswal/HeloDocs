import React from 'react'
import Header from '../components/Header'
import Speciality_menu from '../components/Speciality_menu'
import TopDoctors from '../components/TopDoctors'
import Banner from '../components/Banner'

const Home = () => {
  return (
    <div>
      <Header/>
      <Speciality_menu/>
      <TopDoctors/>
      <Banner/>
    </div>
  )
}

export default Home