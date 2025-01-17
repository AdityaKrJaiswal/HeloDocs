import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { assets } from '../assets/assets_frontend/assets'
import axios from 'axios'
import { toast } from 'react-toastify'
import {useNavigate} from 'react-router-dom'

const Myappointment = () => {
  const {backendUrl,token,getDoctorsData} = useContext(AppContext)
  const [appointment,getAppointment] = useState([])
  const navigate = useNavigate()

  const months = ['','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  const getUserAppointment = async()=>{
    try {
      const {data}  =  await axios.get(backendUrl+'/api/user/appointments',{headers:{token}})
      if(data.success){
        getAppointment(data.appointments.reverse())
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const cancelAppointment = async(appointmentId)=>{
    try{

      const {data} = await axios.post(backendUrl+'/api/user/cancel-appointment',{appointmentId},{headers:{token}})
      if(data.success){
        toast.success(data.message)
        getUserAppointment()
        getDoctorsData() // To update doctor's appointment list when appointment is canceled
      }else{
        toast.error(data.message)
      }

    }catch(error){
      console.log(error);
      toast.error(error.message)
    }
  }

  const initPay = (order)=>{
    const options = {
      key:import.meta.env.VITE_RAZORPAY_KEY_ID,
      currency: order.currency,
      amount: order.amount,
      name:'Appointment Payment',
      description:'Appointment Payment',
      order_id: order.id,
      receipt:order.receipt,
      handler: async(response)=>{
        console.log(response);
        try {
          const {data} = await axios.post(backendUrl+'/api/user/verifyRazorpay',response,{headers:{token}})
          console.log(data);
          if(data.success){
            getUserAppointment()
            navigate('/myappointment')
          }
        } catch (error) {
          console.log(error)
          toast.error(error.message)
        }
      }
    }
    const rzp = new window.Razorpay(options);
    rzp.open();
  }

  const appointmentRazorpay = async (appointmentId)=>{
    try{
      const {data} = await axios.post(backendUrl+'/api/user/payment-razorpay',{appointmentId},{headers:{token}})

      if(data.success){
        initPay(data.order)
        // console.log(data.order)
        // Redirect to razorpay payment gateway
        // window.location.href = data.paymentLink
      }else{
        toast.error(data.message)
      }
    }catch(error){
      console.log(error);
      toast.error(error.message)
    }
     
  }
  useEffect(()=>{
    if(token){

      getUserAppointment()
    }
  },[token])
  return (
    <div>
      <p className='pb-3 mt-12 font-medium text-zinc-700 border-b'>My Appointment</p>
      <div>
        {
          appointment.map((item,index)=>(
            <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b ' key={index}>
              <div>
                <img className='w-32 bg-indigo-100' src={item.docData.image} alt="" />
              </div>
              <div className='flex-1 text-sm  text-zinc-600'>
                <p className='text-neutral-500 font-semibold'>{item.docData.name}</p>
                <p>{item.docData.speciality}</p>
                <p className='text-zinc-700 font-medium mt-1'>Address:</p>
                <p className='text-xs'>{item.docData.address.line1}</p>
                <p className='text-xs'>{item.docData.address.line2}</p>
                <p className='text-xs mt-1'><span className='text-neutral-500 font-medium text-sm' >Date & Time</span> {slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div></div>
              <div className='flex flex-col gap-2 justify-end'>
                {!item.cancelled && item.payment && !item.isCompleted && <button className='sm:min-w-48 py-2 border rounded text-stone-500 bg-indigo-50'>Paid</button>}
                {!item.cancelled && !item.payment && !item.isCompleted &&  <button onClick={()=>appointmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-primary hover:text-white transition-all duration-300'>Pay online</button>} 
                {!item.cancelled && !item.isCompleted &&  <button onClick={()=>cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border rounded hover:bg-red-500 hover:text-white transition-all duration-300'>Cancel Appointment</button> }
                {item.cancelled && !item.isCompleted&& <button className='sm:min-w-48 py-2 border border-red-500 rounded text-red-500'>Appointment Cancelled</button>}
                {item.isCompleted && <button className='sm:min-w-48 py-2 border border-green-500 rounded  text-green-500'>Completed</button>}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Myappointment