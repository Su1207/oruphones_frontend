"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useData } from "./DataContext";
import { toast } from "react-toastify";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { data, setData } = useData();

  const router = useRouter();
  const [signUp, setSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "https://oruphones-server.onrender.com/user/sigin",
        {
          email,
          password,
        }
      );

      if (response.status === 200 && response.data) {
        setData(response.data);
        router.push("/otpVerification");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "https://oruphones-server.onrender.com/user/register",
        {
          username,
          email,
          password,
        }
      );

      if (response.status === 200 && response.data) {
        toast.success("Registered Successfully. Login now!!");
        setSignUp(false);
        router.push("/");
      } else {
        toast.error("Error, try again later");
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
            {signUp ? (
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Register account
              </h1>
            ) : (
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Sign in to your account
              </h1>
            )}
            <form
              className="space-y-4 md:space-y-6"
              onSubmit={signUp ? handleRegister : handleSubmit}
            >
              {signUp && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 outline-none sm:text-sm rounded-lg  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="example@gmail.com"
                  />
                </div>
              )}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg outline-none  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="example@gmail.com"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg outline-none  block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </div>
              {!signUp && (
                <div className="flex items-center justify-end">
                  <a
                    href="/newPassword"
                    className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Forgot password?
                  </a>
                </div>
              )}
              {signUp ? (
                <button
                  type="submit"
                  className="w-full text-white bg-blue-600 hover:bg-blue-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out"
                >
                  Register
                </button>
              ) : (
                <button
                  type="submit"
                  className="w-full text-white bg-orange-600 hover:bg-orange-900 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 ease-in-out"
                >
                  Sign in
                </button>
              )}
              {signUp ? (
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?
                  <a
                    onClick={() => setSignUp(false)}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign In
                  </a>
                </p>
              ) : (
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Don’t have an account yet?
                  <a
                    onClick={() => setSignUp(true)}
                    className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >
                    Sign up
                  </a>
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
