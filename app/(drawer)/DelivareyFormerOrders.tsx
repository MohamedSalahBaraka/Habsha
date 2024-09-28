import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import barakocta from "baracota-style";
import { Delivary, Order } from "@/types/Models.t";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import { fullScreenHeight } from "@/constants/sizes";
import CartService from "@/Services/CartService";
import useConfig from "@/hooks/useConfig";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";
import DelivaryComponent from "@/components/Models/Delivary";
import { DrawerActions } from "@react-navigation/native";

export default function DelivareyFormerOrders() {
  const { Colors, userToken, logout } = useContext(AuthContext);
  const [orders, setorders] = useState<Delivary[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFetchDataError, setIsFetchDataError] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();
  const config = useConfig();
  const renderOrders = orders?.map((item, index) => {
    let date = new Date(item.created_at);
    let day = date.getDate();
    let month = date.getMonth();
    let year = date.getFullYear();
    let publish = `${year}-${month}-${day}`;
    console.log(item);
    return (
      <DelivaryComponent
        Colors={Colors}
        status={item.delivary_status}
        money={item.money}
        neighbourhoodSent={item.address_sent?.neighbourhood}
        citySent={item.address_sent?.city?.name}
        neighbourhoodGet={item.address_get?.neighbourhood}
        cityGet={item.address_get?.city?.name}
        captin={item.captin}
        date={publish}
        key={index}
        title={item.package}
      />
    );
  });
  const fetchData = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      const data = await CartService.formerDelivary(config);
      setorders(data.delivaries);
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
                source={require("@/assets/images/icons8-package-64.png")}
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
              // router.push('MyModal');
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
