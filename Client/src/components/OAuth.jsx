import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import { FcGoogle } from "react-icons/fc"; 
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
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
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
      className="flex items-center justify-center w-full sm:w-auto gap-3 bg-white border border-gray-300 px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md hover:bg-gray-50 transition duration-200"
    >
      <FcGoogle size={22} />
      <span className="text-gray-700 font-medium text-sm">
        Sign in with Google
      </span>
    </button>
  );
}
