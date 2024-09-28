import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Text,
  TextInput,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Pressable,
} from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import barakocta from "baracota-style";
import axios, { AxiosError } from "axios";
import Dish from "@/components/Models/Dish";
import { ImageUrl } from "@/constants/URLs";
import { DishOrder, Dish as DishType } from "@/types/Models.t";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import { useLocalSearchParams, useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import CartService from "@/Services/CartService";
import GetService from "@/Services/GetService";
import { AuthContext } from "@/context/AuthContext";

export default function OrderDetails() {
  const { Colors, userToken, logout } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [total, settotal] = useState(0);
  const router = useRouter();
  const config = useConfig();
  const params = useLocalSearchParams();
  const { id = "2p" } = params;
  const [dishes, setdishes] = useState<DishOrder[]>();
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const fetchData = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      const data = await GetService.getorder(parseInt(id.toString()), config);
      setdishes(data.order.dish_order);
      settotal(data.order.total);
      setIsLoaded(true);
    } catch (error) {
      setIsFetchDataError(true);
      const e = error as AxiosError<{ message: string }>;
      console.log("remove Dish ", e?.response?.data.message);
      console.log("remove Dish ", e?.response?.status);
      if (e?.response?.status == 401) {
        await logout();
        return;
      }
    }
  }, []);
  useEffect(() => {
    console.log("Dish");
    fetchData();
  }, []);
  const renderdishes = dishes?.map((item, index) => {
    return (
      <Dish
        Colors={Colors}
        key={index}
        uri={ImageUrl + item.dish?.photo}
        title={item.dish?.name}
        category={item.dish?.category?.name}
        price={item.price}
        sizename={item.size?.name}
        count={item.count}
      />
    );
  });
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

          <IsErrorModal setIsModalVisible={setIsFetchDataError} isModalVisible={isFetchDataError} CallBack={fetchData} />
          {isLoaded ? (
            <ScrollView style={[barakocta.p2, barakocta.pt4]}>
              <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>تفاصيل الطلب</Text>
              <View style={[barakocta.fRow, barakocta.mt4, barakocta.jcBetween, barakocta.w100, barakocta.px2]}>
                <View style={[barakocta.fRow]}>
                  <Text style={[{ color: Colors.secondary, fontFamily: "Alexandria", fontSize: 8 }]}>جنيه</Text>
                  <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 12 }]}>{total}</Text>
                </View>
                <View style={[barakocta.fRow]}>
                  <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 12 }]}>المبلغ الكلي:</Text>
                </View>
              </View>
              {renderdishes}
              <View style={{ height: 50 }}></View>
            </ScrollView>
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
