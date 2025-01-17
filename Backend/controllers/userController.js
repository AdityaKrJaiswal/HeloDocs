import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import {v2 as cloudinary} from 'cloudinary'
import razorpay from 'razorpay'


//api to register
const registerUser = async (req,res)=>{
    try {
        const {name,email,password} = req.body;
        if(!name || !email || !password){
            return res.json({success:false,message:"Missing Details"})
        }
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid Email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Password should be at least 8 characters long"})
        }

        //hashing password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        //_id get
        const token = jwt.sign({id:user.id},process.env.JWT_SECRET)

        res.json({success:true,token})




    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,message: error.message})
    }
}

const loginUser = async (req,res)=>{
    try {
        const {email,password} = req.body;
        const user = await userModel.findOne({email: email})

        if(!user){
            return res.json({success:false,message:"user not found"})
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch){
            res.json({success:false,message:"Invalid password"})
        }else{
            const token = jwt.sign({id:user._id},process.env.JWT_SECRET)
            res.json({success:true,token})

        }
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const getProfile = async (req,res)=>{
    try{
        const {userId} = req.body;
        const userData = await userModel.findById(userId).select('-password');
        res.json({success:true,userData})
    }catch(error){
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

//api to update user profile
const updateProfile = async (req,res)=>{
    try {
        const {userId,name,phone,address,dob,gender} = req.body;
        const imageFile = req.file

        if(!name || !phone  || !dob || !gender){
            return res.status(400).json({success:false,message:"Please fill all fields"})
        }
        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})
        if(imageFile){
            //upload image 
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageUrl = imageUpload.secure_url
            await userModel.findByIdAndUpdate(userId,{image: imageUrl})
        }
        res.json({success:true,message:"Profile updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}

//api to book appointment
const bookAppointment = async (req,res) => {
    try {  
        const { userId, docId, slotDate, slotTime } = req.body;

        const docData = await doctorModel.findById(docId).select('-password');
        console.log(docData.available)
        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor not available' });
        }

        let slots_booked = docData.slots_booked;
        console.log(slots_booked)

        // checking for slot availability
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot not available' });
            } else {
                slots_booked[slotDate].push(slotTime);
            }
        } else {
            slots_booked[slotDate] = [];
            slots_booked[slotDate].push(slotTime);
        } 
        
        const userData = await userModel.findById(userId).select('-password');

        delete docData.slots_booked;

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        };

        const newAppointment = new appointmentModel(appointmentData);
        await newAppointment.save();

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({success:true,message:'Appointment Booked'});

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const listAppointment = async (req,res) => {
    try {
        const {userId} = req.body
        // console.log(userId)
        const appointments = await appointmentModel.find({userId})
        // console.log(appointments)
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}


const cancelAppointment = async (req,res)=>{
    try {
        const {userId,appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)
        //verify appointment user
        if(appointmentData.userId !== userId){
            return res.json({success:false,message:'Unauthorized'})
        }

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

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
    amount: 10000, 
    currency: "INR"  
})

const paymentRazorpay = async (req,res)=>{
    try {
        const {appointmentId} = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId)
        if(!appointmentData || appointmentData.cancelled){
            return res.json({success:false,message:'Invalid appointment'})
        }
    
        //creating option for razorpay payment
        const options ={
            amount:appointmentData.amount*100,
            currency: "INR",
            receipt : appointmentId
        }
    
        //creation of an order
        const order = await razorpayInstance.orders.create(options);
        // console.log(order)
        res.json({success:true,order})
        
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message})
    }
}
//api to verify payment
const verifyRazorpay = async (req,res)=>{
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        console.log("hello1")
        // console.log("orderInfo: " + orderInfo)
        
        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt,{payment:true})
            res.json({success:true,message:"payment successful"})
            
        }else{
            res.json({success:false,message:"payment failed"})
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {registerUser,loginUser,getProfile,updateProfile,bookAppointment,listAppointment,cancelAppointment,paymentRazorpay,verifyRazorpay}