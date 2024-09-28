import { LOGIN, LOGOUT, NOTIFICATION_SUBSICRIBE, NOTIFICATION_UNSUBSICRIBE, REGISTER } from "@/constants/URLs";
import { User } from "@/types/Models.t";
import axios, { AxiosRequestConfig } from "axios";

export default class UserService {
  constructor() {}

  static async login(phone: string, password: string, type: string): Promise<{ token: string; user: User }> {
    try {
      console.log(LOGIN, { phone, password, type });

      const responce = await axios.post<{ token: string; user: User }>(LOGIN, { phone, password, type }, {});
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async notfictionSubsicribe(token: string, expoToken: string): Promise<void> {
    try {
      const config = {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };
      let url = NOTIFICATION_SUBSICRIBE;
      let data = new FormData();
      data.append("expo_token", expoToken);
      await axios.post<void>(url, data, config);
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async notfictionUnSubsicribe(expoToken: string, config: AxiosRequestConfig): Promise<void> {
    try {
      let url = NOTIFICATION_UNSUBSICRIBE;
      let data = new FormData();
      data.append("expo_token", expoToken);
      await axios.post<void>(url, data, config);
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async logout(config: AxiosRequestConfig): Promise<void> {
    try {
      let url = LOGOUT;
      await axios.post<void>(url, {}, config);
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async register(name: string, phone: string, password: string): Promise<{ token: string; user: User }> {
    try {
      let url = REGISTER;

      const responce = await axios.post<{ token: string; user: User }>(url, { name, phone, password });
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
}
