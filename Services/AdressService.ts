import {
  CHANGE_PASSWORD,
  GET_ADDRESS,
  GET_ADDRESS_DELIVARY,
  GET_ADDRESS_FOOD,
  GET_ADDRESS_LIST,
  GET_HOME,
  GET_LANDING,
  GET_RESTOURANTE,
  LOGIN,
  LOGOUT,
  NOTIFICATION_SUBSICRIBE,
  NOTIFICATION_UNSUBSICRIBE,
  REGISTER,
  UPDATE_ADDRESS,
  UPDATE_INFO,
} from "@/constants/URLs";
import { Address, Category, City, Dish, User } from "@/types/Models.t";
import axios, { AxiosRequestConfig } from "axios";

export default class AdressService {
  constructor() {}
  static async addressList(config: AxiosRequestConfig): Promise<Address[]> {
    try {
      let url = GET_ADDRESS_LIST;
      return (
        await axios.get<{
          addresses: Address[];
        }>(url, config)
      ).data.addresses;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async updateAdress(
    {
      name,
      neighbourhood,
      city,
      details,
      phone,
      type,
    }: {
      name: string;
      neighbourhood: string;
      city: number;
      details: string;
      phone: string;
      type: string;
    },
    config: AxiosRequestConfig
  ): Promise<void> {
    try {
      let url = UPDATE_ADDRESS;
      await axios.post<void>(
        url,
        {
          name,
          neighbourhood,
          city,
          details,
          phone,
          type,
        },
        config
      );
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getaddress(type: string, config: AxiosRequestConfig): Promise<{ cities: City[]; address?: Address }> {
    try {
      let url = GET_ADDRESS;
      const responce = await axios.post<{ cities: City[]; address?: Address }>(url, { type }, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async updateInfo(config: AxiosRequestConfig, name: string, phone: string): Promise<void> {
    try {
      let url = UPDATE_INFO;
      await axios.post<void>(url, { name, phone }, config);
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async changePassword(config: AxiosRequestConfig, oldPassword: string, newPassword: string): Promise<void> {
    try {
      let url = CHANGE_PASSWORD;
      let data = new FormData();
      data.append("old_password", oldPassword);
      data.append("new_password", newPassword);
      await axios.post<void>(url, data, config);
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getaddressFood(config: AxiosRequestConfig): Promise<{ cities: City[]; address?: Address }> {
    try {
      let url = GET_ADDRESS_FOOD;
      const responce = await axios.get<{ cities: City[]; address?: Address }>(url, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getaddressDelivary(config: AxiosRequestConfig): Promise<{ cities: City[]; address?: Address; addressSent?: Address }> {
    try {
      let url = GET_ADDRESS_DELIVARY;
      const responce = await axios.get<{ cities: City[]; address?: Address; addressSent?: Address }>(url, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
}
