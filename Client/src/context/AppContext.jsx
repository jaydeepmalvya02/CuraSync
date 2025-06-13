import { createContext, useEffect, useState } from "react";

import axios from 'axios';
import  {toast}  from "react-toastify";
export const AppContext=createContext()

const AppContextProvider=(props)=>{
  const [doctors,setDoctors]=useState([])
  const backendUrl = import.meta.env.VITE_BACKEND_URL; 
  const [token, setToken] = useState(localStorage.getItem('token')? localStorage.getItem('token'):'')
  const getdoctorData=async()=>{
    try {
      const {data}=await axios.get(`${backendUrl}/api/doctor/list`)
      if(data.success){
        setDoctors(data.doctors)
        
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message)
      
    }
  }

  useEffect(()=>{
    getdoctorData()
  },[])
  const value={
    doctors,
    setToken,token,backendUrl
  }
  
  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  )
}
export default AppContextProvider