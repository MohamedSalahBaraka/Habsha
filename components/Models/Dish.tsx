import { fullScreenWidth } from "@/constants/sizes";
import { ImageUrl } from "@/constants/URLs";
import { ColorsInterface } from "@/types/utils.t";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import barakocta from "baracota-style";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
const Dish: React.FC<{
  Colors: ColorsInterface;
  uri: string;
  remove?: () => void;
  count: number;
  price: number;
  title: string;
  category: string;
  sizename: string;
}> = ({ Colors, uri, remove, count, price, title, category, sizename }) => {
  return (
    <View
      style={[
        { borderBottomWidth: 1, borderBottomColor: Colors.tertiary, borderStyle: "dashed" },
        barakocta.w100,
        barakocta.jcEnd,
        barakocta.aiCenter,
      ]}
    >
      <View style={[barakocta.fRow]}>
        {remove && (
          <TouchableOpacity onPress={remove} style={[barakocta.jcCenter, barakocta.aiCenter, { width: fullScreenWidth * 0.1 }]}>
            <Feather name="x-circle" size={24} color={Colors.secondary} />
          </TouchableOpacity>
        )}
        <View style={[{ width: fullScreenWidth * 0.55 }]}>
          <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 16 }]}>{title}</Text>
          <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>
            {category}-{sizename}
          </Text>
        </View>
        <View style={[barakocta.px3]}>
          <Image
            source={{ uri: uri }}
            resizeMode={"contain"}
            style={[barakocta.mxAuto, { width: fullScreenWidth * 0.17, height: fullScreenWidth * 0.17 }, barakocta.my0, barakocta.p0]}
          />
        </View>
      </View>
      <View style={[barakocta.fRow, barakocta.mb0, barakocta.jcBetween, barakocta.w100, barakocta.px2]}>
        <View style={[barakocta.fRow]}>
          <Text style={[{ color: Colors.secondary, fontFamily: "Alexandria", fontSize: 8 }]}>جنيه</Text>
          <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 12 }]}>{price}</Text>
        </View>
        <View style={[barakocta.fRow]}>
          <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 12 }]}>{count}</Text>
          <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 12 }]}>العدد:</Text>
        </View>
      </View>
    </View>
  );
};
export default Dish;
export const DishComponent: React.FC<{
  Colors: ColorsInterface;
  uri: string;
  id: number;
  price: number;
  Title: string;
}> = ({ Colors, Title, uri, price, id }) => {
  return (
    <View
      style={[
        barakocta.p2,
        { transform: [{ scaleX: -1 }] },
        barakocta.my1,
        barakocta.jcCenter,
        barakocta.aiCenter,
        barakocta.mx1,
        { width: fullScreenWidth * 0.38, borderColor: Colors.primary, borderWidth: 1, borderRadius: 20 },
      ]}
    >
      <Text style={[{ color: Colors.tertiary, fontFamily: "Marhey", fontSize: 16 }]}>{Title}</Text>
      <View style={[barakocta.fRow]}>
        <Text style={[{ color: Colors.secondary, fontFamily: "Alexandria", fontSize: 10 }]}>جنيه</Text>
        <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 13 }]}>{price}</Text>
      </View>
      <Image
        source={{ uri: ImageUrl + uri }}
        resizeMode={"contain"}
        style={[barakocta.mxAuto, { width: fullScreenWidth * 0.27, height: fullScreenWidth * 0.27 }, barakocta.my0, barakocta.p0]}
      />
      <TouchableOpacity
        style={[barakocta.jcEnd, { width: fullScreenWidth * 0.27 }, barakocta.fRow]}
        onPress={() => {
          // navigation.dispatch(DrawerActions.toggleDrawer());
          router.push("Dish", { id });
        }}
      >
        <Text style={[{ color: Colors.secondary, fontFamily: "Alexandria", fontSize: 10 }]}>التفاصيل</Text>
        <Image source={require("@/assets/images/icons8-restaurant-80.png")} resizeMode={"contain"} style={[{ width: 20, height: 20 }]} />
      </TouchableOpacity>
    </View>
  );
};
