import React, { useEffect, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { FaTrash } from "react-icons/fa";

const DoctorAppointments = () => {
  const {
    appointments,
    getAppointments,
    dToken,
    completeAppointment,
    cancelAppointment,
    deleteAppointment,
  } = useContext(DoctorContext);

  const { calculateAge, formatDate } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  return (
    <div className="w-full max-w-7xl px-4 py-6 mx-auto">
      <h2 className="text-2xl font-semibold mb-4">All Appointments</h2>

      <div className="bg-white border rounded-lg shadow-md max-h-[80vh] min-h-[50vh] overflow-y-auto">
        {/* Header Row */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr] gap-4 py-4 px-6 border-b bg-gray-50 text-sm font-medium text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className="text-center">Actions</p>
        </div>

        {/* Appointments List */}
        {appointments.length > 0 ? (
          [...appointments].reverse().map((item, index) => (
            <div
              key={item._id}
              className="flex flex-wrap sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1.5fr] gap-4 px-6 py-4 items-center border-b hover:bg-gray-50 text-sm text-gray-700"
            >
              {/* Index */}
              <p className="max-sm:w-full font-medium sm:text-center">
                {index + 1}
              </p>

              {/* Patient */}
              <div className="flex items-center gap-2 max-sm:w-full">
                <img
                  src={item.userData.image}
                  alt={item.userData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p>{item.userData.name}</p>
              </div>

              {/* Payment */}
              <p className="max-sm:w-1/2 px-2 py-1 border rounded-full text-center text-xs">
                {item.payment ? "Online" : "Cash"}
              </p>

              {/* Age */}
              <p className="max-sm:w-1/2">{calculateAge(item.userData.dob)}</p>

              {/* Date & Time */}
              <p className="max-sm:w-full">
                {formatDate(item.slotDate)}, {item.slotTime}
              </p>

              {/* Fees */}
              <p className="max-sm:w-1/2 text-primary font-semibold">
                ₹{item.amount}
              </p>

              {/* Actions */}
              <div className="flex gap-2 justify-center max-sm:w-full">
                {item.cancelled ? (
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
                    Cancelled
                  </span>
                ) : item.isCompleted ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Completed
                  </span>
                ) : (
                  <>
                    <img
                      src={assets.cancel_icon}
                      alt="Cancel"
                      title="Cancel Appointment"
                      className="w-8 h-8 cursor-pointer hover:scale-105 transition"
                      onClick={() => cancelAppointment(item._id)}
                    />
                    <img
                      src={assets.tick_icon}
                      alt="Complete"
                      title="Complete Appointment"
                      className="w-8 h-8 cursor-pointer hover:scale-105 transition"
                      onClick={() => completeAppointment(item._id)}
                    />
                    <button
                      onClick={() => deleteAppointment(item._id)}
                      title="Delete Appointment"
                      className="flex items-center gap-1 text-red-600 border border-red-600 px-3 py-1 rounded-md hover:bg-red-600 hover:text-white text-xs transition"
                    >
                      <FaTrash />
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-gray-500">
            No appointments found.
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointments;
