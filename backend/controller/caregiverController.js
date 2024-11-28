import caregiverModel from "../models/caregiverModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";


const changeAvailability = async (req, res) => {
    try {
        
        const {docId} = req.body
        const docData = await caregiverModel.findById(docId)
        await caregiverModel.findByIdAndUpdate(docId, {available: !docData.available})
        res.json({success:true, message: "Availability status updated"})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

const doctorList = async (req, res) => {
    try {
        const doctors = await caregiverModel.find({}).select(['-password', '-email'])

        res.json({success: true, doctors})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API for caaregiver logins
const caregiverLogins = async (req, res) => {
    try {
        const {email, password} = req.body
        const caregiver = await caregiverModel.findOne({email})

        if(!caregiver) {
            return res.json({success: false, message: 'caregiver not found' });
        }

        const isMatch = await bcrypt.compare(password, caregiver.password)
        
        if (isMatch) {

            const token = jwt.sign({id: caregiver._id}, process.env.JWT_SECRET)
            return res.json({success:true, token})  

        } else {
            return res.json({success: false, message: 'invalid email or password'});

        }
        
    } catch (error) {
        
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get caregiver appointments for caregiver panel
const caregiverAppointments = async (req, res) => {
    try {
        const {docId} = req.body
        const appointments = await appointmentModel.find({docId})

        res.json({success: true, appointments})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to mark user appointment for caregiver panel

const markAppointment = async (req, res) => {

    try {
        const {docId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted: true})
             return res.json({success: true, message: 'Appointment completed'})
            
        } else {
            return res.json({success: false, message: 'Invalid appointment or caregiver'})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}
// API to cancel user appointment for caregiver panel

const cancelAppointment = async (req, res) => {

    try {
        const {docId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
             return res.json({success: true, message: 'Appointment cancelled'})
            
        } else {
            return res.json({success: false, message: 'Cancelled unsuccessful'})
        }
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

// API to get dashboard data for caregiver panel
const caregiverDashboard = async (req, res) => {
    try {
        

        const {docId} = req.body

        const appointments = await appointmentModel.find({docId})

        let earnings = 0

        appointments.map((item)=> {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
                
            }
        })

        let patients = []
        appointments.map((item)=> {

            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
            
        })

        const dashData = {
            earnings,
            appointments : appointments.length,
            patients : patients.length,
            latestAppointment : appointments.reverse().slice(0, 5)
        }
        res.json({success: true, dashData}) 

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
        
    }
}

// API to get caregiver profile from panel

const caregiverProfile = async (req, res) => {

    try {

        const {docId} = req.body
        const profileData = await caregiverModel.findById(docId).select('-password')
        res.json({success: true, profileData})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to update caregiver profile from panel

const updateCaregiverProfile = async (req, res) => {

    try {
        
        const {docId, fees, address, available} = req.body

        await caregiverModel.findByIdAndUpdate(docId,{fees, address, available})
        res.json({success: true, message: 'Profile updated successfully'})

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}



export {changeAvailability, doctorList, caregiverLogins, caregiverAppointments, cancelAppointment, markAppointment, caregiverDashboard, caregiverProfile, updateCaregiverProfile, }