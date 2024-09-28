import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import barakocta from "baracota-style";
import Loading from "@/components/Utils/Loading";
import { fullScreenHeight } from "@/constants/sizes";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import { ImageUrl } from "@/constants/URLs";
import { Category, Dish, Product, User } from "@/types/Models.t";
import { DishComponent } from "@/components/Models/Dish";
import CategoryComponent from "@/components/Models/Category";
import Resturant from "@/components/Models/Resturant";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import StoreService from "@/Services/StoreService";
import useConfig from "@/hooks/useConfig";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";
import { DrawerActions } from "@react-navigation/native";

export default function LandingStore() {
  const { Colors, userToken, logout } = useContext(AuthContext);
  const [categories, setcategories] = useState<Category[]>([]);
  const [products, setproducts] = useState<Product[]>([]);
  const [stores, setstores] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchDataError, setIsFetchDataError] = useState(false);

  const router = useRouter();
  const navigation = useNavigation();
  const config = useConfig();
  const renderCategories = categories?.map((item, index) => {
    return (
      <CategoryComponent
        Colors={Colors}
        onPress={() => {
          router.push({ pathname: "Products", params: { category: item.id } });
        }}
        uri={item.photo}
        key={index}
        Title={item.name}
      />
    );
  });
  const renderproducts = products?.map((cb, index) => {
    return <DishComponent Colors={Colors} id={cb.id} Title={cb.name} key={index} uri={cb.photo} price={cb.options[0]?.price} />;
  });
  const renderrestaurante = stores?.map((cb, index) => {
    return <Resturant Colors={Colors} user_id={cb.id} key={index} Title={cb.name} uri={cb.photo} />;
  });
  const fetchData = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      const data = await StoreService.getLanding(config);
      setproducts(data.products);
      setcategories(data.categories);
      setstores(data.stores);
      setIsLoading(true);
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
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );
  const networkback = () => {};
  return (
    <SafeAreaView style={[barakocta.fFill]}>
      <NoNetwork CallBack={networkback} />
      <IsErrorModal setIsModalVisible={setIsFetchDataError} isModalVisible={isFetchDataError} CallBack={fetchData} />
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
            source={require("@/assets/images/Drive-thru-pana.png")}
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
          <ScrollView horizontal={true} style={[barakocta.my3, { transform: [{ scaleX: -1 }] }]}>
            {renderCategories}
          </ScrollView>
          <View style={[barakocta.fRow, barakocta.jcBetween, barakocta.px3]}>
            <TouchableOpacity
              onPress={() => {
                // navigation.dispatch(DrawerActions.toggleDrawer());
                router.push("products");
              }}
            >
              <Text style={[barakocta.tRight, barakocta.mx2, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14, opacity: 0.5 }]}>الكل</Text>
            </TouchableOpacity>
            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>منتجات رائجة</Text>
          </View>
          <ScrollView horizontal={true} style={[barakocta.my3, { transform: [{ scaleX: -1 }] }]}>
            {renderproducts}
          </ScrollView>
          <View style={[barakocta.fRow, barakocta.jcBetween, barakocta.px3]}>
            <TouchableOpacity
              onPress={() => {
                // navigation.dispatch(DrawerActions.toggleDrawer());
                router.push("Restaurant");
              }}
            >
              <Text style={[barakocta.tRight, barakocta.mx2, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14, opacity: 0.5 }]}>الكل</Text>
            </TouchableOpacity>
            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>متاجر رائجة</Text>
          </View>
          <ScrollView horizontal={true} style={[barakocta.my3, { transform: [{ scaleX: -1 }] }]}>
            {renderrestaurante}
          </ScrollView>
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
      <TouchableOpacity
        style={[barakocta.positionAbsolute, { right: 20, bottom: 30 }]}
        onPress={() => {
          router.push("Cart");
        }}
      >
        <Image
          source={require("@/assets/images/icons8-cart-100.png")}
          resizeMode={"contain"}
          style={[barakocta.mxAuto, { width: 70, height: 70 }, barakocta.my0, barakocta.p0]}
        />
      </TouchableOpacity>
      <Loading isLoading={isLoading} />
    </SafeAreaView>
  );
}
