import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {AppContext} from '../context/AppContext'


const Doctors = () => {
  const {speciality} = useParams();
  const navigate = useNavigate();
  const [showFilter, setShowFilter] =useState(false)

  const [filterDoc, setFilterDoc] = useState([]);
  
  const {doctors} = useContext(AppContext)

  const applyFilter =() => {
    if (speciality) {
      setFilterDoc(doctors.filter(doc => doc.speciality.toLowerCase() === speciality.toLowerCase()));
    }else {
      setFilterDoc(doctors)
    }
      
  }

  useEffect(()=>{
    applyFilter()
  },[doctors,speciality])
  return (
    <div>
        <p className='text-gray-600'>Browse through the caregivers specialist</p>
        <div className='flex flex-col sm:flex-row items-start gap-5 mt-5'>
          <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? 'bg-primary text-white' : ''}`} onClick={()=> setShowFilter(prev => !prev)}>Filters</button>
          <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? 'flex' : 'hidden sm:flex'}`}>
            <p onClick={()=> speciality === 'Family caregiver' ? navigate('/doctors') : navigate('/doctors/Family caregiver')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Family caregiver' ? 'bg-indigo-100 text-black' : ''}`}>Family caregiver</p>
            <p onClick={()=> speciality === 'Volunteer caregiver' ? navigate('/doctors') : navigate('/doctors/Volunteer caregiver')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Volunteer caregiver' ? 'bg-indigo-100 text-black' : ''}`}>Volunteer caregiver</p>
            <p onClick={()=> speciality === 'Independent caregiver' ? navigate('/doctors') : navigate('/doctors/Independent caregiver')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Independent caregiver' ? 'bg-indigo-100 text-black' : ''}`}>Independent caregiver</p>
            <p onClick={()=> speciality === 'Professional Caregiver' ? navigate('/doctors') : navigate('/doctors/Professional Caregiver')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Professional Caregiver' ? 'bg-indigo-100 text-black' : ''}`}>Professional Caregiver</p>
            <p onClick={()=> speciality === 'General physician' ? navigate('/doctors') : navigate('/doctors/General physician')} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'General physician' ? 'bg-indigo-100 text-black' : ''}`}>General physician</p>
            <p onClick={()=> speciality === 'Companion caregiver' ? navigate('/doctors') : navigate('/doctors/Companion caregiver')} className={`w-full sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === 'Companion caregiver' ? 'bg-indigo-100 text-black' : ''}`}>Companion caregiver</p>
          </div>
          <div className='w-full grid grid-cols-auto gap-4 gap-y-6'>
            {
              filterDoc.map((item, index)=>(
                <div onClick={()=>navigate(`/appointment/${item._id}`)} className='border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={item._id}>
                        <img className='bg-blue-100' src={item.image} alt="" />
                        <div className='p-4'>
                        <div className={`flex items-center gap-2 text-sm text-center ${item.available ? 'text-green-500' : 'text-red-500'} `}>
                             <p className={`w-2 h-2 ${item.available ? 'bg-green-500' : 'bg-red-500'}  rounded-full`}></p><p>{item.available ? 'Available' : 'Unavailable'}</p>
                         </div>
                            <p className='text-gray-900 text-lg font-medium '>{item.name}</p>
                            <p className='text-gray-600 text-sm'>{item.speciality}</p>
                        </div>
                 </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default Doctors