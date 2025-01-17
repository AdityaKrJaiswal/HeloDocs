import { formToJSON } from 'axios'
import React, { useContext } from 'react'
import { assets } from '../../assets/assets_admin/assets'
import {AdminContext} from "../../context/AdminContext"
import { useState } from 'react'
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctors = () => {

  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experience, setExperience] = useState('1 Year');
  const [fees, setFees] = useState('');
  const [about, setAbout] = useState('');
  const [speciality, setSpeciality] = useState('General physician');
  const [degree, setDegree] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');

  const {atoken,backendUrl} = useContext(AdminContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      if(!docImg) {
        toast.error('Image not selected!')
      }
      const formData = new FormData()
      formData.append('image', docImg);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('experience', experience);
      formData.append('fees', Number(fees));
      formData.append('about', about);
      formData.append('speciality', speciality);
      formData.append('degree', degree);
      formData.append('address', JSON.stringify({ line1: address1, line2: address2 }));

      // console log formData
      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const {data} = await axios.post(backendUrl + '/api/admin/add-doctor',formData,{headers:{atoken}})
      // console.log(data);
      if(data) {
        // console.log("Hello")
        toast.success(data.message)
        setDocImg(false);
        setName('');
        setPassword('');
        setEmail('');
        setAddress1('');
        setAddress2('');
        setDegree('');
        setAbout('');
        setFees('');
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
      console.log(error)
    } 
  }

  return (
    <form onSubmit={onSubmitHandler}  className='m-5 w-full'>
      <p className="mb-3 text-lg font-medium">Add Doctor</p>
      <div  className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[60vh] overflow-y-scroll">
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor='doc-img'>
            <img  className="w-16 bg-gray-100 cursor-pointer rounded-full" src={docImg?URL.createObjectURL(docImg):assets.upload_area} alt="" />

          </label>
          <input onChange={(e)=>setDocImg(e.target.files[0])} type="file" id='doc-img' hidden className='border rounded px-3 py-4'/>
          <p>Upload Doctor <br/> Picture </p>
        </div>
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input onChange={(e)=>setName(e.target.value)} value = {name}  type="text" placeholder='Name' required  className="px-3 py-2 border rounded" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input onChange={(e)=>setEmail(e.target.value)} value = {email} type="email" placeholder='email' required  className="px-3 py-2 border rounded" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Password</p>
              <input onChange={(e)=>setPassword(e.target.value)} value = {password} type="password" placeholder='password' required  className="px-3 py-2 border rounded" />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select onChange={(e)=>setExperience(e.target.value)} value={experience}   className="px-3 py-2 border rounded" name="" id="">
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Years</option>
                <option value="3 Year">3 Years</option>
                <option value="4 Year">4 Years</option>
                <option value="5 Year">5 Years</option>
                <option value="6 Year">6 Years</option>
                <option value="7 Year">7 Years</option>
                <option value="8 Year">8 Years</option>
                <option value="9 Year">9 Years</option>
                <option value="10 Year">10 Years</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>fees</p>
              <input onChange={(e)=>setFees(e.target.value)} value={fees} type="number" placeholder='fees' required className='border rounded px-3 py-4'/>
            </div>
            
          </div>
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <p>Specialization</p>
              <select onChange={(e)=>setSpeciality(e.target.value)} value={speciality} name="" id="" className="px-3 py-2 border rounded">
              <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <p>Education</p>
              <input onChange={e=>setDegree(e.target.value)}  value={degree} type="text" placeholder='Education' required className='border rounded px-3 py-4'/>
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <p>Address</p>
              <input  onChange={(e)=>setAddress1(e.target.value)} value={address1} type="text" placeholder='Address 1' required  className="px-3 py-2 border rounded"/>
              <input onChange={(e)=>setAddress2(e.target.value)} value={address2} type="text" placeholder='Address 2' required className="px-3 py-2 border rounded"/>
            </div>

          </div>
        </div>
        <div >
              <p className='mt-4 mb-2'>About Doctor</p>
              <textarea onChange={(e)=>setAbout(e.target.value)} value={about} rows={5} placeholder='About' required className="w-full px-3 py-2 border rounded"/>
            </div>
            <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full">Add Doctor</button>
      </div>
    </form>
  )
}

export default AddDoctors