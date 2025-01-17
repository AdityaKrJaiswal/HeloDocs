import React from 'react'
import { assets } from '../assets/assets_frontend/assets';

const whyChooseContent = [
  {
    header: 'Efficiency',
    content:
      'Streamlined appointment scheduling that fits into your busy lifestyle',
  },

  {
    header: 'Convenience',
    content:
      'Access to a network of trusted healthcare professionals in your area',
  },
  {
    header: 'Personalization',
    content:
      'Tailored recommendations and reminders to help you stay on top of your health',
  },
];

const WhyChooseEle = ({ header, content }) => {
  return (
    <div className='border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] text-gray-600 cursor-pointer hover:bg-primary hover:text-white transition-all duration-300'>
      <b>{header}:</b>
      <p>{content}.</p>
    </div>
  );
};

const About = () => {
  return (
    <div className='mt-24'>
      <div className='text-center text-2xl content-10 text-gray-500'>
        ABOUT US
      </div>
      <div className='my-10 flex flex-col md:flex-row gap-12 '>
        <img
          className='w-full md:max-w-[360px] '
          src={assets.about_image}
        />
        <div className='flex flex-col flex-1 justify-center gap-6 md:w-2/4 border border-gray-300 p-8 rounded-lg text-gray-600 text-justify'>
          <p>
            Welcome to Prescripto, your trusted partner in managing your
            healthcare needs conveniently and efficiently. At Prescripto, we
            understand the challenges individuals face when it comes to
            scheduling doctor appointments and managing their health records.
          </p>
          <p>
            Prescripto is committed to excellence in healthcare technology. We
            continuously strive to enhance our platform, integrating the latest
            advancements to improve user experience and deliver superior
            service. Whether you're booking your first appointment or managing
            ongoing care, Prescripto is here to support you every step of the
            way.
          </p>
          <b className='text-gray-800'>Our Vision</b>
          <p>
            Our vision at Prescripto is to create a seamless healthcare
            experience for every user. We aim to bridge the gap between patients
            and healthcare providers, making it easier for you to access the
            care you need, when you need it.
          </p>
        </div>
      </div>

      <div className='text-xl my-7 font-semibold'>
        <p>WHY CHOOSE US</p>
      </div>

      <div className='flex flex-col md:flex-row mb-20'>
        {whyChooseContent.map((item) => {
          return (
            <WhyChooseEle
              key={item.header}
              header={item.header}
              content={item.content}
            />
          );
        })}
      </div>
    </div>
  );
};

export default About;