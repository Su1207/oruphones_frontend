"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { UseData } from "../DataContext";
import axios from "axios";
import useSocket from "../useSocket";
import { toast } from "react-toastify";

const Page = () => {
  const router = useRouter();
  const { data, setUserData } = UseData();
  const [otp, setOtp] = useState("");

  const socket = useSocket();

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
      router.replace("/");
    }
  }, [data]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (data?.email && data?.qrcode) {
        const response = await axios.post(
          "https://oruphones-server.onrender.com/user/otp-verification",
          {
            otp,
            email: data?.email,
          },
          { withCredentials: true }
        );
        if (response.status === 200 && response.data) {
          socket.emit("login", `User logged in ${socket.id}`);
          console.log(response.data);
          const data = response.data;
          setUserData(data.user);
          router.push("/home");
        } else {
          const data = response.data;
          toast.error(`${data.error}`);
        }
      } else {
        router.replace("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4 leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
        OTP Verification
      </h1>
      {data && (
        <img
          src={data.qrcode}
          alt=""
          className="flex justify-center items-center mb-4"
        />
      )}
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <input
          type="password"
          onChange={(e) => setOtp(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg outline-none p-2.5 "
          placeholder="*** ***"
        />
        <button
          type="submit"
          className="w-full text-white bg-orange-600 hover:bg-orange-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Page;
