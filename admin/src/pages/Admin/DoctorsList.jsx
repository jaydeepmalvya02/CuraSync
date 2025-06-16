import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const {doctors,aToken,getAllDoctors,changeAvailability}=useContext(AdminContext)

  useEffect(()=>{
    
  console.log("aToken in useEffect:", aToken);
    if(aToken){
      getAllDoctors()
    }
  },[aToken, getAllDoctors])
 
  return (
    <div className="m-5 overflow-y-scroll max-w-[90vh] ">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-4 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className="border border-indigo-200 max-w-56 cursor-pointer rounded-xl overflow-hidden"
            key={index}
          >
            <div className="bg-indigo-50 hover:bg-primary transition-all duration-500 p-2 rounded">
              <img
                src={item.image}
                alt=""
                className="w-full  h-full object-contain "
              />
            </div>

            <div className='p-4'>
              <p className='text-neutral-800 text-lg font-medium '>{item.name}</p>
              <p className='text-zinc-600 text-sm'>{item.speciality}</p>
              <div className='mt-2 flex items-center gap-1 text-sm'>
                <input onChange={()=>changeAvailability(item._id)} type="checkbox" checked={item.available} />
                <p>Available</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsList