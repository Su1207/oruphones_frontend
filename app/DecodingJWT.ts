"use client";
import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { UserProps, UseData } from "./DataContext";
import { useRouter } from "next/navigation";

interface JwtPayload {
  username: string;
  email: string;
  role: string;
  userId: string;
  // Add other properties if necessary
}

const DecodingJWT = () => {
  const token = Cookies.get("token");

  const router = useRouter();

  const { setUserData, setToken } = UseData();

  useEffect(() => {
    if (token) {
      setToken(token);
      const decodedToken = jwtDecode<JwtPayload>(token);

      const userData: UserProps = {
        username: decodedToken.username,
        email: decodedToken.email,
        role: decodedToken.role,
        _id: decodedToken.userId,
        activeSession: [],
      };

      setUserData(userData);
    } else {
      router.replace("/");
    }
  }, [token]);
};

export default DecodingJWT;
