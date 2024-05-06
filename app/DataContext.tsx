"use client";

import { ReactNode, createContext, useContext, useState } from "react";

export interface UserProps {
  username: string;
  email: string;
  role: string;
  _id: string;
  activeSession: { timestamp: number; deviceId: string }[];
}

interface props {
  data: { qrcode: string; email: string } | null;
  setData: (data: { qrcode: string; email: string } | null) => void;
  userData: UserProps | undefined;
  setUserData: (data: UserProps | undefined) => void;
  token: string;
  setToken: (data: string) => void;
}

const DataContext = createContext<props | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [data, setData] = useState<{ qrcode: string; email: string } | null>(
    null
  );

  const [userData, setUserData] = useState<UserProps | undefined>();
  const [token, setToken] = useState("");

  return (
    <DataContext.Provider
      value={{ data, setData, userData, setUserData, token, setToken }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
