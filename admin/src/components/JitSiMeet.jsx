// components/JitsiMeet.js
import React, { useEffect, useRef } from "react";

const JitsiMeet = ({ roomName, displayName }) => {
  const jitsiContainerRef = useRef(null);

  useEffect(() => {
    // Load the script
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;
    script.onload = () => {
      const domain = "meet.jit.si";
      const options = {
        roomName: roomName,
        parentNode: jitsiContainerRef.current,
        userInfo: {
          displayName: displayName,
        },
        configOverwrite: {
          startWithAudioMuted: false,
          startWithVideoMuted: false,
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK: false,
        },
        width: "100%",
        height: 500,
      };
      new window.JitsiMeetExternalAPI(domain, options);
    };
    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = "";
      }
    };
  }, [roomName, displayName]);

  return <div ref={jitsiContainerRef} className="w-full" />;
};

export default JitsiMeet;
