import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Doctors from './pages/Doctors'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Appointments from './pages/Appointments'
import Contact from './pages/Contact'
import UserAppointments from './pages/UserAppointments'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import ResetPassword from './pages/ResetPassword'
import PasswordResetRequest from './pages/PasswordResetRequest'

const App = () => {
  return (
    <div className='px-5 md:px-20'>
      <ToastContainer />  
      <Navbar />
      <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/about' element={<About />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/login' element={<Login />} />
          <Route path='/appointment/:docId' element={<Appointments />} />
          <Route path='/user-appointments' element={<UserAppointments />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/reset-password' element={<ResetPassword />} />
          <Route path='/password-reset-request' element={<PasswordResetRequest />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App