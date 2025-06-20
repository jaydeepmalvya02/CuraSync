import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { FaTrash } from "react-icons/fa";

const DoctorsList = () => {
  const { doctors, aToken, getAllDoctors, changeAvailability, deleteDoctor } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <div className="m-5 overflow-y-scroll max-w-[90vh]">
      <h1 className="text-lg font-medium">All Doctors</h1>
      <div className="w-full flex flex-wrap gap-4 pt-4 gap-y-6">
        {doctors.map((item, index) => (
          <div
            className="border border-indigo-200 max-w-56 cursor-pointer rounded-xl overflow-hidden shadow-md"
            key={index}
          >
            <div className="bg-indigo-50 hover:bg-primary transition-all duration-500 p-2 rounded">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-36 object-cover rounded"
              />
            </div>

            <div className="p-4">
              <p className="text-neutral-800 text-lg font-medium">
                {item.name}
              </p>
              <p className="text-zinc-600 text-sm">{item.speciality}</p>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <input
                  onChange={() => changeAvailability(item._id)}
                  type="checkbox"
                  checked={item.available}
                />
                <p>Available</p>
              </div>

              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete this doctor?"
                    )
                  ) {
                    deleteDoctor(item._id);
                  }
                }}
                className="mt-3 flex items-center gap-1 text-sm text-red-600 border border-red-600 px-2 py-1 rounded hover:bg-red-600 hover:text-white transition"
                title="Delete Doctor"
              >
                <FaTrash size={14} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorsList;
