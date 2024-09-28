export interface Dish {
  id: number;
  name: string;
  photo: string;
  details: string;
  user_id: number;
  category_id: number;
  category: Category;
  sizes: Size[];
}
export interface Product {
  id: number;
  name: string;
  photo: string;
  details: string;
  user_id: number;
  category_id: number;
  category: Category;
  options: Size[];
}
export interface Category {
  id: number;
  name: string;
  photo: string;
}
export interface Size {
  id: number;
  name: string;
  price: number;
}
export interface Address {
  id: number;
  name: string;
  neighbourhood: string;
  city_id: number;
  details: string;
  phone: string;
  city: City;
}
export interface Order {
  id: number;
  user_id: number;
  restaurant_id: number;
  delivary_id: number;
  total: number;
  fee: number;
  cancel: boolean;
  status: string;
  created_at: string;
  count: number;
  dish_order: DishOrder[];
  delivary: Delivary;
  restaurant: User;
}
export interface OrderStore {
  id: number;
  user_id: number;
  restaurant_id: number;
  delivary_id: number;
  total: number;
  fee: number;
  cancel: boolean;
  status: string;
  created_at: string;
  count: number;
  store_order_product: OrderProduct[];
  delivary: Delivary;
  restaurant: User;
}
export interface OrderProduct {
  id: number;
  price: number;
  count: number;
  product: Product;
  option: Size;
}
export interface DishOrder {
  id: number;
  price: number;
  count: number;
  dish: Dish;
  size: Size;
}
export interface City {
  id: number;
  name: string;
}
export interface Cart {
  id: number;
  count: number;
  dish: Dish;
  size: Size;
}
export interface User {
  id: number;
  name: string;
  phone: string;
  photo: string;
}
export interface Delivary {
  id: number;
  delivary_status: string;
  user_id: number;
  started_at: number;
  paid: boolean;
  start_at: number;
  finsh_at: number;
  price: number;
  fee: number;
  money: number;
  captin_id: number;
  created_at: string;
  package: string;
  cancel: boolean;
  captin: User;
  address_sent: Address;
  address_get: Address;
}
