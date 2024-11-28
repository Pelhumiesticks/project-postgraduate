import express from "express";
import { addCaregiver,allCaregivers,loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard, allUsers,  } from "../controller/adminController.js";
import upload from '../middlewares/multer.js'
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controller/caregiverController.js";

const adminRouter = express.Router()

adminRouter.post("/add-caregiver",authAdmin, upload.single('image'), addCaregiver)
adminRouter.post("/login",loginAdmin)
adminRouter.post("/all-caregivers",authAdmin,allCaregivers)
adminRouter.post("/all-users", authAdmin, allUsers)
adminRouter.post("/update-availability",authAdmin,changeAvailability)
adminRouter.get("/appointments",authAdmin,appointmentsAdmin)
adminRouter.post("/cancel-appointment",authAdmin,appointmentCancel)
adminRouter.get("/dashboard",authAdmin, adminDashboard)


export default adminRouter;