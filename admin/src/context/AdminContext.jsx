import axios from "axios";
import { createContext, useState } from "react";
import { toast } from 'react-toastify';

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
    const [aToken, setAtoken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : "");
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [dashData, setDashData] = useState(false);
    const [users, setUsers] = useState([]); // New state for storing users

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const getAllDoctors = async () => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-caregivers', {}, { headers: { aToken } });
            if (data.success) {
                setDoctors(data.caregivers);
                console.log(data.caregivers);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAllUsers = async () => { // New function to fetch all users
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/all-users', {}, { headers: { aToken } });
            if (data.success) {
                setUsers(data.users); // Update users state with fetched data
                console.log(data.users);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const changeAvailability = async (docId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/update-availability', { docId }, { headers: { aToken } });

            if (data.success) {
                toast.success(data.message);
                getAllDoctors();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getAllappointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } });
            if (data.success) {
                setAppointments(data.appointments.reverse());
                console.log(data.appointments);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(backendUrl + '/api/admin/cancel-appointment', { appointmentId }, { headers: { aToken } });

            if (data.success) {
                toast.success(data.message);
                getAllappointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });

            if (data.success) {
                setDashData(data.dashData);
                console.log(data.dashData);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const value = {
        aToken, setAtoken,
        backendUrl, doctors, getAllDoctors, changeAvailability,
        appointments, setAppointments, getAllappointments, cancelAppointment,
        dashData, getDashData,
        users, getAllUsers // Provide users and getAllUsers to the context
    };

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    );
};

export default AdminContextProvider;
