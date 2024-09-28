import { SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions, ActivityIndicator, Alert } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import barakocta, { useColor } from "baracota-style";
import { City } from "@/types/Models.t";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import { fullScreenHeight } from "@/constants/sizes";
import Loading from "@/components/Utils/Loading";
import CartService from "@/Services/CartService";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import useConfig from "@/hooks/useConfig";
import AdressService from "@/Services/AdressService";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { DrawerActions } from "@react-navigation/native";
import AdressList from "@/components/Modal/AdressList";

export default function OrderDelivarey() {
  const { Colors, logout } = useContext(AuthContext);
  const [cities, setcities] = useState<City[]>([]);
  const [city, setcity] = useState<number>(0);
  const Color = useColor({ Colors });
  const [title, settitle] = useState<string>("");
  const [neighbourhood, setneighbourhood] = useState<string>("");
  const [details, setdetails] = useState<string>("");
  const [phone, setphone] = useState<string>("");
  const [name, setname] = useState<string>("");
  const [citysent, setcitysent] = useState<number>(0);
  const [neighbourhoodsent, setneighbourhoodsent] = useState<string>("");
  const [detailssent, setdetailssent] = useState<string>("");
  const [phonesent, setphonesent] = useState<string>("");
  const [namesent, setnamesent] = useState<string>("");
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const [delivaryPrice, setdelivaryPrice] = useState<number>();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressList, setIsAddressList] = useState(false);
  const [isAddressListsecond, setIsAddressListsecond] = useState(false);
  const config = useConfig();
  const router = useRouter();
  const navigation = useNavigation();
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
      if (typeof citysent == "undefined") {
        Alert.alert("خطأ", "عليك اضافة رقم الهاتف");
        return;
      }
      if (typeof neighbourhoodsent == "undefined" || neighbourhoodsent == "") {
        Alert.alert("خطأ", "عليك اضافة حي التسليم");
        return;
      }
      setIsLoading(true);
      setIsError(false);
      await CartService.placeDelivary(
        { city, citysent, details, detailssent, name, namesent, neighbourhood, neighbourhoodsent, phone, phonesent, title },
        config
      );
      router.push("DelivareyFormerOrders");
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
  }, [city, citysent, details, detailssent, name, namesent, neighbourhood, neighbourhoodsent, phone, phonesent, title]);
  const GetCities = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      const data = await AdressService.getaddressDelivary(config);
      setcities(data.cities);
      setcity(data.cities[0]?.id);
      setcitysent(data.cities[0]?.id);
      GetDelivaryPrice(data.cities[0]?.id, data.cities[0]?.id);
      if (data.address) {
        setcity(data.address.city_id);
        setneighbourhood(data.address.neighbourhood);
        setdetails(data.address.details);
        setname(data.address.name);
        setphone(data.address.phone);
      }
      if (data.addressSent) {
        setneighbourhoodsent(data.addressSent.neighbourhood);
        setdetailssent(data.addressSent.details);
        setcitysent(data.addressSent.city_id);
        setnamesent(data.addressSent.name);
        setphonesent(data.addressSent.phone);
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
  const GetDelivaryPrice = useCallback(async (city: number, citysent: number) => {
    try {
      const data = await CartService.DelivaryPrice(citysent, city, config);
      setdelivaryPrice(data.price);
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
  const networkback = () => {
    if (!isLoaded) GetCities();
  };
  useEffect(() => {
    console.log("CheckOut");
    GetCities();
  }, []);
  useFocusEffect(
    useCallback(() => {
      setdetails("");
      setdetailssent("");
      setname("");
      setnamesent("");
      setneighbourhood("");
      setneighbourhoodsent("");
      setphone("");
      setphonesent("");
    }, [])
  );
  return (
    <SafeAreaView style={[barakocta.fFill]}>
      <NoNetwork CallBack={networkback} />
      <IsErrorModal setIsModalVisible={setIsFetchDataError} isModalVisible={isFetchDataError} CallBack={GetCities} />
      <IsErrorModal setIsModalVisible={setIsError} isModalVisible={isError} CallBack={sendForm} />
      <AdressList
        isModalVisible={isAddressListsecond}
        setIsModalVisible={setIsAddressListsecond}
        setcity={setcitysent}
        setdetails={setdetailssent}
        setname={setnamesent}
        setneighbourhood={setneighbourhoodsent}
        setphone={setphonesent}
      />
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
              <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>أضف طلبية جديدة</Text>
              <View style={[barakocta.jcCenter, barakocta.mt3, barakocta.mb0, barakocta.aiCenter]}>
                <Text style={[{ fontFamily: "Cairo" }]}>المنقول</Text>
                <TextInput
                  value={title}
                  onChangeText={settitle}
                  style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75]}
                />
              </View>
              <View style={[, barakocta.fRow, barakocta.jcBetween, barakocta.aiCenter]}>
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
                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 16 }]}>عنوان الاستلام:</Text>
              </View>
              <View style={[barakocta.jcCenter, barakocta.mb0, barakocta.aiCenter]}>
                <Text style={[{ fontFamily: "Cairo" }]}>المدينة</Text>
                <Picker
                  style={[Color.bgLight, barakocta.w75, barakocta.mxAuto, barakocta.br1, barakocta.mb0]}
                  selectedValue={city}
                  onValueChange={(itemValue) => {
                    setcity(itemValue);
                    GetDelivaryPrice(itemValue, citysent || 0);
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
                <Text style={[{ fontFamily: "Cairo" }]}>اسم المسلم</Text>
                <TextInput
                  value={name}
                  onChangeText={setname}
                  style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                />
                <Text style={[{ fontFamily: "Cairo" }]}>رقم هاتف المسلم</Text>
                <TextInput
                  value={phone}
                  keyboardType="numeric"
                  onChangeText={setphone}
                  style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                />
              </View>
              <View style={[, barakocta.fRow, barakocta.jcBetween, barakocta.aiCenter]}>
                <TouchableOpacity
                  onPress={() => {
                    setIsAddressListsecond(true);
                  }}
                >
                  <Image
                    source={require("@/assets/images/icons8-address-100.png")}
                    resizeMode={"contain"}
                    style={[barakocta.mxAuto, { width: 50, height: 50 }, barakocta.my0, barakocta.p0]}
                  />
                  <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 10 }]}>عنوان سابق</Text>
                </TouchableOpacity>
                <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 16 }]}>عنوان التسليم:</Text>
              </View>
              <View style={[barakocta.jcCenter, barakocta.mb0, barakocta.aiCenter]}>
                <Text style={[{ fontFamily: "Cairo" }]}>المدينة</Text>
                <Picker
                  style={[Color.bgLight, barakocta.w75, barakocta.mxAuto, barakocta.br1, barakocta.mb0]}
                  selectedValue={citysent}
                  onValueChange={(itemValue) => {
                    setcitysent(itemValue);
                    GetDelivaryPrice(city || 0, itemValue);
                  }}
                >
                  {renderCities}
                </Picker>
                <Text style={[{ fontFamily: "Cairo" }]}>الحي</Text>
                <TextInput
                  value={neighbourhoodsent}
                  onChangeText={setneighbourhoodsent}
                  style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                />
                <Text style={[{ fontFamily: "Cairo" }]}>تفاصيل اضافية للعنوان(اختياري)</Text>
                <TextInput
                  value={detailssent}
                  onChangeText={setdetailssent}
                  style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                  multiline={true}
                  numberOfLines={4}
                />
                <Text style={[{ fontFamily: "Cairo" }]}>اسم المستلم</Text>
                <TextInput
                  value={namesent}
                  onChangeText={setnamesent}
                  style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                />
                <Text style={[{ fontFamily: "Cairo" }]}>رقم هاتف المستلم</Text>
                <TextInput
                  value={phonesent}
                  keyboardType="numeric"
                  onChangeText={setphonesent}
                  style={[{ borderWidth: 1, borderRadius: 5, padding: 5, borderColor: "#999" }, barakocta.w75, barakocta.mb0]}
                />
              </View>
              <Text style={[Color.Danger]}>سعر التوصيل :{delivaryPrice}</Text>
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
