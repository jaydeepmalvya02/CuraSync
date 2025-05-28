import React from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-2xl pt-10 ">
        <p>
          CONTACT <span>US</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row justify-center my-10 gap-10 mb-28 text-sm ">
        <img
          className="w-full md:max-w-[360px]"
          src={assets.contact_image}
          alt=""
        />

        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-lg text-gray-600">OUR OFFICE</p>
          <p className="text-gray-500">
            452010, Indore, (MP), India
          </p>
          <p className="text-gray-500">
            Tel: +919826414140 Email: support@curesync.com
          </p>
          <p className="font-semibold text-lg text-gray-600">
            CAREERS AT CURASYNC
          </p>
          <p className="text-gray-500">
            Learn more about our teams and job openings.
          </p>
          <button className="py-4 px-8 border border-black hover:bg-black hover:text-white transition-all duration-500 text-sm">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
