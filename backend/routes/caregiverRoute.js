import express from 'express'
import { cancelAppointment, caregiverAppointments, caregiverDashboard, caregiverLogins, caregiverProfile, doctorList, markAppointment, updateCaregiverProfile } from '../controller/caregiverController.js'
import authCaregiver from '../middlewares/authCaregiver.js'

const doctorRouter = express.Router()


doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', caregiverLogins)
doctorRouter.get('/appointments', authCaregiver, caregiverAppointments)
doctorRouter.post('/mark-appointment', authCaregiver, markAppointment)
doctorRouter.post('/cancel-appointment', authCaregiver, cancelAppointment)
doctorRouter.get('/dashboard', authCaregiver, caregiverDashboard)
doctorRouter.get('/profile', authCaregiver, caregiverProfile)
doctorRouter.post('/update-profile', authCaregiver, updateCaregiverProfile)

export default doctorRouter