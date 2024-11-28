import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div>
        <div className='text-center text-2xl pt-10 text-gray-500'>
        <p>ABOUT <span className='text-gray-700 font-medium'>US</span></p>
        </div>

        <div className='my-10 flex flex-col md:flex-row gap-12'> 
          <img className='w-full md:max-w-[360px]' src={assets.about_image} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w2/4 text-sm text-gray-600'>
            <p className='text-lg'>Welcome to ZKL Health-care services, your trusted partner in managing your healthcare needs Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur ratione, ipsa itaque culpa laborum ipsum repellat neque aperiam blanditiis deserunt?</p>
            <p className='text-lg'>ZKL is commited to excellence in healthcare technology, Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugiat dolorem nobis illo assumenda odit porro!</p>
            <b className='text-gray-800 text-2xl'>Our Vision</b>
            <p className='text-lg'>Our Vision at ZKL is to create a seamless healthcare experience for all our clients Lorem ipsum dolor sit, amet consectetur adipisicing elit. Architecto necessitatibus impedit aliquam! Esse, natus minus!</p>
          </div>
        </div>

        <div className='text-xl my-4 text-center'>
          <p>WHY <span className='text-gray-700 font-semibold'>CHOOSE US</span></p>
        </div>

        <div className='flex flex-col md:flex-row mb-20'>
          <div className='border px-10 md:px-16 py-8 sm:py-8 flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
            <b>EFFICIENCY</b>
            <p>Streamlined appointment schedulling that fits into your busy lifestyle</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-8 flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>CONVINIENCE</b>
          <p>Access to a network of trusted healthcare professionals in your area</p>
          </div>
          <div className='border px-10 md:px-16 py-8 sm:py-8 flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transition-all duration-300 text-gray-600 cursor-pointer'>
          <b>PERSONALIZATION</b>
          <p>Tailored recommendation and reminders to help you stay on top of your health.</p>
          </div>
        </div>
    </div>
  )
}

export default About