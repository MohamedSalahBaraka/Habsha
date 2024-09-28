import { SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import barakocta, { useColor } from "baracota-style";
import { City } from "@/types/Models.t";
import CartService from "@/Services/CartService";
import { useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import AdressService from "@/Services/AdressService";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import { fullScreenHeight } from "@/constants/sizes";
import Loading from "@/components/Utils/Loading";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";
import AdressList from "@/components/Modal/AdressList";

export default function CheckOut() {
  const { Colors, userToken, logout } = useContext(AuthContext);
  const Color = useColor({ Colors });
  const [cities, setcities] = useState<City[]>([]);
  const [city, setcity] = useState<number>(0);
  const [neighbourhood, setneighbourhood] = useState<string>("");
  const [details, setdetails] = useState<string>("");
  const [phone, setphone] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [delivaryPrice, setdelivaryPrice] = useState<number>();
  const [orders, setorders] = useState<number>();
  const [isAddressList, setIsAddressList] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const config = useConfig();
  const networkback = () => {
    if (!isLoaded) GetCities();
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
      setIsLoading(true);
      setIsError(false);
      await CartService.placeOrder({ city, neighbourhood, details, name, phone }, config);
      router.push("(drawer)/FoodFormerOrders");
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
  }, [city, neighbourhood, details, name, phone]);
  const GetCities = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      const data = await AdressService.getaddressFood(config);
      setcities(data.cities);
      setcity(data.cities[0]?.id);
      GetDelivaryPrice(data.cities[0]?.id);
      if (data.address) {
        setcity(data.address.city_id);
        setneighbourhood(data.address.neighbourhood);
        setdetails(data.address.details);
        setname(data.address.name);
        setphone(data.address.phone);
      }
      setIsLoaded(true);
      setIsLoading(false);
      setIsError(false);
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
  const GetDelivaryPrice = useCallback(async (city: number) => {
    try {
      const data = await CartService.orderDelivaryPrice(city, config);
      setdelivaryPrice(data.price);
      setorders(data.orders);
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
    console.log("CheckOut");
    GetCities();
  }, []);
  const renderCities = cities?.map((item, index) => {
    return <Picker.Item label={item.name} value={item.id} key={item.id} />;
  });
  return (
    <SafeAreaView style={[barakocta.fFill]}>
      <NoNetwork CallBack={networkback} />
      <IsErrorModal setIsModalVisible={setIsError} isModalVisible={isError} CallBack={sendForm} />
      <IsErrorModal setIsModalVisible={setIsFetchDataError} isModalVisible={isFetchDataError} CallBack={GetCities} />
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
          <ScrollView>
            <View
              style={[
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
                source={require("@/assets/images/Delivery-bro.png")}
                resizeMode={"contain"}
                style={[barakocta.mxAuto, { width: fullScreenHeight * 0.35, height: fullScreenHeight * 0.35 }, barakocta.my0, barakocta.p0]}
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
              <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>معلومات التوصيل</Text>
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
                  onValueChange={(itemValue, itemIndex) => {
                    GetDelivaryPrice(itemValue);
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
                <Text style={[{ fontFamily: "Cairo" }]}>اسم المستلم</Text>
                <TextInput
                  value={name}
                  onChangeText={setname}
                  style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                />
                <Text style={[{ fontFamily: "Cairo" }]}>رقم هاتف المستلم</Text>
                <TextInput
                  value={phone}
                  keyboardType="numeric"
                  onChangeText={setphone}
                  style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                />
              </View>
              <Text style={[Color.Danger]}>سعر التوصيل :{delivaryPrice}</Text>
              <Text style={[Color.Danger]}>سيتم على عدد {orders} طلبية</Text>
              <TouchableOpacity
                style={[
                  { backgroundColor: Colors.secondary, width: fullScreenHeight * 0.17, height: fullScreenHeight * 0.17, borderRadius: 30 },
                  barakocta.mxAuto,
                ]}
                onPress={() => {
                  sendForm();
                }}
              >
                <Image
                  source={require("@/assets/images/icons8-delivery-80.png")}
                  resizeMode={"contain"}
                  style={[barakocta.mxAuto, { width: 100, height: 100 }, barakocta.my0, barakocta.p0]}
                />
                <Text style={[barakocta.tCenter, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 16 }]}>ارسل الطلب</Text>
              </TouchableOpacity>
            </View>
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
    </SafeAreaView>
  );
}
