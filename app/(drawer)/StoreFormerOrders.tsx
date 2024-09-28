import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import barakocta from "baracota-style";
import OrderComponent from "@/components/Models/Order";
import { Order, OrderStore } from "@/types/Models.t";
import { fullScreenHeight } from "@/constants/sizes";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import CartService from "@/Services/CartService";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";
import StoreService from "@/Services/StoreService";
import { DrawerActions } from "@react-navigation/native";

export default function StoreFormerOrders() {
  const { Colors, logout } = useContext(AuthContext);
  const [orders, setorders] = useState<OrderStore[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const config = useConfig();
  const navigation = useNavigation();
  const router = useRouter();
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const renderOrders = orders?.map((item, index) => {
    let date = new Date(item.created_at);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let publish = `${year}-${month}-${day}`;
    return (
      <OrderComponent
        Colors={Colors}
        status={item.status}
        price={item.total}
        id={item.id}
        key={index}
        captin={item.delivary?.captin}
        date={publish}
        title={item.restaurant?.name}
      />
    );
  });
  const fetchData = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      const data = await StoreService.formerOrder(config);
      setorders(data.orders);
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
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const networkback = () => {
    if (!isLoaded) fetchData();
  };
  return (
    <SafeAreaView style={[barakocta.fFill]}>
      <NoNetwork CallBack={networkback} />
      <IsErrorModal setIsModalVisible={setIsFetchDataError} isModalVisible={isFetchDataError} CallBack={fetchData} />
      {isLoaded ? (
        <>
          <ScrollView>
            <View
              style={[
                barakocta.jcCenter,
                {
                  height: fullScreenHeight * 0.4,
                  borderBottomEndRadius: fullScreenHeight * 0.1,
                  borderBottomStartRadius: fullScreenHeight * 0.1,
                  width: "100%",
                  backgroundColor: Colors.primary,
                },
              ]}
            >
              <Image
                source={require("@/assets/images/Drive-thru-pana.png")}
                resizeMode={"contain"}
                style={[barakocta.mxAuto, { width: fullScreenHeight * 0.3, height: fullScreenHeight * 0.3 }, barakocta.my0, barakocta.p0]}
              />
            </View>
            <View
              style={[
                { backgroundColor: Colors.fourth, borderRadius: 20 },
                barakocta.pt3,
                barakocta.px2,
                barakocta.positionRelative,
                barakocta.m4,
                { top: -100 },
              ]}
            >
              <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>الطلبات السابقة:</Text>
              {renderOrders}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[barakocta.positionAbsolute, { right: 20, top: 30 }]}
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          >
            <Image
              source={require("@/assets/images/icons8-bars-96.png")}
              resizeMode={"contain"}
              style={[barakocta.mxAuto, { width: 50, height: 50 }, barakocta.my0, barakocta.p0]}
            />
          </TouchableOpacity>
        </>
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
    </SafeAreaView>
  );
}
