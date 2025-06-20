import React, { useEffect, useContext } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  return (
    <div className="w-full max-w-7xl px-4 py-6 mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-center sm:text-left">
        All Appointments
      </h2>

      <div className="bg-white border rounded-lg shadow-md max-h-[80vh] min-h-[50vh] overflow-y-auto">
        {/* Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_2fr] gap-4 py-3 px-6 border-b bg-gray-100 text-sm font-semibold text-gray-700">
          <p>#</p>
          <p>Patient</p>
          <p>Payment</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p className="text-center">Actions</p>
        </div>

        {/* Appointment List */}
        {appointments.length > 0 ? (
          [...appointments].reverse().map((item, index) => (
            <div
              key={item._id}
              className="flex flex-wrap sm:grid sm:grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_2fr] gap-4 px-4 sm:px-6 py-4 items-center border-b text-sm"
            >
              <p className="w-full sm:w-auto font-medium sm:text-center">
                {index + 1}
              </p>

              {/* Patient Info */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <img
                  src={item.userData.image}
                  alt={item.userData.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <p className="truncate">{item.userData.name}</p>
              </div>

              {/* Payment */}
              <p className="w-1/2 sm:w-auto px-2 py-1 text-center text-xs border rounded-full">
                {item.payment ? "Online" : "Cash"}
              </p>

              {/* Age */}
              <p className="w-1/2 sm:w-auto">
                {calculateAge(item.userData.dob)}
              </p>

              {/* Date & Time */}
              <p className="w-full sm:w-auto">
                {formatDate(item.slotDate)}, {item.slotTime}
              </p>

              {/* Fees */}
              <p className="w-1/2 sm:w-auto text-primary font-semibold">
                ₹{item.amount}
              </p>

              {/* Actions */}
              <div className="flex flex-wrap justify-center gap-2 w-full sm:w-auto">
                {item.cancelled ? (
                  <span className="text-xs font-semibold text-red-600 bg-red-100 px-3 py-1 rounded-full">
                    Cancelled
                  </span>
                ) : item.isCompleted && !item.payment ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    Completed
                  </span>
                ) : item.isCompleted && item.payment ? (
                  <button
                    onClick={() => navigate(`/video-call/${item._id}`)}
                    className="text-xs px-3 py-1 border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition"
                    title="Join Video Call"
                  >
                    🎥 Video Call
                  </button>
                ) : (
                  <>
                    <img
                      src={assets.cancel_icon}
                      alt="Cancel"
                      title="Cancel Appointment"
                      className="w-7 h-7 cursor-pointer hover:scale-105 transition"
                      onClick={() => cancelAppointment(item._id)}
                    />
                    <img
                      src={assets.tick_icon}
                      alt="Complete"
                      title="Complete Appointment"
                      className="w-7 h-7 cursor-pointer hover:scale-105 transition"
                      onClick={() => completeAppointment(item._id)}
                    />
                  </>
                )}

                {/* Always Show Delete */}
                <button
                  onClick={() => deleteAppointment(item._id)}
                  title="Delete Appointment"
                  className="flex items-center gap-1 text-xs px-3 py-1 border border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-md transition"
                >
                  <FaTrash size={12} />
                  Delete
                </button>
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
