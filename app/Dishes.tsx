import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import barakocta, { useColor } from "baracota-style";
import axios, { AxiosError } from "axios";
import { useLocalSearchParams, useRouter } from "expo-router";
import { checableData } from "@/types/utils.t";
import { Category, Dish } from "@/types/Models.t";
import { fullScreenHeight, fullScreenWidth } from "@/constants/sizes";
import Loading from "@/components/Utils/Loading";
import GetService from "@/Services/GetService";
import useConfig from "@/hooks/useConfig";
import { AuthContext } from "@/context/AuthContext";
import { DishComponent } from "@/components/Models/Dish";
import NoNetwork from "@/components/Modal/noNetwork";
import IsErrorModal from "@/components/Modal/IsErrorModal";
import { Category as CategoryComponent, Categorycheck } from "@/components/Utils/Category";

export default function Dishes() {
  const { Colors, userToken, logout } = useContext(AuthContext);
  const [categories, setCategories] = useState<checableData[]>([]);
  const [keyword, setKeyword] = useState<string>();
  const [isLoaded, setIsLoaded] = useState(false);
  const params = useLocalSearchParams();
  const { category = "", user_id = "" } = params;
  const [dishes, setdishes] = useState<Dish[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const [isSearchError, setIsSearchError] = useState(false);
  const Color = useColor({ Colors });
  const router = useRouter();
  const config = useConfig();
  const toggleCategories = useCallback((index: number) => {
    const checkboxData = [...categories];
    checkboxData[index].checked = !checkboxData[index].checked;
    setCategories(checkboxData);
  }, []);
  const prepare = useCallback((data: Category[]) => {
    let datafinal = new Array();
    let checked = false;
    data.map((result) => {
      if (category) {
        checked = parseInt(category.toString()) === result.id;
      }
      datafinal.push({
        id: result.id,
        title: result.name,
        checked,
      });
    });
    return datafinal;
  }, []);
  const fetchData = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      let bodyParameters: {
        categories?: number[];
        user_id?: number[];
      } = {};
      if (category) {
        console.log(category);
        bodyParameters = {
          categories: [parseInt(category.toString())],
        };
      }
      if (user_id) {
        console.log(user_id);
        bodyParameters = {
          user_id: [parseInt(user_id.toString())],
        };
      }
      const data = await GetService.getdishes(config, bodyParameters);
      setdishes(data.dishes);
      setCategories(prepare(data.categories));
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
  const search = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsSearchError(false);
      let bodyParameters: {
        categories?: number[];
        user_id?: number[];
        keyword?: string;
      } = {};
      let selectedCategories: number[] = [];
      categories
        .filter((cb) => cb.checked === true)
        .map((cate) => {
          selectedCategories.push(cate.id);
        });

      if (selectedCategories.length != 0) {
        bodyParameters.categories = selectedCategories;
      }
      if (keyword) {
        bodyParameters.keyword = keyword;
      }
      if (user_id) {
        console.log(user_id);
        bodyParameters = {
          user_id: [parseInt(user_id.toString())],
        };
      }
      const data = await GetService.getdishes(config, bodyParameters);
      setdishes(data.dishes);
      setIsLoading(false);
    } catch (error) {
      setIsSearchError(true);
      const e = error as AxiosError<{ message: string }>;
      console.log("remove Dish ", e?.response?.data.message);
      console.log("remove Dish ", e?.response?.status);
      if (e?.response?.status == 401) {
        await logout();
        return;
      }
    }
  }, [keyword, categories]);
  useEffect(() => {
    console.log("Dishes");
    fetchData();
  }, []);
  const renderCategorieschecked = categories?.map((cb, index) => {
    console.log(cb);
    if (cb.checked)
      return (
        <Categorycheck
          Colors={Colors}
          Title={cb.title}
          key={index}
          onPress={() => {
            toggleCategories(index);
            search();
          }}
        />
      );
    return null;
  });
  const renderCategories = categories?.map((cb, index) => {
    if (!cb.checked)
      return (
        <CategoryComponent
          Colors={Colors}
          Title={cb.title}
          key={index}
          onPress={() => {
            toggleCategories(index);
            search();
          }}
        />
      );
    return null;
  });
  const renderdishes = dishes?.map((cb, index) => {
    return <DishComponent Colors={Colors} id={cb.id} key={index} Title={cb.name} uri={cb.photo} price={cb.sizes[0].price} />;
  });
  const networkback = () => {
    if (!isLoaded) fetchData();
  };
  return (
    <SafeAreaView style={[barakocta.fFill]}>
      <NoNetwork CallBack={networkback} />
      <IsErrorModal setIsModalVisible={setIsFetchDataError} isModalVisible={isFetchDataError} CallBack={fetchData} />
      <IsErrorModal setIsModalVisible={setIsSearchError} isModalVisible={isSearchError} CallBack={search} />
      {isLoaded ? (
        <>
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
                source={require("@/assets/images/Chef-bro.png")}
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
              <View style={[Color.bgLight, barakocta.w100, barakocta.pb3, barakocta.aiCenter]}>
                <View
                  style={[
                    { borderRadius: 30 },
                    { borderWidth: 1, borderColor: Colors.tertiary, borderStyle: "dashed" },
                    barakocta.w100,
                    barakocta.px3,
                    barakocta.fRow,
                  ]}
                >
                  <TouchableOpacity onPress={search} style={[barakocta.p2]}>
                    <FontAwesome5 name="search" size={20} color={Colors.tertiary} />
                  </TouchableOpacity>
                  <TextInput value={keyword} onChangeText={setKeyword} style={[barakocta.fFill]} placeholder="إبحث..." />
                </View>
              </View>
              <ScrollView horizontal={true} style={[barakocta.my2, { transform: [{ scaleX: -1 }] }]}>
                {renderCategorieschecked}
              </ScrollView>
              <ScrollView horizontal={true} style={[barakocta.mb3, { transform: [{ scaleX: -1 }] }]}>
                {renderCategories}
              </ScrollView>
              <Text style={[barakocta.tRight, barakocta.my3, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>الاطباق</Text>
              <View style={[barakocta.fRow, barakocta.fWrap]}>{renderdishes}</View>
            </View>
          </ScrollView>
          <TouchableOpacity
            style={[barakocta.positionAbsolute, { right: 20, bottom: 30 }]}
            onPress={() => {
              router.push("(modal)/Cart");
            }}
          >
            <Image
              source={require("@/assets/images/icons8-cart-100.png")}
              resizeMode={"contain"}
              style={[barakocta.mxAuto, { width: 70, height: 70 }, barakocta.my0, barakocta.p0]}
            />
          </TouchableOpacity>
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
