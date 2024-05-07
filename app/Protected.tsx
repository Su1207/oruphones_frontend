"use client";

import React, { ReactNode, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

interface ProtectedProps {
  children: ReactNode; // Specify children as ReactNode
}

function Protected({ children }: ProtectedProps) {
  const router = useRouter();
  const isLoggedIn = () => {
    const token = Cookies.get("token");
    console.log(!!token);

    return !!token;
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  if (!isLoggedIn()) {
    router.replace("/");
  }

  //   if (userRole && userRole !== "PRINCIPAL") {
  //     return <Navigate to="/" replace={true}></Navigate>;
  //   }
  return children;
}

export default Protected;
