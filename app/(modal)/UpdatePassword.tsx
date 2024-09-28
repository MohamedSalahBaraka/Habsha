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
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import Loading from "@/components/Utils/Loading";
import AdressService from "@/Services/AdressService";
import { useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { fullScreenHeight } from "@/constants/sizes";

export default function UpdatePassword() {
  const { Colors, userToken, logout } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState("");
  const Color = useColor({ Colors });
  const [newPassword, setNewPassword] = useState("");
  const [confiremNewPassword, setConfiremNewPassword] = useState("");
  const [responce, setResponce] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const config = useConfig();
  const networkback = () => {};
  const sendForm = useCallback(async () => {
    try {
      if (typeof oldPassword == "undefined" || oldPassword == "") {
        Alert.alert("خطأ", "عليك اضافة كلمة السر القديمة");
        return;
      }
      if (typeof newPassword == "undefined" || newPassword == "") {
        Alert.alert("خطأ", "عليك اضافة كلمة السر الجديدة");
        return;
      }
      if (typeof confiremNewPassword == "undefined" || confiremNewPassword == "") {
        Alert.alert("خطأ", "عليك تأكيد كلمة السر");
        return;
      }
      if (newPassword == confiremNewPassword) {
        setIsError(false);
        await AdressService.changePassword(config, oldPassword, newPassword);
        Alert.alert("تم", "تم تغير كلمة السر بنجاح");
        setIsLoading(false);
        router.back();
        setIsLoading(false);
      } else {
        Alert.alert("خطأ", "كلمة السر الجديدة غير متطابقة مع التأكيد");
        setNewPassword("");
        setConfiremNewPassword("");
        setOldPassword("");
        setIsLoading(false);
      }
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
  }, [oldPassword, newPassword, confiremNewPassword]);
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
          <IsErrorModal setIsModalVisible={setIsError} isModalVisible={isError} CallBack={sendForm} />

          <ScrollView style={[barakocta.p3]}>
            <Text style={[barakocta.tRight, barakocta.mb3, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>غير كلمة السر</Text>
            <Text style={[{ fontFamily: "Cairo" }]}>كلمة السر السابقة</Text>
            <TextInput
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={true}
              style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
            />
            <Text style={[Color.Danger]}>{responce}</Text>
            <Text style={[{ fontFamily: "Cairo" }]}>كلمة السر الجديدة</Text>
            <TextInput
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={true}
              style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
            />
            <Text style={[{ fontFamily: "Cairo" }]}>أكد كلمة السر</Text>
            <TextInput
              value={confiremNewPassword}
              onChangeText={setConfiremNewPassword}
              secureTextEntry={true}
              style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb3]}
            />
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
