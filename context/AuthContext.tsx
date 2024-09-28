import React, { createContext, ReactNode, SetStateAction, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import axios, { AxiosError } from "axios";
import * as Notifications from "expo-notifications";
import { Dimensions } from "react-native";
import { useNotification } from "@/hooks/useNotifcation";
import UserService from "@/Services/UserService";
import { User } from "@/types/Models.t";
import { useRouter } from "expo-router";

async function save(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}
async function deleteItem(key: string) {
  await SecureStore.deleteItemAsync(key);
}
interface MyContextType {
  // Define the properties or methods you expect in your context
  // For example:
  // colorsStyles: StyleProp<T>;
  expoToken: string | null;
  user: User | null;
  userToken: string | null | undefined;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  save: (key: string, value: string) => Promise<void>;
  setUserToken: React.Dispatch<React.SetStateAction<string | null>>;
  setColors: React.Dispatch<
    React.SetStateAction<{
      primary: string;
      secondary: string;
      tertiary: string;
      fourth: string;
      success: string;
      info: string;
      warning: string;
      danger: string;
      light: string;
      dark: string;
      muted: string;
    }>
  >;
  user_id?: number;
  Colors: {
    primary: string;
    secondary: string;
    tertiary: string;
    fourth: string;
    success: string;
    info: string;
    warning: string;
    danger: string;
    light: string;
    dark: string;
    muted: string;
  };
}
interface AuthProviderProps {
  children: ReactNode;
}
// Provide a default value for the context
const defaultValue: MyContextType = {
  expoToken: "",
  user: null,
  logout: () => {},
  save: async (key: string, value: string) => {},
  setUser: (usertoken: SetStateAction<User | null>) => {},
  setUserToken: (usertoken: SetStateAction<string | null>) => {},
  setColors: (
    usertoken: SetStateAction<{
      primary: string;
      secondary: string;
      tertiary: string;
      fourth: string;
      success: string;
      info: string;
      warning: string;
      danger: string;
      light: string;
      dark: string;
      muted: string;
    }>
  ) => {},
  userToken: "",
  Colors: {
    primary: "#0d6efd",
    secondary: "#6c757d",
    tertiary: "#010400",
    fourth: "#FFFBFC",
    success: "#198754",
    info: "#0dcaf0",
    warning: "#ffc107",
    danger: "#dc3545",
    light: "#f8f9fa",
    dark: "#212529",
    muted: "#6c757d",
  },
};
export const AuthContext = createContext<MyContextType>(defaultValue);
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [expoToken, setexpoToken] = useState<string | null>(null);
  const router = useRouter();
  const [Colors, setColors] = useState({
    primary: "#FFCA3A",
    secondary: "#F97068",
    tertiary: "#010400",
    fourth: "#FFFBFC",
    success: "#198754",
    info: "#0dcaf0",
    warning: "#ffc107",
    danger: "#dc3545",
    light: "#f8f9fa",
    dark: "#212529",
    muted: "#6c757d",
  });
  const [Dimention, setDimention] = useState({
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  });
  const { registerForPushNotificationsAsync, handleNotificationResponse } = useNotification();

  const logout = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "multipart/form-data",
        },
      };
      let data = new FormData();
      expoToken && data.append("expo_token", expoToken);
      const bodyParameters = {
        key: "value",
      };
      await UserService.notfictionUnSubsicribe(expoToken || "", config);
      await UserService.logout(config);
      setUserToken(null);
      setUser(null);
      await deleteItem("userToken");
      await deleteItem("user");
      router.dismissAll();
      router.replace("/");
    } catch (error) {
      const e = error as AxiosError<{ message: string }>;
      console.log(e);
      setUserToken(null);
      setUser(null);
      await deleteItem("userToken");
      await deleteItem("user");
      console.log("LOGOUT", e?.response?.data);
    }
  };

  const IsLoggedIn = async () => {
    try {
      const result = await SecureStore.getItemAsync("userToken");
      if (result) {
        setUserToken(result);
      } else {
        setUserToken(null);
      }
      const user = await SecureStore.getItemAsync("user");
      user && setUser(JSON.parse(user));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    IsLoggedIn();
    async function getToken() {
      let token = await registerForPushNotificationsAsync();
      token && setexpoToken(token);
      console.log(token);
    }
    getToken();
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
    const responseListener = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

    return () => {
      if (responseListener) {
        Notifications.removeNotificationSubscription(responseListener);
      }
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        logout,
        Colors,
        setColors,
        expoToken,
        userToken,
        save,
        setUserToken,
        setUser,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
