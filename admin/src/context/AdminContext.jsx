import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

// eslint-disable-next-line react-refresh/only-export-components
export const AdminContext = createContext();
const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL ;

  const getAllDoctors = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`, {
        headers: { aToken },
      });
      if (data.success) {
        setDoctors(data.doctors);
        console.log(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const changeAvailability = async (docId) => {
    const { data } = await axios.post(
      `${backendUrl}/api/admin/change-availability`,
      { docId },
      { headers: { aToken } }
    );
    if (data.success) {
      toast.success(data.message);
      getAllDoctors();
    }
  };

  // Fetch all appointments
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/appointments`, {
        headers: { aToken },
      });
      if (data.success) {
        setAppointments(data.appointments);
        console.log(data.appointments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/admin/cancel-appointment`,
        { appointmentId },
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  const getDashData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/dashboard`, {
        headers: { aToken },
      });
      if (data.success) {
        console.log(data.dashData);

        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };
  const deleteAppointment=async(appointmentId)=>{
    try {
      const {data}=await axios.post(`${backendUrl}/api/admin/delete-appointment`,{appointmentId},{headers:{aToken}})
      if (data.success){
        getAllAppointments()
        toast.success(data.message)
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  }
  // Delete Doctor
  const deleteDoctor=async(docId)=>{
    try {
      const {data}=await axios.delete(`${backendUrl}/api/admin/del-doctor/${docId}`,{headers:{aToken}})
      if (data.success){
        getAllDoctors()
        toast.success(data.message)
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  }
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
    deleteAppointment,deleteDoctor

  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
