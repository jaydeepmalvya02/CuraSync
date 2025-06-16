import React from "react";
// import {assets} from '../assets/assets'
import { useState } from "react";
import { useContext } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";
import { DoctorContext } from "../context/DoctorContext";
const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setAToken, backendUrl } = useContext(AdminContext);
  const { setDToken } = useContext(DoctorContext);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, {
          email,
          password,
        });

        if (data.success) {
          localStorage.setItem("aToken", data.token);
          setAToken(data.token);
          toast.success("Login Successful");
          console.log(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/doctor/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("dToken", data.token);
          setDToken(data.token);
          console.log(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="min-h-[80vh] flex items-center justify-center"
    >
      <div className="flex flex-col m-auto gap-3 p-8 items-start min-w-[340px] sm:min-w-96 border rounded-xl shadow-lgv text-sm text-[#5E5E5E]">
        <p className="m-auto text-2xl font-semibold">
          <span className="text-primary">{state} </span>Login
        </p>
        <div className="w-full">
          <p>Email</p>
          <input
            type="email"
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            required
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>
        <div className="w-full">
          <p>Password</p>
          <input
            type="password"
            className="border border-[#DADADA] rounded w-full p-2 mt-1"
            required
            placeholder="Enter Your Password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>
        <button className="bg-primary text-white w-full rounded-md py-2 text-base">
          Login
        </button>
        {state === "Admin" ? (
          <p>
            Doctor Login?
            <span
              onClick={() => setState("Doctor")}
              className="text-primary underline cursor-pointer "
            >
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?
            <span
              onClick={() => setState("Admin")}
              className="text-primary underline cursor-pointer "
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;
