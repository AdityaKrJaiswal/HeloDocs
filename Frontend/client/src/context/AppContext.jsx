import { createContext, useState } from "react";
import { doctors } from "../assets/assets_frontend/assets";
import axios from 'axios'
import { toast } from "react-toastify";
import { useEffect } from "react";


export const AppContext = createContext()

const AppContextProvider = (props)=>{
    const [doctors,setDoctors] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token") || "");
    const [userData,setUserData] = useState(false)
    const currencySymbol ='$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    
    const getDoctorsData  = async ()=>{
        try{
            // console.log("hello1")
            const {data} = await axios.get(backendUrl+'/api/doctor/list')
            
            if(data){
                // console.log(data)
                // console.log("hello2")
                setDoctors(data.doctors)
                // console.log(data.doctors)
            }else{
                toast.error(data.message)
            }
        }catch(err){
            console.log(err.message)
            toast.error(err.message)
        }
    }

    const loadUserProfileData = async (req,res)=>{
        try{
            const {data} = await axios.get(backendUrl+'/api/user/get-profile',{headers:{token}})
            if(data.success){
                setUserData(data.userData)
            }else{
                toast.error(data.message)
            }
        }catch(error){
            console.log(error)
            toast.error(error.message)
        }
    }

    

    const value = {
        doctors,currencySymbol,getDoctorsData,token,setToken,backendUrl,userData,setUserData,loadUserProfileData
    }

    useEffect(()=>{
        if(token){
            loadUserProfileData()
        }else{
            setUserData(false)
        }
    },[token])

    useEffect(()=>{
        console.log("1")
        getDoctorsData();
    },[])

    useEffect(() => {
        if (userData) {
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    }, [userData]);

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;