import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { useEffect } from 'react';
import { assets } from '../assets/assets_frontend/assets';
import RelatedDoctor from '../components/RelatedDoctor';
import { ToastContainer,toast } from 'react-toastify';
import axios from 'axios';

const Appointment = () => {
    const {docId} = useParams();
    const {doctors,currencySymbol,backendUrl,token,getDoctorsData} = useContext(AppContext)
    const navigate = useNavigate();
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat','Sun']
    const [docInf,setDocInfo] = useState(null);
    const [docSlot,setDocSlot] = useState([])
    const [slotIndex,setSlotIndex] = useState(0)
    const [slotTime,setSlotTime] = useState('')
    const fetchDocInfo =  async ()=>{
        const docInfo = await doctors.find(doc => doc._id === docId)
        setDocInfo(docInfo)
        // console.log(docInfo)
    }

    const getAvailableSlot = () => {
        if (!docInf?.slots_booked) return;
    
        const today = new Date();
        const newSlots = []; // Temporary array to batch updates
    
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(today);
            currentDate.setDate(today.getDate() + i);
    
            const endTime = new Date(currentDate);
            endTime.setHours(21, 0, 0, 0);
    
            // Adjust start time based on the current day
            if (i === 0) {
                currentDate.setHours(Math.max(today.getHours() + 1, 10), today.getMinutes() > 30 ? 30 : 0, 0, 0);
            } else {
                currentDate.setHours(10, 0, 0, 0);
            }
    
            const daySlots = [];
            while (currentDate < endTime) {
                const formattedTime = currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
                const slotDate = `${currentDate.getDate()}_${currentDate.getMonth() + 1}_${currentDate.getFullYear()}`;
    
                // Check availability
                const isSlotAvailable = !docInf.slots_booked[slotDate]?.includes(formattedTime);
    
                if (isSlotAvailable) {
                    daySlots.push({
                        datetime: new Date(currentDate),
                        time: formattedTime,
                    });
                }
    
                // Increment by 30 minutes
                currentDate.setMinutes(currentDate.getMinutes() + 30);
            }
    
            newSlots.push(daySlots);
        }
    
        setDocSlot(newSlots); // Batch state update
    };
    


    const bookAppointment = async () => {
        if(!token) {
          toast.warn('Login to book appointment')
          return navigate('/login')
        }
    
        try {
          const date = docSlot[slotIndex][0].datetime
          let day = date.getDate()
          let month = date.getMonth()+1
          let year = date.getFullYear()
    
          const slotDate = day + "_" + month + "_" + year 
          // console.log(slotDate)
          const {data} = await axios.post(backendUrl+'/api/user/book-appointment',{docId,slotDate,slotTime},{headers:{token}})
          if(data.success) {
            toast.success(data.message)
            getDoctorsData()
            navigate('/myappointment')
          } else {
            toast.error(data.message)
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    

    useEffect(()=>{
        fetchDocInfo()
    },[doctors,docId])

    useEffect(()=>{
        getAvailableSlot();
    },[docInf])

    // useEffect(()=>{
    //     console.log(docSlot)
    // },[docSlot])
  return docInf && (
    <div>
        <div className='flex flex-col sm:flex-row  gap-4'>
            <div>
                <img src={docInf.image} alt="" className='bg-primary w-full sm:max-w-72  rounded-lg'/>
            </div>
            <div className='flex-1 border border-gray-600 rounded-lg p-8 py-7  bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0 '>
                
                    <p className='flex items-center gap-2 text-2xl font-medium text-gray-900'>{docInf.name}
                     <img src={assets.verified_icon} alt="" className='w-5'/>
                    </p>
                    <div className='flex items-center gap-2 text-sm mt-1 text-gray-600'>
                        <p>{docInf.degree}-{docInf.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{docInf.experience}</button>
                    </div>

                    <div>
                        <p className='flex items-center text-sm gap-1 font-medium mt-3 text-gray-600'>About <img src={assets.info_icon} alt=''></img></p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1 '>{docInf.about}</p>
                    </div>

                    <p className='text-gray-500 font-medium mt-4 '>
                        Appointment fee: <span className='text-gray-600 '>{currencySymbol}{docInf.fees}</span>
                    </p>
                    
                
            </div>
        </div>

        <div className='sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700 '>
            <p>Booking Slots</p>
            <div className='flex gap-3 items-center w-full overflow-x-scroll mt-4'>
                {
                    docSlot.length && docSlot.map((item,index)=>(
                        <div onClick={()=>setSlotIndex(index)} className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex===index ?"bg-primary text-white":'border border-gray-200'}`} key={index}>
                            <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                            <p>{item[0] && item[0].datetime.getDate()}</p>
                        </div>
                    ))
                }
            </div>
            <div className='flex items-center gap-3 w-full overflow-x-scroll mt-4 '>
                {
                    docSlot.length && docSlot[slotIndex].map((item,index)=>(
                        <p onClick={()=>setSlotTime(item.time)} className={`text-sm font-light flex-shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time===slotTime?"bg-primary text-white":"text-gray-400 border border-gray-300"}`} key={index}>{item.time.toLowerCase()}</p>
                    ))
                }
            </div>
            <button onClick={bookAppointment} className='bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6'>Book an Appointment</button>
        </div>
        <RelatedDoctor docId = {docId} speciality={docInf.speciality}/>
    </div>
  )
}

export default Appointment