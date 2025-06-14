import React from 'react'
import {assets} from '../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
const Navbar = () => {
  const {aToken,setAToken}=useContext(AdminContext)
  const logout=()=>{
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }
  return (
    
      <div className="flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white gap-3">
        <div className="flex items-center gap-2 text-xs">
          <img
            className="w-36 sm:w-40 cursor-pointer"
            src={assets.admin_logo1}
            alt=""
          />
          <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? "Admin" : "Doctor"}</p>
        </div>
        <button onClick={logout} className="bg-primary px-10 py-2 rounded-full ">Logout</button>
      </div>
    
    
  );
}

export default Navbar