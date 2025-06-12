import axios from "axios";
import { useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext();
const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem("aToken") ? localStorage.getItem("aToken") : ""
  );
  const [doctors, setDoctors] = useState([]);
  const backendUrl = import.meta.env.BACKEND_URL || "http://localhost:7000";

  const getAllDoctors = async () => {
    try {
    const { data } = await axios.get(`${backendUrl}/api/admin/all-doctors`,{headers:{aToken}});
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

 const changeAvailability=async(docId)=>{
  const { data } = await axios.post(
    `${backendUrl}/api/admin/change-availability`,
    { docId },
    { headers: { aToken } }
  );
  if(data.success){
    toast.success(data.message)
    getAllDoctors()
  }
 } 
  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
  };
  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};
export default AdminContextProvider;
