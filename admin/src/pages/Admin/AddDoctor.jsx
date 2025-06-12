import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";


const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);
  const handleSubmit =async (e) => {
    e.preventDefault();
    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }
      const formData=new FormData()
      formData.append('image',docImg)
      formData.append('name',name)
      formData.append('email',email)
      formData.append('password',password)
      formData.append('fees',Number(fees))
      formData.append('degree',degree)
      formData.append('speciality',speciality)
      formData.append('about',about)
      formData.append('address',JSON.stringify({line1:address1,line2:address2}))
      formData.append('experience',experience)

      // console.log formdata
      formData.forEach((value,key)=>{
          console.log(`${key}:${value}`);
          
      })
      const {data}=await axios.post(`${backendUrl}/api/admin/add-doctor`,formData,{
        headers:{aToken}
      })
      if (data.success==true){
        toast.success(data.message)
        setDocImg(false)
        setName('')
        setEmail('')
        setPassword('')
        setSpeciality('')
        setFees('')
        setAddress1('')
        setAddress2('')
        setDegree('')
        setAbout('')
        setExperience('')
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.error(error);
      
      toast.error(error.message)
    }
    // console.log(name,email,password,experience,about,speciality);
  };
  return (
    <form onSubmit={handleSubmit} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Doctor</p>

      <div className="bg-white px-8 py-8 max-w-4xl rounded w-full border max-h-[80vh] overflow-y-scroll ">
        {/* Image Upload */}
        <div className="flex gap-4 items-center mb-8 text-gray-500 ">
          <label htmlFor="doc-img">
            <img
              className="bg-gray-100 w-16 rounded-full cursor-pointer"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt="Upload"
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p>
            Upload doctor <br /> picture
          </p>
        </div>

        {/* Form Columns */}
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="px-2 py-3 rounded border"
                type="text"
                placeholder="Name"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Email</p>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="px-2 py-3 rounded border"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Doctor Password</p>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="px-2 py-3 rounded border"
                type="password"
                placeholder="Password"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="px-2 py-3 rounded border"
                required
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <option key={i} value={`${i + 1} Year`}>
                    {i + 1} Year
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="px-2 py-3 rounded border"
                type="number"
                placeholder="Fees"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="px-2 py-3 rounded border"
                required
              >
                <option value="General physician">General physician</option>
                <option value="Gynecologist">Gynecologist</option>
                <option value="Dermatologist">Dermatologist</option>
                <option value="Pediatricians">Pediatricians</option>
                <option value="Neurologist">Neurologist</option>
                <option value="Gastroenterologist">Gastroenterologist</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="px-2 py-3 rounded border"
                type="text"
                placeholder="Education"
                required
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="px-2 py-3 rounded border"
                type="text"
                placeholder="Address 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="px-2 py-3 rounded border"
                type="text"
                placeholder="Address 2"
                required
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <p className="mt-4 mb-2">About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full px-4  pt-2 border  "
            placeholder="Write about doctor"
            rows={5}
            required
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white rounded-full py-3 mt-4 px-10 hover:bg-blue-700 transition"
        >
          Add Doctor
        </button>
      </div>
    </form>
  );
};

export default AddDoctor;
