import React, { useEffect, useRef, useState } from "react";

const JitsiMeet = ({ roomName, displayName }) => {
  const jitsiContainerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://meet.jit.si/external_api.js";
    script.async = true;

    script.onload = () => {
      try {
        const domain = "meet.jit.si";
        const options = {
          roomName,
          parentNode: jitsiContainerRef.current,
          userInfo: {
            displayName: displayName || "Guest",
          },
          configOverwrite: {
            startWithAudioMuted: false,
            startWithVideoMuted: false,
          },
          interfaceConfigOverwrite: {
            SHOW_JITSI_WATERMARK: false,
            TOOLBAR_ALWAYS_VISIBLE: true,
            SHOW_WATERMARK_FOR_GUESTS: false,
          },
          width: "100%",
          height: "100%",
        };

        new window.JitsiMeetExternalAPI(domain, options);
        setIsLoaded(true);
      } catch (err) {
        console.error("Jitsi Meet Error:", err);
      }
    };

    document.body.appendChild(script);

    return () => {
      if (jitsiContainerRef.current) {
        jitsiContainerRef.current.innerHTML = "";
      }
    };
  }, [roomName, displayName]);

  return (
    <div className="w-full flex justify-center items-center">
      <div className="relative w-full sm:w-[90%] md:w-[600px] md:h-[75vh] lg:w-[1200px] h-[75vh] sm:h-[85vh] rounded-xl shadow-lg bg-white overflow-hidden">
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-600 mb-2"></div>
              <p className="text-sm text-gray-500">Joining meeting room...</p>
            </div>
          </div>
        )}
        <div ref={jitsiContainerRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default JitsiMeet;
