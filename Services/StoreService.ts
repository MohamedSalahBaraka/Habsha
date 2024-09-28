import {
  STORE_ADD,
  STORE_PRODUCT,
  STORE_PRODUCTS,
  STORE_FORMER_ORDER,
  STORE_GET,
  STORE_LANDING,
  STORE_ORDER,
  STORE_ORDER_DELIVARY_PRICE,
  STORE_PLACE_ORDER,
  STORE_REMOVE_ALL,
  STORE_STORE,
} from "@/constants/URLs";
import { Cart, Category, Order, OrderStore, Product, User } from "@/types/Models.t";
import axios, { AxiosRequestConfig } from "axios";

export default class StoreService {
  constructor() {}
  static async orderDelivaryPrice(
    citySent: number,
    config: AxiosRequestConfig
  ): Promise<{
    price: number;
    orders: number;
  }> {
    try {
      let url = STORE_ORDER_DELIVARY_PRICE;
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
  static async formerOrder(config: AxiosRequestConfig): Promise<{ orders: OrderStore[] }> {
    try {
      let url = STORE_FORMER_ORDER;
      const responce = await axios.post<{ orders: OrderStore[] }>(url, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async removeAll(config: AxiosRequestConfig): Promise<void> {
    try {
      let url = STORE_REMOVE_ALL;
      await axios.get<void>(url, config);
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async removeproduct(id: number, config: AxiosRequestConfig): Promise<void> {
    try {
      let url = STORE_REMOVE_ALL;
      url += id;
      await axios.get<void>(url, config);
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getCart(config: AxiosRequestConfig): Promise<{ carts: Cart[] }> {
    try {
      let url = STORE_GET;
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
      option_id,
      product_id,
      count,
    }: {
      option_id: number;
      product_id: number;
      count: number;
    },
    config: AxiosRequestConfig
  ): Promise<void> {
    try {
      let url = STORE_ADD;
      await axios.post<void>(
        url,
        {
          option_id,
          product_id,
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
      let url = STORE_PLACE_ORDER;
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
      let url = STORE_PLACE_ORDER;
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
  static async getLanding(config: AxiosRequestConfig): Promise<{ products: Product[]; categories: Category[]; stores: User[] }> {
    try {
      let url = STORE_LANDING;
      return (await axios.get<{ products: Product[]; categories: Category[]; stores: User[] }>(url, config)).data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getRestourante(config: AxiosRequestConfig, keyword?: string): Promise<{ stores: User[] }> {
    try {
      let url = STORE_STORE;
      let data: { keyword?: string } = {};
      if (keyword) data.keyword = keyword;
      const responce = await axios.post<{ stores: User[] }>(url, data, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getProduct(id: number, config: AxiosRequestConfig): Promise<{ product: Product }> {
    try {
      let url = STORE_PRODUCT;
      url += id;
      const responce = await axios.get<{ product: Product }>(url, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getorder(id: number, config: AxiosRequestConfig): Promise<{ order: OrderStore }> {
    try {
      let url = STORE_ORDER;
      url += id;
      const responce = await axios.get<{ order: OrderStore }>(url, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
  static async getproducts(
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
  ): Promise<{ products: Product[]; categories: Category[] }> {
    try {
      let url = STORE_PRODUCTS;
      let data: { keyword?: string; categories?: number[]; user_id?: number[] } = {};
      if (keyword) data.keyword = keyword;
      if (categories) data.categories = categories;
      if (user_id) data.user_id = user_id;
      const responce = await axios.post<{ products: Product[]; categories: Category[] }>(url, data, config);
      return responce.data;
    } catch (error) {
      // @ts-ignore
      console.error("Error creating address:", error.message);
      throw error;
    }
  }
}
