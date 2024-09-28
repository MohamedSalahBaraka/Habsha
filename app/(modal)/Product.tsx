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
import { FontAwesome5 } from "@expo/vector-icons";
import barakocta from "baracota-style";
import Loading from "@/components/Utils/Loading";
import { Product, Size } from "@/types/Models.t";
import SizeComponent from "@/components/Models/Size";
import { fullScreenHeight } from "@/constants/sizes";
import StoreService from "@/Services/StoreService";
import useConfig from "@/hooks/useConfig";
import { useLocalSearchParams, useRouter } from "expo-router";
import GetService from "@/Services/GetService";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import { ImageUrl } from "@/constants/URLs";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";

export default function ProductScreen() {
  const { Colors, userToken, logout } = useContext(AuthContext);
  const params = useLocalSearchParams();
  const { id = "2p" } = params;
  const [isLoaded, setIsLoaded] = useState(false);
  const [product, setproduct] = useState<Product>();
  const [options, setoptions] = useState<Size[]>();
  const [option, setoption] = useState<number>(0);
  const [price, setprice] = useState(0);
  const [total, setTotal] = useState(0);
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const [isAddToCartError, setIsAddToCartError] = useState(false);
  const [count, setCount] = useState(1);
  const router = useRouter();
  const config = useConfig();
  const [isLoading, setIsLoading] = useState(false);
  const addToCart = useCallback(async () => {
    try {
      setIsAddToCartError(false);
      if (typeof option == "undefined") {
        Alert.alert("خطأ", "عليك اختيار خيار");
        return;
      }
      setIsLoading(true);
      await StoreService.add({ count, product_id: parseInt(id.toString()), option_id: option }, config);
      router.back();
    } catch (error) {
      setIsAddToCartError(true);
      const e = error as AxiosError<{ message: string }>;
      setIsLoading(false);
      console.log("remove product ", e?.response?.data.message);
      console.log("remove product ", e?.response?.status);
      if (e?.response?.status == 401) {
        await logout();
        return;
      }
    }
  }, [count, option]);
  const fetchData = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      setIsLoading(true);
      const data = await StoreService.getProduct(parseInt(id.toString()), config);
      setproduct(data.product);
      setoptions(data.product.options);
      setIsLoaded(true);
    } catch (error) {
      setIsFetchDataError(true);
      const e = error as AxiosError<{ message: string }>;
      setIsLoading(false);
      console.log("remove product ", e?.response?.data.message);
      console.log("remove product ", e?.response?.status);
      if (e?.response?.status == 401) {
        await logout();
        return;
      }
    }
  }, []);
  const networkback = () => {
    if (!isLoaded) fetchData();
  };
  const rendersizes = options?.map((item, index) => {
    return (
      <SizeComponent
        Colors={Colors}
        Title={item.name}
        Price={item.price}
        Active={item.id == option}
        onPress={() => {
          setoption(item.id);
          setprice(item.price);
          setTotal(item.price * count);
        }}
      />
    );
  });
  useEffect(() => {
    console.log("product");
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
          <IsErrorModal isModalVisible={isFetchDataError} setIsModalVisible={setIsFetchDataError} CallBack={fetchData} />
          <IsErrorModal isModalVisible={isAddToCartError} setIsModalVisible={setIsAddToCartError} CallBack={addToCart} />
          {isLoaded ? (
            <>
              <ScrollView>
                <Image
                  source={{ uri: ImageUrl + product?.photo }}
                  resizeMode={"cover"}
                  style={[barakocta.jcCenter, { height: fullScreenHeight * 0.25, borderRadius: 50, width: "100%" }]}
                />

                <View
                  style={[
                    { backgroundColor: Colors.fourth, borderRadius: 20 },
                    barakocta.pt3,
                    barakocta.px2,
                    barakocta.positionRelative,
                    barakocta.mx4,
                    { top: -50 },
                  ]}
                >
                  <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>{product?.name}</Text>
                  <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>
                    {product?.category?.name}
                  </Text>
                </View>
                <View style={[barakocta.p3, { position: "relative", top: -50 }]}>
                  <ScrollView horizontal={true} style={[barakocta.my3, { transform: [{ scaleX: -1 }] }]}>
                    {rendersizes}
                  </ScrollView>
                  <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>
                    {product?.details}
                  </Text>
                  <View style={[barakocta.fRow, barakocta.jcBetween, barakocta.aiCenter, barakocta.mx2]}>
                    {total ? (
                      <View style={[barakocta.fRow]}>
                        <Text style={[{ color: Colors.secondary, fontFamily: "Alexandria", fontSize: 10 }]}>جنيه</Text>
                        <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 14 }]}>{total}</Text>
                        <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 14 }]}>السعر الكلي:</Text>
                      </View>
                    ) : (
                      <View></View>
                    )}
                    <View style={[barakocta.jcAround, barakocta.aiCenter, barakocta.fRow, barakocta.my2, { width: 70 }]}>
                      <TouchableOpacity
                        onPress={() => {
                          let newCount = count + 1;
                          setCount(newCount);
                          setTotal(price * newCount);
                        }}
                        style={{ borderWidth: 1, padding: 5, borderRadius: 3, borderColor: Colors.tertiary, opacity: 0.4 }}
                      >
                        <FontAwesome5 name="plus" size={12} color={Colors.tertiary} />
                      </TouchableOpacity>
                      <Text style={[barakocta.p2, { color: Colors.secondary, fontSize: 14 }]}>{count}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          let newCount = count - 1;
                          setCount(newCount);
                          setTotal(price * newCount);
                        }}
                        style={{ borderWidth: 1, padding: 5, borderRadius: 3, borderColor: Colors.tertiary, opacity: 0.4 }}
                      >
                        <FontAwesome5 name="minus" size={12} color={Colors.tertiary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={addToCart}
                    style={[barakocta.mxAuto, barakocta.aiCenter, barakocta.p3, { borderRadius: 20, backgroundColor: Colors.secondary }]}
                  >
                    <FontAwesome5 name="cart-plus" size={50} color={Colors.fourth} />
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
        </View>
      </View>
    </SafeAreaView>
  );
}
