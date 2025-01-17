import React from 'react';
import { assets } from '../assets/assets_frontend/assets';

const Contact = () => {
  return (
    <div className='mt-24'>
      <div className='text-center text-2xl content-10 text-gray-500'>
        CONTACT US
      </div>

      <div className='flex flex-col my-10 justify-center md:flex-row gap-10 mb-28 text-sm'>
        <img
          className='w-full md:max-w-[360px] rounded-lg'
          src={assets.contact_image}
        />
        <div className='flex flex-col justify-center items-start gap-8  rounded-lg'>
          <p className='font-semibold text-lg text-gray-600'>OUR OFFICE</p>
          <p className='text-gray-500'>
            54709 near Shiv Temple <br />
            Sector 62, Noida, Uttar Pradesh, INDIA
          </p>
          <p className='text-gray-500'>Tel: +91 9867489276</p>
          <p className='text-gray-500'>Email: abc@gmail.com</p>
          <p className='font-semibold text-lg text-gray-600'>
            Careers at PRESCRIPTO
          </p>
          <p className='text-gray-500'>
            Learn more about our teams and job openings.
          </p>
          <button className='border border-black px-8 py-4 text-sm hover:bg-black hover:text-white hover:scale-110 transition-all duration-300'>
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;