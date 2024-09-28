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
  Alert,
} from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import * as Linking from "expo-linking";
import barakocta, { useColor } from "baracota-style";
import { fullScreenHeight } from "@/constants/sizes";
import Loading from "@/components/Utils/Loading";
import UserService from "@/Services/UserService";
import { AxiosError } from "axios";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "expo-router";

export default function Register() {
  const { Colors, userToken, expoToken, setUserToken, setUser, save } = useContext(AuthContext);
  const [PhoneError, setPhoneError] = useState("");
  const [password, setPassword] = useState("");
  const Color = useColor({ Colors });
  const router = useRouter();
  const [passwordConfirm, setpasswordConfirm] = useState("");
  const [name, setname] = useState("");
  const [phone, setphone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const register = useCallback(async () => {
    if (typeof password === "undefined" || password === "") {
      Alert.alert("خطأ", "عليك اضافة كلمة اسر");
      return;
    }
    if (typeof name == "undefined" || name == "") {
      Alert.alert("خطأ", "عليك اضافة الأسم");
      return;
    }
    if (typeof phone == "undefined" || phone == "") {
      Alert.alert("خطأ", "عليك اضافة رقم الهاتف");
      return;
    }
    setIsLoading(true);
    if (password == passwordConfirm) {
      try {
        const data = await UserService.register(name, phone, password);
        setUserToken(data.token);
        save("userToken", data.token);
        setUser(data.user);
        save("user", JSON.stringify(data.user));
        await UserService.notfictionSubsicribe(data.token, expoToken || "");
        setIsLoading(false);
        router.replace("(drawer)");
      } catch (error) {
        const e = error as AxiosError<{ errors: { phone: string } }>;
        console.log(e);
        console.log(e?.response?.data);
        setPhoneError(e?.response?.data.errors.phone || "");
        setIsLoading(false);
      }
    } else {
      Alert.alert("خطأ", "كلمة السر غير متطابقة مع التأكيد");
      setPassword("");
      setpasswordConfirm("");
      setIsLoading(false);
    }
  }, [password, name, phone, passwordConfirm]);
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
            source={require("@/assets/images/Mobile-login-pana.png")}
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
          <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>تسجيل حساب جديد</Text>
          <Text style={[{ fontFamily: "Cairo" }]}>الاسم</Text>
          <TextInput
            value={name}
            onChangeText={setname}
            style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
          />
          <Text style={[{ fontFamily: "Cairo" }]}>رقم الهاتف</Text>
          <TextInput
            value={phone}
            onChangeText={setphone}
            keyboardType="numeric"
            style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
          />
          <Text style={[Color.Danger]}>{PhoneError}</Text>
          <Text style={[{ fontFamily: "Cairo" }]}>كلمة السر</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
          />
          <Text style={[{ fontFamily: "Cairo" }]}>أكد كلمة السر</Text>
          <TextInput
            value={passwordConfirm}
            onChangeText={setpasswordConfirm}
            secureTextEntry={true}
            style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
          />
          <View style={[barakocta.fRow, barakocta.my2, barakocta.jcEnd]}>
            <TouchableOpacity
              onPress={() => {
                Linking.openURL("https://habsha.top/page/privacyPolicy");
              }}
            >
              <Text style={[{ color: "#1850a5", fontFamily: "Cairo" }]}>بتسجيل حسابك انت توافق على سياسة الخصوصية</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[barakocta.p3, { backgroundColor: Colors.secondary, width: fullScreenHeight * 0.17, borderRadius: 30 }, barakocta.mxAuto]}
            onPress={() => {
              register();
            }}
          >
            <Text style={[barakocta.tCenter, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 16 }]}>سجل حسابك</Text>
          </TouchableOpacity>
          <View style={[barakocta.fRow, barakocta.my2, barakocta.jcEnd]}>
            <TouchableOpacity
              onPress={() => {
                router.replace("/");
              }}
            >
              <Text style={[{ color: "#1850a5", fontFamily: "Cairo" }]}>سجل دخولك</Text>
            </TouchableOpacity>
            <Text style={[{ fontFamily: "Cairo" }]}> لديك حساب </Text>
          </View>
        </View>
      </ScrollView>
      <Loading isLoading={isLoading} />
    </SafeAreaView>
  );
}
