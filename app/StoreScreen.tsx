import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import barakocta, { useColor } from "baracota-style";
import Resturant from "@/components/Models/Resturant";
import { User } from "@/types/Models.t";
import { fullScreenHeight } from "@/constants/sizes";
import Loading from "@/components/Utils/Loading";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import NoNetwork from "@/components/Modal/noNetwork";
import GetService from "@/Services/GetService";
import { useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import { AxiosError } from "axios";
import { AuthContext } from "@/context/AuthContext";
import Store from "@/components/Models/Store";
import StoreService from "@/Services/StoreService";

export default function StoreScreen() {
  const { Colors, logout } = useContext(AuthContext);
  const [keyword, setKeyword] = useState("");
  const Color = useColor({ Colors });
  const router = useRouter();
  const [stores, setstores] = useState<User[]>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const [isSearchError, setIsSearchError] = useState(false);
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const renderrestaurante = stores?.map((cb, index) => {
    return <Store Colors={Colors} user_id={cb.id} Title={cb.name} uri={cb.photo} key={index} />;
  });
  const fetchData = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      const data = await StoreService.getRestourante(config);
      setstores(data.stores);
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
  const search = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsSearchError(false);
      const data = await StoreService.getRestourante(config, keyword);
      setstores(data.stores);
      setIsLoaded(true);
      setIsLoading(false);
    } catch (error) {
      setIsSearchError(true);
      const e = error as AxiosError<{ message: string }>;
      console.log("remove Dish ", e?.response?.data.message);
      console.log("remove Dish ", e?.response?.status);
      if (e?.response?.status == 401) {
        await logout();
        return;
      }
    }
  }, [keyword]);
  useEffect(() => {
    console.log("Restaurant");
    fetchData();
  }, []);
  const networkback = () => {
    if (!isLoaded) fetchData();
  };
  return (
    <SafeAreaView style={[barakocta.fFill]}>
      <IsErrorModal setIsModalVisible={setIsFetchDataError} isModalVisible={isFetchDataError} CallBack={fetchData} />
      <IsErrorModal setIsModalVisible={setIsSearchError} isModalVisible={isSearchError} CallBack={search} />
      <NoNetwork CallBack={networkback} />
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
                source={require("@/assets/images/Chef-bro.png")}
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
              <View style={[Color.bgLight, barakocta.w100, barakocta.pb3, barakocta.aiCenter]}>
                <View
                  style={[
                    { borderRadius: 30 },
                    { borderWidth: 1, borderColor: Colors.tertiary, borderStyle: "dashed" },
                    barakocta.w100,
                    barakocta.px3,
                    barakocta.fRow,
                  ]}
                >
                  <TouchableOpacity onPress={search} style={[barakocta.p2]}>
                    <FontAwesome5 name="search" size={20} color={Colors.tertiary} />
                  </TouchableOpacity>
                  <TextInput value={keyword} onChangeText={setKeyword} style={[barakocta.fFill]} placeholder="إبحث..." />
                </View>
              </View>
              <Text style={[barakocta.tRight, barakocta.my3, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>المتاجر</Text>
              <View style={[barakocta.fRow, barakocta.fWrap]}>{renderrestaurante}</View>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[barakocta.positionAbsolute, { right: 20, bottom: 30 }]}
            onPress={() => {
              router.push("(modal)/StoreCart");
            }}
          >
            <Image
              source={require("@/assets/images/icons8-cart-100.png")}
              resizeMode={"contain"}
              style={[barakocta.mxAuto, { width: 70, height: 70 }, barakocta.my0, barakocta.p0]}
            />
          </TouchableOpacity>
          <Loading isLoading={isLoading} />
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
