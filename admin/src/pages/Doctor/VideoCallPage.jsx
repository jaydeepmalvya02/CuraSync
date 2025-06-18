import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import JitsiMeet from "../../components/JitSiMeet";
import axios from "axios";
import { DoctorContext } from "../../context/DoctorContext";

const VideoCallPage = () => {
  const { id } = useParams();
  const [roomName, setRoomName] = useState(null);
  const [displayName, setDisplayName] = useState("Doctor");
  const { dToken, backendUrl } = useContext(DoctorContext);

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/doctor/video-call/${id}`,
          { headers: { dToken } }
        );

        if (data.success && data.appointmentData) {
          setRoomName(data.appointmentData.jitsiRoom);
          setDisplayName(data.appointmentData.docData?.name || "Doctor");
        } else {
          console.error("Invalid appointment data:", data);
        }
      } catch (error) {
        console.error("Failed to fetch appointment:", error.message);
      }
    };

    fetchAppointment();
  }, [backendUrl, dToken, id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col items-center justify-center px-4 py-6">
      <h1 className="text-xl sm:text-3xl font-semibold mb-6 text-gray-800 text-center">
        Join Consultation
      </h1>
      {roomName ? (
        <JitsiMeet roomName={roomName} displayName={displayName} />
      ) : (
        <p className="text-gray-500 text-center">Loading video room...</p>
      )}
    </div>
  );
};

export default VideoCallPage;
