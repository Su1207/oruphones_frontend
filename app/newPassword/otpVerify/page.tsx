"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useData } from "../../dataContext";
import axios from "axios";
import { toast } from "react-toastify";

const page = () => {
  const router = useRouter();
  const { data } = useData();
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  //   useEffect(() => {
  //     socket.on("connect", () => {
  //       console.log("Connected to Socket.IO server", socket.id);
  //     });

  //     socket.on("message", (data) => {
  //       console.log("Received message:", data);
  //     });

  //     return () => {
  //       socket.off("connect");
  //       socket.off("message");
  //     };
  //   }, [socket]);

  //   const userAgent = navigator.userAgent;
  //   console.log(userAgent);

  useEffect(() => {
    if (!data?.email || !data?.qrcode) {
      router.replace("/newPassword");
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (data?.email && data?.qrcode) {
        const response = await axios.post(
          "http://localhost:4000/user/otpVerify",
          {
            otp,
            email: data?.email,
            newPassword,
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          const data = response.data;
          if (data.success) {
            toast.success("Password changed successfully!!!");
            router.replace("/");
          }
        }
      } else {
        router.replace("/newPassword");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              OTP verification
            </h1>

            <div className="flex items-center justify-center w-full">
              <img src={data?.qrcode} alt="" />
            </div>
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Enter OTP
                </label>
                <input
                  type="password"
                  name="otp"
                  id="otp"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg outline-none  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="********"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  New password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg outline-none  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="*********"
                />
              </div>

              <button
                type="submit"
                className="w-full text-white bg-orange-600 hover:bg-orange-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
