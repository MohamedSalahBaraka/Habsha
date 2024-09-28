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
  Alert,
} from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import barakocta, { useColor } from "baracota-style";
import Loading from "@/components/Utils/Loading";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import { useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import AdressService from "@/Services/AdressService";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { fullScreenHeight } from "@/constants/sizes";

export default function UpdateInfo() {
  const { Colors, logout, user, setUser, save } = useContext(AuthContext);
  const [phone, setphone] = useState(user?.phone);
  const Color = useColor({ Colors });
  const [name, setname] = useState(user?.name);
  const [PhoneError, setPhoneError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const config = useConfig();
  const networkback = () => {};
  const sendForm = useCallback(async () => {
    try {
      if (typeof name == "undefined" || name == "") {
        Alert.alert("خطأ", "عليك اضافة الاسم");
        return;
      }
      if (typeof phone == "undefined" || phone == "") {
        Alert.alert("خطأ", "عليك اضافة رقم الهاتف");
        return;
      }
      setIsError(false);
      await AdressService.updateInfo(config, name, phone);
      let usera = user;
      if (usera) {
        usera.phone = phone;
        usera.name = name;
      }
      setUser(usera);
      save("user", JSON.stringify(usera));
      Alert.alert("تم", "تم تحديث البيانات بنجاح");
      router.back();
      setIsLoading(false);
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
  }, [name, phone]);
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
          <IsErrorModal isModalVisible={isError} setIsModalVisible={setIsError} CallBack={sendForm} />

          <ScrollView style={[barakocta.p3, barakocta.pt4]}>
            <Text style={[barakocta.tRight, barakocta.mb3, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>معلومات المستخدم</Text>
            <Text style={[{ fontFamily: "Cairo" }]}>الاسم</Text>
            <TextInput
              value={name}
              onChangeText={setname}
              style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
            />
            <Text style={[{ fontFamily: "Cairo" }]}>رقم الهاتف</Text>
            <TextInput
              value={phone}
              keyboardType="numeric"
              onChangeText={setphone}
              style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
            />
            <Text style={[Color.Danger]}>{PhoneError}</Text>
            <TouchableOpacity
              style={[barakocta.p3, { backgroundColor: Colors.secondary, width: fullScreenHeight * 0.17, borderRadius: 30 }, barakocta.mxAuto]}
              onPress={() => {
                sendForm();
              }}
            >
              <Text style={[barakocta.tCenter, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 16 }]}>حفظ</Text>
            </TouchableOpacity>
          </ScrollView>
          <Loading isLoading={isLoading} />
        </View>
      </View>
    </SafeAreaView>
  );
}
