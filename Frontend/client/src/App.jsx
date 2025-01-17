import React from 'react'
import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import About from './pages/About'
import Doctors from './pages/Doctors'
import Contact from './pages/Contact'
import Myprofile from './pages/Myprofile'
import Myappointment from './pages/Myappointment'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

import { ToastContainer, toast } from 'react-toastify';



const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer/>
      <Navbar/>
      <Routes>
        <Route path='/' element={<Home />} />
         <Route path='/login' element = {<Login/>} />
        <Route path = '/about' element = {<About />} />
        <Route path = '/doctors' element = {<Doctors />} />
        <Route path = '/contact' element = {<Contact/>} />
        <Route path = '/doctors/:speciality' element = {<Doctors/>} />
        <Route path = '/myprofile' element = {<Myprofile/>} />
        <Route path = '/myappointment' element = {<Myappointment/>} />
        <Route path = '/appointment/:docId' element = {<Appointment/>} />  
      </Routes>
      <Footer/>
    </div>
  )
}

export default App