import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext  = createContext();


const AdminContextProvider = (props) => {
    const [atoken,setAToken] = useState(localStorage.getItem("aToken") || "");
    const [doctors,setDoctors] = useState([])
    const [appointments,setAppointments] = useState([])
    const [dashData,setDashData] = useState(false);
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async ()=>{
        try{
            // console.log("hello1")
            // console.log(atoken);
            const {data} = await axios.post(backendUrl+'/api/admin/all-doctors',{},{headers:{atoken}})
            console.log(data)
            if(data){
                console.log("hello")
                setDoctors(data.doctors)
                console.log("hello")

                console.log(data.doctors)
            }else{
                console.log(err)
                toast.error(data.message)
            }
        }catch(error){
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId)=>{
        try{
            const {data} = await axios.post(backendUrl+'/api/admin/change-availability',{docId},{headers:{atoken}})
            // console.log("hello1")
            console.log(data)
            if(data.success){
                toast.success(data.message)
                getAllDoctors();
            }else{
                toast.error(data.message)
            }
        }catch(err){
            toast.error(err.message)
        }
    }

    const getAllAppointments = async ()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/admin/appointments',{headers:{atoken}})
            console.log(data)
            if(data.success){
                setAppointments(data.appointments)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppointment = async (appointmentId)=>{
        try {
            const {data} = await axios.post(backendUrl+'/api/admin/cancel-appointment',{appointmentId},{headers:{atoken}})
            if(data.success){
                toast.success(data.message)
                getAllAppointments();
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getDashData = async()=>{
        try {
            const {data} = await axios.get(backendUrl+'/api/admin/dashboard',{headers:{atoken}})
            if(data.success){
                setDashData(data.dashData)
                console.log(data.dashData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    const value ={
        atoken,setAToken,backendUrl,doctors,getAllDoctors,changeAvailability,getAllAppointments,appointments,setAppointments,cancelAppointment,dashData,getDashData
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider;