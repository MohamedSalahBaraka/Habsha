import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import barakocta, { useColor } from "baracota-style";
import { fullScreenHeight } from "@/constants/sizes";
import Loading from "@/components/Utils/Loading";
import UserService from "@/Services/UserService";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";
import * as SecureStore from "expo-secure-store";
import { useRouter } from "expo-router";
export default function Login() {
  const { Colors, save, setUserToken, setUser, expoToken } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const Color = useColor({ Colors });
  const router = useRouter();
  const [phone, setphone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [phonerespoce, setphonerespoce] = useState("");
  const [typeResponce, settypeResponce] = useState("");
  const [passwordresponce, setpasswordresponce] = useState("");
  useEffect(() => {
    const IsLoggedIn = async () => {
      try {
        let result = await SecureStore.getItemAsync("userToken");
        if (result) router.replace("(drawer)");
      } catch (error) {
        console.log(error);
      }
    };
    IsLoggedIn();
  }, []);
  const login = useCallback(async () => {
    try {
      setIsLoading(true);
      let type = "user";
      const data = await UserService.login(phone, password, type);
      setUserToken(data.token);
      save("userToken", data.token);
      setUser(data.user);
      save("user", JSON.stringify(data.user));
      await UserService.notfictionSubsicribe(data.token, expoToken || "");
      setIsLoading(false);
      router.replace("(drawer)");
    } catch (error) {
      const e = error as AxiosError<{ type: string; phone: string; password: string }>;
      settypeResponce("حاول مجدداً");
      if (e?.response?.status === 422) {
        settypeResponce(e?.response?.data.type);
        setphonerespoce(e?.response?.data.phone);
        setpasswordresponce(e?.response?.data.password);
      }
      setIsLoading(false);
    }
  }, [phone, password]);
  return (
    <SafeAreaView style={[barakocta.fFill]}>
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
            source={require("@/assets/images/Fingerprint-pana.png")}
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
          <Image
            source={require("@/assets/images/icon2.png")}
            resizeMode={"contain"}
            style={[barakocta.mxAuto, { width: fullScreenHeight * 0.17, height: fullScreenHeight * 0.17 }, barakocta.my0, barakocta.p0]}
          />
          <Text style={[barakocta.tCenter, { color: Colors.tertiary, fontFamily: "ElMessiri", fontSize: 24 }]}>هبشة | HAPSHA</Text>
          <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>تسجيل دخول</Text>
          <Text style={[Color.Danger]}>{typeResponce}</Text>
          <Text style={[{ fontFamily: "Cairo" }]}>رقم الهاتف</Text>
          <TextInput
            style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
            value={phone}
            keyboardType="numeric"
            onChangeText={setphone}
          />
          <Text style={[Color.Danger]}>{phonerespoce}</Text>
          <Text style={[{ fontFamily: "Cairo" }]}>كلمة السر</Text>
          <TextInput
            style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
          />
          <Text style={[Color.Danger]}>{passwordresponce}</Text>
          <TouchableOpacity
            style={[barakocta.p3, { backgroundColor: Colors.secondary, width: fullScreenHeight * 0.17, borderRadius: 30 }, barakocta.mxAuto]}
            onPress={() => {
              login();
            }}
          >
            <Text style={[barakocta.tCenter, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 16 }]}>سجل دخولك</Text>
          </TouchableOpacity>
          <View style={[barakocta.fRow, barakocta.my2, barakocta.jcEnd]}>
            <TouchableOpacity
              onPress={() => {
                router.replace("Register");
              }}
            >
              <Text style={[{ color: "#1850a5", fontFamily: "Cairo" }]}>سجل حساب جديد </Text>
            </TouchableOpacity>
            <Text style={[{ fontFamily: "Cairo" }]}>ليس لديك حساب </Text>
          </View>
        </View>
      </ScrollView>
      <Loading isLoading={isLoading} />
    </SafeAreaView>
  );
}
