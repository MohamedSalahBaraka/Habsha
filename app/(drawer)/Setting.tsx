import { ActivityIndicator, FlatList, SafeAreaView, Text, TextInput, View, ScrollView, Image, TouchableOpacity, Dimensions } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import barakocta from "baracota-style";
import { fullScreenHeight } from "@/constants/sizes";
import { AuthContext } from "@/context/AuthContext";
import { useNavigation, useRouter } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

export default function Setting() {
  const { Colors, logout } = useContext(AuthContext);

  const navigation = useNavigation();
  const router = useRouter();
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
            source={require("@/assets/images/icons8-gear-80.png")}
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
          <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 20 }]}>الاعدادات</Text>
          <TouchableOpacity
            onPress={() => {
              router.navigate("(modal)/UpdateInfo");
            }}
            style={[barakocta.p3, barakocta.mb3, barakocta.fRow, barakocta.jcBetween, { borderBottomWidth: 1 }]}
          >
            <AntDesign name="left" size={24} color={Colors.tertiary} />
            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14 }]}>معلومات المستخدم</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.navigate("(modal)/UpdatePassword");
            }}
            style={[barakocta.p3, barakocta.mb3, barakocta.fRow, barakocta.jcBetween, { borderBottomWidth: 1 }]}
          >
            <AntDesign name="left" size={24} color={Colors.tertiary} />
            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14 }]}>كلمة السر</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.navigate({ pathname: "(modal)/UpdateAdress", params: { type: "address_id" } });
            }}
            style={[barakocta.p3, barakocta.mb3, barakocta.fRow, barakocta.jcBetween, { borderBottomWidth: 1 }]}
          >
            <AntDesign name="left" size={24} color={Colors.tertiary} />
            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14 }]}>عنوان الاستلام افتراضي</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.navigate({ pathname: "(modal)/UpdateAdress", params: { type: "address_sent_id" } });
            }}
            style={[barakocta.p3, barakocta.mb3, barakocta.fRow, barakocta.jcBetween, { borderBottomWidth: 1 }]}
          >
            <AntDesign name="left" size={24} color={Colors.tertiary} />
            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14 }]}>عنوان تسليم افتراضي</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.navigate({ pathname: "(modal)/UpdateAdress", params: { type: "address_food_id" } });
            }}
            style={[barakocta.p3, barakocta.mb3, barakocta.fRow, barakocta.jcBetween, { borderBottomWidth: 1 }]}
          >
            <AntDesign name="left" size={24} color={Colors.tertiary} />
            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14 }]}>عنوان توصيل الطعام افتراضي</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              logout();
            }}
            style={[barakocta.p3, barakocta.mb3, barakocta.fRow, barakocta.jcBetween, { borderBottomWidth: 1 }]}
          >
            <AntDesign name="left" size={24} color={Colors.tertiary} />
            <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14 }]}>تسجيل خروج</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={[barakocta.positionAbsolute, { right: 20, top: 30 }]}
        onPress={() => {
          navigation.dispatch(DrawerActions.toggleDrawer());
          // router.navigate('MyModal');
        }}
      >
        <Image
          source={require("@/assets/images/icons8-bars-96.png")}
          resizeMode={"contain"}
          style={[barakocta.mxAuto, { width: 50, height: 50 }, barakocta.my0, barakocta.p0]}
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
