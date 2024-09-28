import {
  GET_DISH,
  GET_DISHES,
  GET_HOME,
  GET_LANDING,
  GET_ORDER,
  GET_RESTOURANTE,
  LOGIN,
  LOGOUT,
  NOTIFICATION_SUBSICRIBE,
  NOTIFICATION_UNSUBSICRIBE,
  REGISTER,
} from "@/constants/URLs";
import { Category, Dish, Order, User } from "@/types/Models.t";
import axios, { AxiosRequestConfig } from "axios";

export default class GetService {
  constructor() {}
  static async getHome(config: AxiosRequestConfig): Promise<{
    user: User;
    setting: {
      primaryColor: string;
      secondaryColor: string;
      facebook: string;
      instagram: string;
      twitter: string;
      youtube: string;
      telegram: string;
      whatsapp: string;
      sitename: string;
      logo: string;
    };
  }> {
    try {
      let url = GET_HOME;
      return (
        await axios.get<{
          user: User;
          setting: {
            primaryColor: string;
            secondaryColor: string;
            facebook: string;
            instagram: string;
            twitter: string;
            youtube: string;
            telegram: string;
            whatsapp: string;
            sitename: string;
            logo: string;
          };
        }>(url, config)
      ).data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getLanding(config: AxiosRequestConfig): Promise<{ dishes: Dish[]; categories: Category[]; restaurants: User[] }> {
    try {
      let url = GET_LANDING;
      return (await axios.get<{ dishes: Dish[]; categories: Category[]; restaurants: User[] }>(url, config)).data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getRestourante(config: AxiosRequestConfig, keyword?: string): Promise<{ restaurants: User[] }> {
    try {
      let url = GET_RESTOURANTE;
      let data: { keyword?: string } = {};
      if (keyword) data.keyword = keyword;
      const responce = await axios.post<{ restaurants: User[] }>(url, data, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getDish(id: number, config: AxiosRequestConfig): Promise<{ dish: Dish }> {
    try {
      let url = GET_DISH;
      url += id;
      const responce = await axios.get<{ dish: Dish }>(url, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getorder(id: number, config: AxiosRequestConfig): Promise<{ order: Order }> {
    try {
      let url = GET_ORDER;
      url += id;
      const responce = await axios.get<{ order: Order }>(url, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getdishes(
    config: AxiosRequestConfig,
    {
      categories,
      user_id,
      keyword,
    }: {
      categories?: number[];
      user_id?: number[];
      keyword?: string;
    }
  ): Promise<{ dishes: Dish[]; categories: Category[] }> {
    try {
      let url = GET_DISHES;
      let data: { keyword?: string; categories?: number[]; user_id?: number[] } = {};
      if (keyword) data.keyword = keyword;
      if (categories) data.categories = categories;
      if (user_id) data.user_id = user_id;
      const responce = await axios.post<{ dishes: Dish[]; categories: Category[] }>(url, data, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
}
