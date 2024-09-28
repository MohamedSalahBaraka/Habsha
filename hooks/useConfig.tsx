import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { AxiosRequestConfig } from "axios";

const useConfig = (): AxiosRequestConfig => {
  const { userToken } = useContext(AuthContext);
  return {
    timeout: 10000,
    headers: { Authorization: `Bearer ${userToken}` },
  };
};

export default useConfig;
