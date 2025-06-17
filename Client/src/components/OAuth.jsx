import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useContext } from "react";
import { AppContext } from "../context/AppContext.jsx";

export default function OAuth() {
  const { setToken, token, backendUrl } = useContext(AppContext);
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const { data } = await axios.post(
        `${backendUrl}/api/user/google`,
        {
          data: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            image: result.user.photoURL,
          }),
        },
        {
          headers: { token },
        }
      );
      if (data.success) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        toast.success(data.message);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      type="button"
      className="bg-red-700 text-white p-3 rounded-lg w-full uppercase hover:opacity-95"
    >
      Continue with google
    </button>
  );
}
