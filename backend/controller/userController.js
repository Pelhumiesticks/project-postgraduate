import validator from "validator";
import bcrypt from 'bcrypt'
import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import {v2 as cloudinary} from 'cloudinary'
import caregiverModel from "../models/caregiverModel.js";
import appointmentModel from "../models/appointmentModel.js";
import transporter from "../config/mailer.js";



// API for user registration
const registerUser = async (req, res) => {
    try {
        const {name, email, password} = req.body

        if(!name || !email || !password) {
            return res.json({success: false, message: 'please fill the required' });
        }

        if (!validator.isEmail(email)) {
            return res.json({success: false, message: 'Please enter a valid email' });

        }
        if (password.length < 8) {
            return res.json({success: false, message: 'Please enter a strong password' });
        }

        // hashing the user password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,   
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
        res.json({success: true, token})
        

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}

// API for admin login
const loginUser = async (req, res) => {
    try {
        const {email, password} = req.body;
        
        if(!email || !password) {
            return res.json({success: false, message: 'Please fill in all fields' });
        }
        const user = await userModel.findOne({email})

        if(!user) {
            return res.json({success: false, message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            return res.json({success:true, token})
        } else {
            return res.json({success:false, message:"invalid email or password"})
        }
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}

// API to fetch user profile
const getProfile = async (req, res) => {
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')
        res.json({success: true, userData})

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}

// API to update user profile

const updateProfile = async (req, res) => {
    try {
        const {userId, name, phone, address, dob, gender} = req.body
        const imageFile = req.file;

        if (!name || !phone || !address || !dob || !gender) {
            return res.status(400).json({success: false, message: 'Data Missing' });
            
        }
        await userModel.findByIdAndUpdate(userId, {name, phone, address:JSON.parse(address), dob, gender})
        

        if(imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' });
            const imageUrl = imageUpload.secure_url;

            await userModel.findByIdAndUpdate(userId, {image: imageUrl})

        }
        res.json({success: true, message: 'Profile updated successfully'})

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}

// API to book user appointment with caregiver
const bookAppointment = async (req, res)=> {

    try {

        const {userId, docId, slotDate, slotTime} = req.body

        const docData = await caregiverModel.findById(docId).select('-password')

        if(!docData.available) {
            return res.json({success: false, message: 'Caregiver is not available at this time' });
        }

        let slots_booked = docData.slots_booked

        //checking if caregiver slot available
        if(slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({success: false, message: 'slot is not available at this time' });
            } else {
                slots_booked[slotDate].push(slotTime)
            } 
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentsData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentsData)

        await newAppointment.save()
        
        //  save new slots data in docdata
        await caregiverModel.findByIdAndUpdate(docId, {slots_booked})
        res.json({success: true, message: 'Appointment Booked'})
        
    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}

// fetching the API for user-appointment page(frontend)

const listAppointment = async (req, res) => {
    try {
        
        const {userId} = req.body
        const appointments = await appointmentModel.find({userId})

        res.json({success: true, appointments})

    } catch (error) {
        console.log(error);
        return res.json({success: false, message: error.message})
    }
}

// API to cancel appointment

const cancelAppointment = async (req, res) => {
    try {
        const {userId, appointmentId} = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData.userId!= userId) {
            return res.json({success: false, message: 'Unauthorized user' });
        }

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



const sendPasswordResetEmail = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await userModel.findOne({ email });
  
      if (!user) {
        return res.json({ success: false, message: 'User not found' });
      }
  
      const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Send email with reset link
      const resetLink = `https://pelstick-project-frontends.vercel.app/reset-password?token=${resetToken}`;
      const mailOptions = {
        from: 'babatund5@coventry.ac.uk',
        to: email,
        subject: 'Password Reset Request',
        html: `
        <p>Hello,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <a href="${resetLink}" style="color: blue; text-decoration: underline;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `
      };
  
      await transporter.sendMail(mailOptions);
      res.json({ success: true, message: 'Password reset email sent' });

    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  };


  const resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Update user's password
      await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
      res.json({ success: true, message: 'Password has been reset successfully' });
    } catch (error) {
      console.error(error);
      res.json({ success: false, message: error.message });
    }
  };
  


export {registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, sendPasswordResetEmail, resetPassword}
