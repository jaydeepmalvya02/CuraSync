import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import dayjs from "dayjs";
import{useNavigate} from 'react-router-dom'
const MyAppointments = () => {
  const { backendUrl, token ,getdoctorData} = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate=useNavigate()
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/user/appointments`, {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/user/cancel-appointment`,
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getdoctorData()
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

const initPay=(order)=>{
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount:order.amount,
    currency:order.currency,
    name:'Appointment Payment',
    description:'Appointment Payment',
    order_id:order.id,
    reciept:order.reciept,
    handler:async(response)=>{
      console.log(response);
      try {
        const {data}=await axios.post(`${backendUrl}/api/user/verifyRazorpay`,response,{headers:{token}})
        if(data.success){
          getUserAppointments()
          navigate('/my-appointments')
          toast.success(data.message)
        }
      } catch (error) {
        console.error(error);
        toast.error(error.message);
      }
    }
  };
  const rzp=new window.Razorpay(options)
  rzp.open()
}

const appointmentRazorpay=async(appointmentId)=>{
  try {
    const {data}=await axios.post(`${backendUrl}/api/user/payment-razorpay`,{appointmentId},{headers:{token}})
    if(data.success){
      console.log(data.order);
      initPay(data.order)
      // toast.success(data.success)
    }
    else{
      toast.error(data.message)
    }
  } catch (error) {
    console.error(error);
    toast.error(error.message);
  }
}

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  const formatDate = (dateStr) => {
    const formatted = dateStr.split("_").reverse().join("-");
    return dayjs(formatted).format("DD MMM YYYY");
  };

  return (
    <div>
      <p className="pb-3 font-medium mt-12 text-zinc-700 border-b">
        My Appointments
      </p>
      <div>
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b"
            key={index}
          >
            <div>
              <img
                className="w-32 bg-indigo-200"
                src={item.docData.image}
                alt=""
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-800 font-semibold">
                {item.docData.name}
              </p>
              <p>{item.docData.speciality}</p>
              <p className="text-zinc-700 font-medium mt-1">Address:</p>
              <p className="text-xs">{item.docData.address.line1}</p>
              <p className="text-xs">{item.docData.address.line2}</p>
              <p className="text-xs mt-1">
                <span className="text-sm text-neutral-700 font-medium">
                  Date & Time:
                </span>{" "}
                {formatDate(item.slotDate)} | {item.slotTime}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 justify-end sm:items-end">
              {/* Payment Status or Pay Button */}
              {item.cancelled ? (
                <span className="text-sm bg-red-500 text-white text-center sm:min-w-32 px-4 py-2 rounded opacity-70 cursor-not-allowed">
                  Cancelled
                </span>
              ) : item.payment ? (
                <span className="text-sm bg-green-600 text-white text-center sm:min-w-32 px-4 py-2 rounded opacity-70 cursor-not-allowed">
                  Paid
                </span>
              ) : (
                <button
                  onClick={() => appointmentRazorpay(item._id)}
                  className="text-sm border border-primary text-primary text-center sm:min-w-32 px-4 py-2 rounded hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Pay Online
                </button>
              )}

              {/* Cancel Button */}
              {!item.cancelled && (
                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="text-sm border border-red-500 text-red-600 text-center sm:min-w-32 px-4 py-2 rounded hover:bg-red-600 hover:text-white transition-all duration-300"
                >
                  Cancel Appointment
                </button>
              )}

              {/* Video Call Button */}
              {item.payment && !item.cancelled && item.jitsiRoom && (
                <button
                  onClick={() => navigate(`/video-call/${item._id}`)}
                  className="text-sm border border-blue-500 text-blue-600 text-center sm:min-w-32 px-4 py-2 rounded hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  Join Video Call
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;
