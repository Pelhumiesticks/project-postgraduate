import { createContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = "$";

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : false);
  const [userData, setUserData] = useState(false);

  const inactivityTimeoutRef = useRef(null); // Track inactivity timer

  const getCaregiversData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/caregiver/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const loadUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", { headers: { token } });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Inactivity Logout Logic
  const logout = () => {
    setToken(false); // Clear token
    localStorage.removeItem("token");
    setUserData(false);
    toast.info("Logged out due to inactivity");
  };

  const resetInactivityTimer = () => {
    clearTimeout(inactivityTimeoutRef.current); // Clear the existing timer

    // Set a new timer (5 seconds for testing; change to 900000 for 15 mins in production)
    inactivityTimeoutRef.current = setTimeout(() => {
      if (token) logout(); 
    }, 100000);
  };

  useEffect(() => {
    // Attach event listeners for user activity
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetInactivityTimer));

    resetInactivityTimer(); // Initialize the timer on mount

    return () => {
      // Cleanup event listeners and timer
      events.forEach((event) => window.removeEventListener(event, resetInactivityTimer));
      clearTimeout(inactivityTimeoutRef.current);
    };
  }, [token]); 

  const value = {
    doctors,
    getCaregiversData,
    currency,
    setToken,
    token,
    backendUrl,
    userData,
    setUserData,
    loadUserData,
  };

  useEffect(() => {
    getCaregiversData(); 
  }, []);

  useEffect(() => {
    if (token) {
      loadUserData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
