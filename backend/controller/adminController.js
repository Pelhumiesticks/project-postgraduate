import validator from "validator"
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import caregiverModel from "../models/caregiverModel.js"
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"



//API for adding caregivers
const addCaregiver = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file;

        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: 'Please fill in all fields' });
        }

        // Email validation
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: 'Please enter a valid email format' });
        }

        // Password validation
        if (password.length < 8) {
            return res.json({ success: false, message: 'Please enter a strong password' });
        }

        // Hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Uploading to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
        const imageUrl = imageUpload.secure_url;

        const caregiverData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now(),
        };

        const newCaregiver = new caregiverModel(caregiverData);
        await newCaregiver.save();

        res.json({ success: true, message: 'Caregiver added successfully' });

    } catch (error) {
        console.log(error);
        return res.json({ success: false, message: error.message });
    }
}

//API for admin login
const loginAdmin = async (req, res) =>{
    try {
        const {email, password} = req.body

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password, process.env.JWT_SECRET)
            return res.json({success:true,token})

        } else{
          return res.json({success:false,message:"invalid email or password"})
        }

    } catch (error) {
        console.log(error);
        return res.json({success:false,message: error.message})
    }
}

//API for admin add-caregiver

const allCaregivers =async (req, res) => {
    try {
        const caregivers = await caregiverModel.find({}).select('-password')
        res.json({ success:true, caregivers })

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to get all users

const allUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password')
        res.json({ success:true, users })

    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

//API to get all appointment list
const appointmentsAdmin = async (req, res) =>{
    try {

        const appointments = await appointmentModel.find({})
        res.json({success:true, appointments})

        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:error.message})
    }
}

// API to cancel appointment

const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled:true})

        // releasing doctors slot
        const {docId, slotDate, slotTime} = appointmentData
        const docData = await caregiverModel.findById(docId)
        let slots_booked = docData.slots_booked
        slots_booked[slotDate] = slots_booked[slotDate].filter(time => time!== slotTime)

        await caregiverModel.findByIdAndUpdate(docId, {slots_booked})
        res.json({success: true, message: 'Appointment Cancelled'})

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}

//API to get dashboard data for admin

const adminDashboard = async (req, res) => {

    try {

        const caregivers = await caregiverModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            caregivers : caregivers.length,
            appointments : appointments.length,
            patients : users.length,
            latestAppointment : appointments.reverse().slice(0, 5)
        }

        res.json({success: true, dashData})
        
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message})
        
    }
}

export {addCaregiver, loginAdmin, allCaregivers, appointmentsAdmin, appointmentCancel, adminDashboard, allUsers}