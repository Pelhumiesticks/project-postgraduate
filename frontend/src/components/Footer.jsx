import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='md:mx-10'>
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm '>
            {/* Left section */}
            <div>
                <img className='mb-5 w-40' src={assets.jkl} alt="" />
                <p className='w-full md:w-2/3 text-gray-600 leading-6'>JkL HealthCare service is Lorem ipsum dolor, sit amet consectetur adipisicing elit. Id accusamus a ullam possimus necessitatibus! Voluptatibus qui, unde voluptate deleniti vero neque, rerum officia iusto tempora quam quos, repellendus vel commodi.</p>
            </div>
            {/* center section */}
            <div>
                <p className='text-xl font-medium mb-5 text-gray-800'>Company</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>Home</li>
                    <li>About Us</li>
                    <li>Contact Us</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            {/* right section */}
            <div>
                <p className='text-xl font-medium mb-5 text-gray-800'>Get In Touch</p>
                <ul className='flex flex-col gap-2 text-gray-600'>
                    <li>+233-816-263-8910</li>
                    <li>johnbabatunde43@gmail.com</li>
                </ul>
            </div>
        </div>
            {/* copy right section */}
        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2024 @JKL Healthcare service - All Right Reserved</p>
        </div>
    </div>
  )
}

export default Footer