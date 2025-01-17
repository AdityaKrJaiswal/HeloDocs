import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'



const addDoctor = async (req,res)=>{
    try{
        const {name,email,password,speciality,degree,experience,about,fees,address} = req.body;
        const imageFile = req.file
        // console.log({name,email,password,speciality,degree,experience,about,fees,address},imageFile)
        if(!name ||!email ||!password ||!speciality||!degree||!experience||!about||!fees||!address){
            return res.status(400).json({msg: 'Please fill all fields'})
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({msg: 'Invalid email'})
        }

        if(password.length<8){
            return res.status(400).json({msg: 'Password must be at least 8 characters long'})
        }

        //hashing doctor password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        //upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type: "image"});
        const imageUrl =  imageUpload.secure_url;

        //create new doctor object
        const DoctorData = {
            name,
            email,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address:JSON.parse(address),
            image: imageUrl,
            date:Date.now()
        }

        const newDoctor = new doctorModel(DoctorData)
        await newDoctor.save()

        res.json({msg: 'Doctor added successfully'})
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

const loginAdmin = async (req, res) => {
    try {
        const {email, password} = req.body
        if(email===process.env.ADMIN_EMAIL && password===process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            res.json({success: true, token})
        }else{
            res.status(403).json({message:"Invalid email or password"})
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message })
    }
}

//api to fetch all doctors list
const allDoctors = async (req,res)=>{
    try{
        const doctors = await doctorModel.find({}).select('-password')
        console.log(doctors)
        res.json({success:true,doctors})
    }catch(err){
        console.log(err)
        res.status(500).json({message: err.message})
    }
}

//api to get all appointment lists
const appointmentsAdmin = async (req,res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.status(500).json({message: error.message})
    }
} 
//api to cancel appointment
const appointmentCancel = async (req,res)=>{
    try {
        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        //verify appointment user
       

        await appointmentModel.findByIdAndUpdate(appointmentId,{cancelled:true})
        //releasing doctor slot

        const {docId,slotDate,slotTime} = appointmentData;
        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(e=>e!==slotTime)
        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success:true,message:'Appointment cancelled'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const adminDashboard = async (req,res)=>{
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})
    } catch (error) {
        console.log(error.message)
        res.json({success:false,message:error.message})
    }
}

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard}