import { ActivityIndicator, SafeAreaView, Text, View, ScrollView, Image, TouchableOpacity, Pressable } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { Feather } from "@expo/vector-icons";
import barakocta from "baracota-style";
import EmptyCart from "@/components/Utils/EmptyCart";
import Loading from "@/components/Utils/Loading";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import NoNetwork from "@/components/Modal/noNetwork";
import { useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import CartService from "@/Services/CartService";
import { Cart, Dish, DishOrder } from "@/types/Models.t";
import DishComponent from "@/components/Models/Dish";
import { ImageUrl } from "@/constants/URLs";
import { fullScreenWidth } from "@/constants/sizes";
import { AxiosError } from "axios";
import { AuthContext } from "@/context/AuthContext";
import StoreService from "@/Services/StoreService";

export default function StoreCart() {
  const { Colors, logout } = useContext(AuthContext);
  const [dishes, setdishes] = useState<Cart[]>([]);
  const [total, settotal] = useState(0);
  const router = useRouter();
  const config = useConfig();
  const [isempty, setisempty] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const [isremoveError, setIsremoveError] = useState(false);
  const [removeid, setremoveid] = useState<number>(0);
  const [isremoveAllCartError, setIsremoveAllCartError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const removeAllCart = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsremoveAllCartError(false);
      await StoreService.removeAll(config);
      setdishes([]);
      setIsLoading(false);
      setisempty(true);
    } catch (error) {
      setIsremoveAllCartError(true);
      const e = error as AxiosError<{ message: string }>;
      setIsLoading(false);
      console.log("remove Dish ", e?.response?.data.message);
      console.log("remove Dish ", e?.response?.status);
      if (e?.response?.status == 401) {
        await logout();
        return;
      }
    }
  }, []);
  const getTotal = (dishes: Cart[]) => {
    let tota = 0;
    dishes.forEach((element) => {
      let count = element.count;
      let price = element.size.price;
      let time = price * count;
      tota += time;
    });
    settotal(tota);
  };
  const remove = useCallback(async (id: number) => {
    try {
      setremoveid(id);
      setIsLoading(true);
      setIsremoveAllCartError(false);
      await StoreService.removeproduct(id, config);
      fetchData();
    } catch (error) {
      setIsremoveAllCartError(true);
      const e = error as AxiosError<{ message: string }>;
      setIsLoading(false);
      console.log("remove Dish ", e?.response?.data.message);
      console.log("remove Dish ", e?.response?.status);
      if (e?.response?.status == 401) {
        await logout();
        return;
      }
    }
  }, []);
  const renderdishes = dishes?.map((item, index) => {
    return (
      <DishComponent
        Colors={Colors}
        key={index}
        count={item.count}
        remove={() => {
          remove(item.id);
        }}
        sizename={item.size.name}
        title={item.dish.name}
        price={item.size.price}
        uri={ImageUrl + item.dish.photo}
        category={item.dish.category.name}
      />
    );
  });
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsFetchDataError(false);
      const data = await StoreService.getCart(config);
      setdishes(data.carts);
      if (data.carts.length == 0) {
        setisempty(true);
      }
      getTotal(data.carts);
      setIsLoaded(true);
      setIsLoading(false);
    } catch (error) {
      setIsFetchDataError(true);
      const e = error as AxiosError<{ message: string }>;
      setIsLoading(false);
      console.log("remove Dish ", e?.response?.data.message);
      console.log("remove Dish ", e?.response?.status);
      if (e?.response?.status == 401) {
        await logout();
        return;
      }
    }
  }, []);
  useEffect(() => {
    console.log("AddressList");
    fetchData();
  }, []);
  const networkback = () => {
    if (!isLoaded) fetchData();
  };
  return (
    <SafeAreaView style={[barakocta.fFill]}>
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end", backgroundColor: "transparent" }}>
        <Pressable
          onPress={() => {
            router.back();
          }}
          style={[{ height: "60%", width: "100%", position: "relative", top: 27, backgroundColor: Colors.tertiary, opacity: 0.15 }]}
        ></Pressable>
        <View
          style={[
            { height: "50%", width: "100%", overflow: "hidden", backgroundColor: Colors.fourth, borderTopEndRadius: 50, borderTopStartRadius: 50 },
          ]}
        >
          <NoNetwork CallBack={networkback} />
          <IsErrorModal
            setIsModalVisible={setIsremoveError}
            isModalVisible={isremoveError}
            CallBack={() => {
              remove(removeid);
            }}
          />
          <IsErrorModal isModalVisible={isremoveAllCartError} setIsModalVisible={setIsremoveAllCartError} CallBack={removeAllCart} />
          <IsErrorModal isModalVisible={isFetchDataError} setIsModalVisible={setIsFetchDataError} CallBack={fetchData} />
          {isLoaded ? (
            isempty ? (
              <EmptyCart />
            ) : (
              <>
                <ScrollView style={[barakocta.p2, barakocta.pt4]}>
                  <View style={[barakocta.fRow]}>
                    <TouchableOpacity onPress={removeAllCart} style={[barakocta.jcCenter, barakocta.aiCenter, { width: fullScreenWidth * 0.1 }]}>
                      <Feather name="x-circle" size={24} color={Colors.secondary} />
                    </TouchableOpacity>
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>السلة</Text>
                  </View>
                  {renderdishes}
                  <View style={[barakocta.fRow, barakocta.mt4, barakocta.jcBetween, barakocta.w100, barakocta.px2]}>
                    <View style={[barakocta.fRow]}>
                      <Text style={[{ color: Colors.secondary, fontFamily: "Alexandria", fontSize: 8 }]}>جنيه</Text>
                      <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 12 }]}>{total}</Text>
                    </View>
                    <View style={[barakocta.fRow]}>
                      <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 12 }]}>المبلغ الكلي:</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      router.push("/CheckOutStore");
                    }}
                    style={[barakocta.fRow, barakocta.jcCenter, barakocta.aiCenter, { height: 100, backgroundColor: Colors.primary }]}
                  >
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>اطلب</Text>
                    <Feather name="check-circle" size={48} color={Colors.tertiary} />
                  </TouchableOpacity>
                </ScrollView>
                <Loading isLoading={isLoading} />
              </>
            )
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              <ActivityIndicator size={"large"} color={Colors.primary} />
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
