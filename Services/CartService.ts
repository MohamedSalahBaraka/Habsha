import {
  CART_ADD,
  CART_DELIVARY_PRICE,
  CART_FORMER_DELIVARY,
  CART_FORMER_ORDER,
  CART_GET,
  CART_ORDER_DELIVARY_PRICE,
  CART_PLACE_DELIVARY,
  CART_PLACE_ORDER,
  CART_REMOVE_ALL,
} from "@/constants/URLs";
import { Cart, Delivary, Order } from "@/types/Models.t";
import axios, { AxiosRequestConfig } from "axios";

export default class CartService {
  constructor() {}
  static async orderDelivaryPrice(
    citySent: number,
    config: AxiosRequestConfig
  ): Promise<{
    price: number;
    orders: number;
  }> {
    try {
      let url = CART_ORDER_DELIVARY_PRICE;
      return (
        await axios.post<{
          price: number;
          orders: number;
        }>(url, { citySent }, config)
      ).data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async DelivaryPrice(
    citySent: number,
    cityGet: number,
    config: AxiosRequestConfig
  ): Promise<{
    price: number;
  }> {
    try {
      let url = CART_DELIVARY_PRICE;
      return (
        await axios.post<{
          price: number;
        }>(url, { citySent, cityGet }, config)
      ).data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async formerDelivary(config: AxiosRequestConfig): Promise<{ delivaries: Delivary[] }> {
    try {
      let url = CART_FORMER_DELIVARY;
      console.log(url, config);

      const responce = await axios.get<{ delivaries: Delivary[] }>(url, config);
      console.log(responce.data);

      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async formerOrder(config: AxiosRequestConfig): Promise<{ orders: Order[] }> {
    try {
      let url = CART_FORMER_ORDER;
      const responce = await axios.get<{ orders: Order[] }>(url, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async removeAll(config: AxiosRequestConfig): Promise<void> {
    try {
      let url = CART_REMOVE_ALL;
      await axios.get<void>(url, config);
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async removeDish(id: number, config: AxiosRequestConfig): Promise<void> {
    try {
      let url = CART_REMOVE_ALL;
      url += id;
      await axios.get<void>(url, config);
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async get(config: AxiosRequestConfig): Promise<{ carts: Cart[] }> {
    try {
      let url = CART_GET;
      const responce = await axios.get<{ carts: Cart[] }>(url, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async add(
    {
      size_id,
      dish_id,
      count,
    }: {
      size_id: number;
      dish_id: number;
      count: number;
    },
    config: AxiosRequestConfig
  ): Promise<void> {
    try {
      let url = CART_ADD;
      await axios.post<void>(
        url,
        {
          size_id,
          dish_id,
          count,
        },
        config
      );
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async placeOrder(
    { name, neighbourhood, city, details, phone }: { name: string; neighbourhood: string; city: number; details: string; phone: string },
    config: AxiosRequestConfig
  ): Promise<void> {
    try {
      let url = CART_PLACE_ORDER;
      await axios.post<void>(
        url,
        {
          nameSent: name,
          neighbourhoodSent: neighbourhood,
          citySent: city,
          detailsSent: details,
          phoneSent: phone,
        },
        config
      );
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async placeDelivary(
    {
      name,
      neighbourhood,
      city,
      details,
      phone,
      title,
      namesent,
      neighbourhoodsent,
      citysent,
      detailssent,
      money,
      phonesent,
    }: {
      name: string;
      neighbourhood: string;
      city: number;
      details: string;
      phone: string;
      title: string;
      namesent: string;
      neighbourhoodsent: string;
      citysent: number;
      detailssent: string;
      money?: number;
      phonesent: string;
    },
    config: AxiosRequestConfig
  ): Promise<void> {
    try {
      let url = CART_PLACE_DELIVARY;
      await axios.post<void>(
        url,
        {
          package: title,
          nameGet: name,
          neighbourhoodGet: neighbourhood,
          cityGet: city,
          detailsGet: details,
          phoneGet: phone,
          nameSent: namesent,
          neighbourhoodSent: neighbourhoodsent,
          citySent: citysent,
          detailsSent: detailssent,
          phoneSent: phonesent,
          money: money || 0,
        },
        config
      );
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
}
