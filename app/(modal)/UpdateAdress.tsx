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
import { Picker } from "@react-native-picker/picker";
import barakocta, { useColor } from "baracota-style";
import axios, { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import Loading from "@/components/Utils/Loading";
import { City } from "@/types/Models.t";
import AdressService from "@/Services/AdressService";
import { AuthContext } from "@/context/AuthContext";
import AdressList from "@/components/Modal/AdressList";

export default function UpdateAdress() {
  const { Colors, logout } = useContext(AuthContext);
  const router = useRouter();
  const config = useConfig();
  const Color = useColor({ Colors });
  const params = useLocalSearchParams();
  const { type = "2p" } = params;
  const [isLoaded, setIsLoaded] = useState(false);
  const [cities, setcities] = useState<City[]>([]);
  const [city, setcity] = useState<number>(0);
  const [neighbourhood, setneighbourhood] = useState<string>("");
  const [details, setdetails] = useState<string>("");
  const [phone, setphone] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const [isAddressList, setIsAddressList] = useState(false);
  const [isError, setIsError] = useState(false);
  const networkback = () => {
    if (!isLoaded) fetchData();
  };
  const sendForm = useCallback(async () => {
    try {
      if (typeof city == "undefined") {
        Alert.alert("خطأ", "عليك اختيار مدينة");
        return;
      }
      if (typeof neighbourhood == "undefined" || neighbourhood == "") {
        Alert.alert("خطأ", "عليك اضافة الحي التسلم");
        return;
      }
      setIsError(false);
      await AdressService.updateAdress({ city, details, name, neighbourhood, phone, type: type.toString() }, config);
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
  }, [city, details, name, neighbourhood, phone]);
  const fetchData = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      const data = await AdressService.getaddress(type.toString(), config);
      setcities(data.cities);
      console.log(data);
      if (data.address) {
        setneighbourhood(data.address.neighbourhood);
        setdetails(data.address.details);
        setcity(data.address.city_id);
        setname(data.address.name);
        setphone(data.address.phone);
      }
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
  const renderCities = cities?.map((item) => {
    return <Picker.Item label={item.name} value={item.id} key={item.id} />;
  });
  useEffect(() => {
    console.log("Dish");
    fetchData();
  }, []);
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
          <IsErrorModal setIsModalVisible={setIsError} isModalVisible={isError} CallBack={sendForm} />
          <AdressList
            isModalVisible={isAddressList}
            setIsModalVisible={setIsAddressList}
            setcity={setcity}
            setdetails={setdetails}
            setname={setname}
            setneighbourhood={setneighbourhood}
            setphone={setphone}
          />
          {isLoaded ? (
            <>
              <ScrollView style={[barakocta.p2, barakocta.pt4]}>
                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>العنوان الافتراضي</Text>
                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 12 }]}>
                  ان كنت ستقوم بالكثير من الطلبات تعين عنوان افتراضي سيكون مفيداً، لا تقلق يمكنك دائما معاينته والتعديل عليه قبل ارسال الطلب
                </Text>
                <View style={[barakocta.fRow, barakocta.jcBetween, barakocta.aiCenter]}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsAddressList(true);
                    }}
                  >
                    <Image
                      source={require("@/assets/images/icons8-address-100.png")}
                      resizeMode={"contain"}
                      style={[barakocta.mxAuto, { width: 50, height: 50 }, barakocta.my0, barakocta.p0]}
                    />
                    <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 10 }]}>عنوان سابق</Text>
                  </TouchableOpacity>
                  <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 16 }]}>عنوان التوصيل:</Text>
                </View>
                <View style={[barakocta.jcCenter, barakocta.mb0, barakocta.aiCenter]}>
                  <Text style={[{ fontFamily: "Cairo" }]}>المدينة</Text>
                  <Picker
                    style={[Color.bgLight, barakocta.w75, barakocta.mxAuto, barakocta.br1, barakocta.mb0]}
                    selectedValue={city}
                    onValueChange={(itemValue) => {
                      setcity(itemValue);
                    }}
                  >
                    {renderCities}
                  </Picker>
                  <Text style={[{ fontFamily: "Cairo" }]}>الحي</Text>
                  <TextInput
                    value={neighbourhood}
                    onChangeText={setneighbourhood}
                    style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                  />
                  <Text style={[{ fontFamily: "Cairo" }]}>تفاصيل اضافية للعنوان(اختياري)</Text>
                  <TextInput
                    value={details}
                    onChangeText={setdetails}
                    style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                    multiline={true}
                    numberOfLines={4}
                  />
                  <Text style={[{ fontFamily: "Cairo" }]}>اسم</Text>
                  <TextInput
                    value={name}
                    onChangeText={setname}
                    style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                  />
                  <Text style={[{ fontFamily: "Cairo" }]}>رقم هاتف</Text>
                  <TextInput
                    value={phone}
                    keyboardType="numeric"
                    onChangeText={setphone}
                    style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                  />
                </View>
                <TouchableOpacity
                  style={[{ backgroundColor: Colors.secondary, borderRadius: 30 }, barakocta.p3, barakocta.m2, barakocta.mxAuto]}
                  onPress={() => {
                    sendForm();
                  }}
                >
                  <Text style={[barakocta.tCenter, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 16 }]}>احفظ</Text>
                </TouchableOpacity>
                <View style={{ height: 50 }}></View>
              </ScrollView>
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
        </View>
      </View>
    </SafeAreaView>
  );
}
