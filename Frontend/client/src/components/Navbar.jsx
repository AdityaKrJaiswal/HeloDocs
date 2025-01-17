import React, { useContext } from 'react'
import {assets} from '../assets/assets_frontend/assets'
import { NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { AppContext } from '../context/AppContext'

const Navbar = () => {
    const navigate = useNavigate();
    const {token,setToken,userData} = useContext(AppContext)
    const [showMenu,setshowMenu]=useState(false)
    // const [token,setToken] = useState(true)
    const logout = ()=>{
        setToken('');
        localStorage.removeItem('token')
    }
  return (
    <div className='flex items-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400'>
        <img onClick={()=>navigate('/')} className='w-44 cursor-pointer' src={assets.logo} alt=''></img>
        <ul className='hidden md:flex items-start gap-5 font-medium'>
            <NavLink to='/'>
                <li className='py-1'>HOME</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/doctors'>
                <li className='py-1'>DOCTORS</li>
                <hr className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden' />
            </NavLink>
            <NavLink to='/about'>
                <li className='py-1'>ABOUT</li>
                <hr  className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            <NavLink to='/contact'>
                <li className='py-1'>CONTACT</li>
                <hr  className='border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden'/>
            </NavLink>
            
        </ul>
        <div className='flex gap-4 '>
            {
                token && userData ? <div className='flex items-center gap-2 cursor-pointer group relative '>
                    <img src={userData.image} alt='' className='w-8 rounded-full'></img>
                    <img src={assets.dropdown_icon} alt='' className='w-2.5'></img>
                    <div className='absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-40 hidden group-hover:block '>
                        <div className='min-w-48 rounded flex flex-col gap-4 p-4 bg-stone-100'>
                            <p onClick={()=>navigate('/myprofile')} className='hover:text-black cursor-pointer'>My profile</p>
                            <p onClick={()=>navigate('/myappointment')} className='hover:text-black cursor-pointer'>My Appointments</p>
                            <p onClick={logout} className='hover:text-black cursor-pointer'>Logout</p>
                        </div>
                    </div>
                </div>: <button onClick={()=>navigate('/login')} className='bg-primary text-white px-8 py-3 rounded-full  hidden md:block font-bold '>CREATE ACCOUNT</button>
            }
            <img onClick={()=>setshowMenu(true)} className='w-6 md:hidden ' src={assets.menu_icon} alt="" />

            <div className={` md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all ${showMenu?'fixed w-full':'h-0 w-0'} `}>
                <div className='flex items-center justify-between px-5 py-6 '>
                    <img className='w-36 ' src={assets.logo} alt="" />
                    <img className='w-7' onClick={()=>setshowMenu(false)} src={assets.cross_icon} alt="" />
                </div>
                <ul className='flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium '>
                    <NavLink  onClick={()=>setshowMenu(false)} to='/'><p className='px-4 py-2 rounded full inline-block'>HOME</p></NavLink>
                    <NavLink  onClick={()=>setshowMenu(false)} to='/doctors'><p className='px-4 py-2 rounded full inline-block'>ALL DOCTORS</p></NavLink>
                    <NavLink  onClick={()=>setshowMenu(false)} to='/about'><p className='px-4 py-2 rounded full inline-block'>ABOUT</p></NavLink>
                    <NavLink  onClick={()=>setshowMenu(false)} to='/contact'><p className='px-4 py-2 rounded full inline-block'>CONTACT</p></NavLink>
                </ul>
            </div>
           
            </div>
    </div>
  )
}

export default Navbar