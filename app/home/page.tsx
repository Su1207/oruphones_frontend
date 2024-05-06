"use client";

import React, { useEffect, useState } from "react";
import { useData } from "../DataContext";
import jwtDecodeUser from "../JwtDecodeUser";
import axios from "axios";
import { useRouter } from "next/navigation";
import useSocket from "../useSocket";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

interface UserActivity {
  _id: string;
  user: string;
  device: string;
  timestamp: number;
  type: string;
}

interface ActiveSession {
  _id: string;
  deviceId: string;
  timestamp: number;
  token: string;
}

const page = () => {
  const { userData, setUserData, setData, token, setToken } = useData();

  const [userActivities, setUserActivities] = useState<UserActivity[] | null>(
    null
  );

  const [activeSessions, setActiveSessions] = useState<ActiveSession[] | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState(false);

  const router = useRouter();
  const socket = useSocket();

  useEffect(() => {
    if (token) {
      socket.on("connect", () => {
        console.log("Connected to Socket.IO server", socket.id);
      });

      socket.on("message", (data) => {
        console.log("Received message:", data);
        setMessage(!message);
      });

      socket.on("signout user", (data) => {
        if (data === token) {
          Cookies.remove("token");
          //   setToken("");
          //   setUserActivities(null);
          //   setActiveSessions(null);
          //   setUserData(undefined);
          //   setData(null);
          setMessage(!message);
          handleLogout();
          toast.success("Sign out successfully!!!");
        }
      });
    }
    return () => {
      socket.off("connect");
      socket.off("message");
    };
  }, [socket, token]);

  jwtDecodeUser();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "https://oruphones-server.onrender.com/user/logout",
        {
          userId: userData?._id,
        },
        { withCredentials: true }
      );

      socket.emit("logout", `${userData?.username} logged out ${socket.id}`);
      const data = response.data;
      console.log("message: ", data.message);

      router.push("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://oruphones-server.onrender.com/user/activities/${userData?._id}`,
          { withCredentials: true }
        );

        if (response.status === 200 && response.data) {
          const data = response.data;

          const userActivities = data.userActivity;
          const sortedActivities = userActivities
            .slice()
            .sort(
              (a: UserActivity, b: UserActivity) => b.timestamp - a.timestamp
            );

          const activeSession = data.activeSession;
          const sortedActiveSession = activeSession
            .slice()
            .sort(
              (a: ActiveSession, b: ActiveSession) => b.timestamp - a.timestamp
            );
          setActiveSessions(sortedActiveSession);
          setUserActivities(sortedActivities);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    token && fetchActivities();
  }, [userData, socket, message]);

  const handlesignout = (token: string) => {
    try {
      socket.emit("signout", `${token}`);
    } catch (err) {
      console.log(err);
    }
  };

  const converToDate = (timestamp: number) => {
    return new Date(timestamp);
  };

  return (
    <div className=" m-5">
      {!loading ? (
        <>
          <div className="flex items-start justify-between sm:px-8">
            <div className="text-3xl font-bold flex gap-1">
              Hi, {userData && <div>{userData.username} !</div>}
            </div>
            <button
              className="bg-red-600 px-3 py-2 rounded-md text-white hover:bg-black transition-all duration-300 ease-in-out text-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="border h-0 my-[1rem]"></div>

          <div className="my-5">
            <div className="mb-4 text-2xl font-bold">Active Session</div>
            <div className="grid grid-cols-1 md:grid-cols-2 mb-10">
              {activeSessions &&
                Object.entries(activeSessions).map(([index, data]) => (
                  <div
                    key={index}
                    className="mb-2 bg-slate-300 p-5 rounded-md w-auto sm:w-[28rem]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {data.deviceId.includes("PC") ? (
                          <img
                            src="/monitor.png"
                            alt="PC Icon"
                            className="h-5 w-5"
                          />
                        ) : (
                          <img
                            src="/smartPhone.png"
                            alt="Mobile Icon"
                            className="h-5 w-5"
                          />
                        )}
                        <div className="text-base font-semibold text-gray-800">
                          {data.deviceId}
                        </div>
                      </div>

                      {data.token === token ? (
                        <div className="text-xs flex gap-1 px-2 bg-orange-600 rounded-full py-1 text-gray-50">
                          Current{" "}
                          <span className="hidden sm:block">Device</span>
                        </div>
                      ) : (
                        <button
                          className="bg-white py-2 px-3 transition-all duration-300 ease-in-out text-xs rounded-md text-gray-500 hover:bg-red-600 hover:text-white"
                          onClick={() => handlesignout(data.token)}
                        >
                          Signout
                        </button>
                      )}
                    </div>
                    <div className="border h-0 border-gray-500 mt-2 mb-4"></div>
                    <div className="flex items-center gap-4">
                      <img src="/clock.png" alt="" className="h-5 w-5" />
                      <div className="text-sm">
                        {converToDate(data.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="text-2xl font-bold">User Activity History</div>
          {userActivities ? (
            <div className=" overflow-auto">
              <table className="w-full text-sm text-left border rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      DEVICE
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      STATUS
                    </th>
                    <th scope="col" className="px-6 py-3 text-center">
                      TIME
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(userActivities).map(([index, data]) => (
                    <tr
                      key={index}
                      className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                      >
                        {data.device}
                      </th>
                      <td className="px-6 py-4 text-center">{data.type}</td>
                      <td className="px-6 py-4 text-center">
                        {converToDate(data.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div>No data</div>
          )}
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default page;

{
  /* Object.entries(userActivities).map(([index, data]) => (
          <div key={index} className="mb-2">
            <div>{data.device}</div>
            <div>
              {data.type} - {data.timestamp}
            </div>
          </div>
        ))} */
}
