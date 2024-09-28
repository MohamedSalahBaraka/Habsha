import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import barakocta from "baracota-style";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import NoNetwork from "@/components/Modal/noNetwork";
import { fullScreenHeight, fullScreenWidth } from "@/constants/sizes";
import { ImageUrl } from "@/constants/URLs";
import GetService from "@/Services/GetService";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { AuthContext } from "@/context/AuthContext";
import { DrawerActions } from "@react-navigation/native";

export default function Home() {
  const { Colors, setColors, setUser, logout } = useContext(AuthContext);
  const [isLoaded, setIsLoaded] = useState(false);
  const [facebook, setfacebook] = useState<string>();
  const [instagram, setinstagram] = useState<string>();
  const [twitter, settwitter] = useState<string>();
  const [youtube, setyoutube] = useState<string>();
  const [telegram, settelegram] = useState<string>();
  const [whatsapp, setwhatsapp] = useState<string>();
  const [sitename, setsitename] = useState<string>();
  const [isError, setIsError] = useState(false);
  const [logo, setlogo] = useState<string>();
  const config = useConfig();
  const router = useRouter();
  const navigation = useNavigation();
  const fetchData = useCallback(async () => {
    try {
      setIsError(false);

      const token = await SecureStore.getItemAsync("userToken");
      const data = await GetService.getHome({
        timeout: 10000,
        headers: { Authorization: `Bearer ${token}` },
      });
      let pcolor = "#FFCA3A";
      let scolor = "#F97068";
      if (data.setting.primaryColor) pcolor = data.setting.primaryColor;
      if (data.setting.secondaryColor) scolor = data.setting.secondaryColor;
      setColors((pre) => ({
        ...pre,
        primary: pcolor,
        secondary: scolor,
      }));
      setfacebook(data.setting.facebook);
      setinstagram(data.setting.instagram);
      settwitter(data.setting.twitter);
      setyoutube(data.setting.youtube);
      settelegram(data.setting.telegram);
      setwhatsapp(data.setting.whatsapp);
      setUser(data.user);
      setsitename(data.setting.sitename);
      setlogo(ImageUrl + data.setting.logo);
      setIsLoaded(true);
    } catch (error) {
      setIsError(true);
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
      <IsErrorModal setIsModalVisible={setIsError} isModalVisible={isError} CallBack={fetchData} />
      <NoNetwork CallBack={networkback} />
      {isLoaded ? (
        <>
          <ScrollView>
            <View
              style={[
                {
                  height: fullScreenHeight * 0.2,
                  borderBottomEndRadius: fullScreenHeight * 0.1,
                  borderBottomStartRadius: fullScreenHeight * 0.1,
                  width: "100%",
                  backgroundColor: Colors.primary,
                },
              ]}
            ></View>
            <View
              style={[
                barakocta.positionAbsolute,
                { top: fullScreenHeight * 0.9, left: fullScreenWidth * 0.8 },
                {
                  width: fullScreenHeight * 0.075,
                  height: fullScreenHeight * 0.075,
                  borderRadius: fullScreenHeight * 0.0375,
                  backgroundColor: Colors.primary,
                },
              ]}
            ></View>
            <View
              style={[
                barakocta.positionAbsolute,
                { top: fullScreenHeight * 0.8, left: fullScreenWidth * 0.25 },
                {
                  width: fullScreenHeight * 0.175,
                  height: fullScreenHeight * 0.175,
                  borderRadius: (fullScreenHeight * 0.175) / 2,
                  backgroundColor: Colors.primary,
                },
              ]}
            ></View>
            <View
              style={[
                barakocta.positionAbsolute,
                { top: fullScreenHeight * 0.58, left: fullScreenWidth * 0.3 },
                {
                  width: fullScreenHeight * 0.29,
                  height: fullScreenHeight * 0.29,
                  borderRadius: (fullScreenHeight * 0.29) / 2,
                  backgroundColor: Colors.primary,
                },
              ]}
            ></View>
            <View
              style={[
                barakocta.positionAbsolute,
                { top: fullScreenHeight * 0.46, left: fullScreenWidth * 0.075 },
                {
                  width: fullScreenHeight * 0.1,
                  height: fullScreenHeight * 0.1,
                  borderRadius: (fullScreenHeight * 0.1) / 2,
                  backgroundColor: Colors.primary,
                },
              ]}
            ></View>
            <View
              style={[
                barakocta.positionAbsolute,
                { top: fullScreenHeight * 0.37, left: fullScreenWidth * 0.2 },
                {
                  width: fullScreenHeight * 0.05,
                  height: fullScreenHeight * 0.05,
                  borderRadius: (fullScreenHeight * 0.05) / 2,
                  backgroundColor: Colors.primary,
                },
              ]}
            ></View>
            <View style={[{ backgroundColor: Colors.fourth, borderRadius: 20 }, barakocta.positionRelative, barakocta.m4, { top: -100 }]}>
              <Image
                source={{ uri: logo }}
                resizeMode={"contain"}
                style={[barakocta.mxAuto, { width: fullScreenHeight * 0.17, height: fullScreenHeight * 0.17 }, barakocta.my0, barakocta.p0]}
              />
              <Text style={[barakocta.tCenter, { color: Colors.tertiary, fontFamily: "ElMessiri", fontSize: 24 }]}>{sitename}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                router.push("OrderDelivarey");
              }}
              style={[
                barakocta.mxAuto,
                barakocta.jcCenter,
                barakocta.positionRelative,
                { top: -fullScreenHeight * 0.1 },
                { backgroundColor: Colors.secondary, height: fullScreenHeight * 0.25, width: fullScreenHeight * 0.25, borderRadius: 30 },
              ]}
            >
              <Image
                source={require("@/assets/images/icons8-delivery-80.png")}
                resizeMode={"contain"}
                style={[barakocta.mxAuto, { width: fullScreenHeight * 0.1, height: fullScreenHeight * 0.1 }, barakocta.my0, barakocta.p0]}
              />
              <Text style={[barakocta.tCenter, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 24 }]}>وصل غرضك</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                router.push("Landing");
              }}
              style={[
                barakocta.mxAuto,
                barakocta.jcCenter,
                barakocta.positionRelative,
                { top: -fullScreenHeight * 0.05 },
                { backgroundColor: Colors.secondary, height: fullScreenHeight * 0.25, width: fullScreenHeight * 0.25, borderRadius: 30 },
              ]}
            >
              <Image
                source={require("@/assets/images/icons8-restaurant-menu-64.png")}
                resizeMode={"contain"}
                style={[barakocta.mxAuto, { width: fullScreenHeight * 0.1, height: fullScreenHeight * 0.1 }, barakocta.my0, barakocta.p0]}
              />
              <Text style={[barakocta.tCenter, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 24 }]}>اطلب طعامك</Text>
            </TouchableOpacity>
            <View style={{ height: fullScreenHeight * 0.05 }}></View>
            <View
              style={[
                barakocta.fRow,
                barakocta.p2,
                barakocta.positionAbsolute,
                barakocta.w75,
                { top: fullScreenHeight * 0.95, left: fullScreenWidth * 0.125, backgroundColor: Colors.secondary },
                barakocta.jcEven,
                { borderRadius: 40 },
              ]}
            >
              {facebook ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(facebook);
                  }}
                >
                  <FontAwesome5 name="facebook" size={24} color={Colors.fourth} />
                </TouchableOpacity>
              ) : null}
              {instagram ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(instagram);
                  }}
                >
                  <FontAwesome5 name="instagram" size={24} color={Colors.fourth} />
                </TouchableOpacity>
              ) : null}
              {twitter ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(twitter);
                  }}
                >
                  <FontAwesome5 name="twitter" size={24} color={Colors.fourth} />
                </TouchableOpacity>
              ) : null}
              {telegram ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(telegram);
                  }}
                >
                  <FontAwesome5 name="telegram" size={24} color={Colors.fourth} />
                </TouchableOpacity>
              ) : null}
              {youtube ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(youtube);
                  }}
                >
                  <FontAwesome5 name="youtube" size={24} color={Colors.fourth} />
                </TouchableOpacity>
              ) : null}
              {whatsapp ? (
                <TouchableOpacity
                  onPress={() => {
                    Linking.openURL(whatsapp);
                  }}
                >
                  <FontAwesome5 name="whatsapp" size={24} color={Colors.fourth} />
                </TouchableOpacity>
              ) : null}
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
