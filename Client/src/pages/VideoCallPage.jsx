import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import JitsiMeet from "../components/JitSiMeet";
import axios from "axios";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const VideoCallPage = () => {
  const { id } = useParams(); // appointment ID
  const [roomName, setRoomName] = useState(null);
  const [displayName, setDisplayName] = useState("User");
  const {token,backendUrl} =useContext(AppContext)
  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/get-appointment/${id}`, {
          headers: { token },
        });

        if (data.success && data.appointmentData) {
          setRoomName(data.appointmentData.jitsiRoom);
          setDisplayName(data.appointmentData.userData?.name || "User");
        } else {
          console.error("Invalid appointment data:", data);
        }
      } catch (error) {
        console.error("Failed to fetch appointment:", error.message);
      }
    };

    fetchAppointment();
  }, [id]);
  


  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Join Consultation</h1>
      {roomName ? (
        <JitsiMeet roomName={roomName} displayName={displayName} />
      ) : (
        <p>Loading video room...</p>
      )}
    </div>
  );
};

export default VideoCallPage;
