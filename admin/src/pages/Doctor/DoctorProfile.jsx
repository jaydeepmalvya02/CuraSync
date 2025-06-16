import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { getProfileData, setProfileData, profileData, dToken, backendUrl } =
    useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        fees: Number(profileData.fees),
        available: profileData.available,
        address: {
          line1: profileData.address.line1,
          line2: profileData.address.line2,
        },
      };

      const { data } = await axios.post(
        `${backendUrl}/api/doctor/update-profile`,
        updateData, // ✅ send directly as per expected format
        { headers: { dToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error.message);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  return (
    profileData && (
      <div>
        <div className="flex flex-col gap-4">
          <div>
            <img
              className="bg-primary/80 w-full sm:max-w-64 rounded-lg"
              src={profileData.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-stone-100 p-8 py-7 rounded-lg bg-white">
            {/* ------Doc Info------ */}
            <p className="flex items-center gap-2 text-3xl text-gray-700 font-medium">
              {profileData.name}
            </p>
            <div className="flex items-center gap-2 mt-2 text-gray-600">
              <p>
                {profileData.degree} - {profileData.speciality}
              </p>
              <button className="px-0.5 py-2 rounded-full text-xs">
                {profileData.experience}
              </button>
            </div>
            {/* ------Doc About------ */}
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
                About:
              </p>
              <p className="text-gray-600 max-w-[700px] mt-1">
                {profileData.about}
              </p>
            </div>
            {/* ------Fees------ */}
            <p className="text-gray-600 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-gray-800">
                ₹
                {isEdit ? (
                  <input
                    type="number"
                    onChange={(e) =>
                      setProfileData((prev) => ({
                        ...prev,
                        fees: e.target.value,
                      }))
                    }
                    value={profileData.fees}
                  />
                ) : (
                  profileData.fees
                )}
              </span>
            </p>
            {/* ------Address------ */}
            <div className="flex gap-3 py-2">
              <p>Address:</p>
              <div className="text-sm">
                {isEdit ? (
                  <>
                    <input
                      type="text"
                      placeholder="Line 1"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line1: e.target.value,
                          },
                        }))
                      }
                      value={profileData.address.line1}
                    />
                    <br />
                    <input
                      type="text"
                      placeholder="Line 2"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          address: {
                            ...prev.address,
                            line2: e.target.value,
                          },
                        }))
                      }
                      value={profileData.address.line2}
                    />
                  </>
                ) : (
                  <>
                    {profileData.address.line1}
                    <br />
                    {profileData.address.line2}
                  </>
                )}
              </div>
            </div>
            {/* ------Available Checkbox------ */}
            <div className="flex gap-1 pt-2">
              <input
                type="checkbox"
                checked={profileData.available}
                onChange={() =>
                  isEdit &&
                  setProfileData((prev) => ({
                    ...prev,
                    available: !prev.available,
                  }))
                }
              />
              <label>Available</label>
            </div>

            {/* ------Buttons------ */}
            {isEdit ? (
              <button
                onClick={updateProfile}
                className="px-4 py-1 border border-gray-900 rounded-full mt-5 text-sm hover:bg-primary hover:text-white transition-all"
              >
                Save
              </button>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-4 py-1 rounded-full mt-5 border border-primary text-sm hover:bg-primary hover:text-white transition-all"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
