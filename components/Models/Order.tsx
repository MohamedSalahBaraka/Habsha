import { Image, Text, TouchableOpacity, View } from "react-native";

import barakocta from "baracota-style";
import { ColorsInterface } from "@/types/utils.t";
import { User } from "@/types/Models.t";
const Order: React.FC<{
  Colors: ColorsInterface;
  status: string;
  price: number;
  id: number;
  captin: User;
  date: string;
  title: string;
}> = ({ Colors, status, title, id, captin, price, date }) => {
  return (
    <View
      style={[barakocta.w100, barakocta.my2, { borderWidth: 1, borderColor: Colors.tertiary, borderStyle: "dotted", borderRadius: 15 }, barakocta.p2]}
    >
      <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: "Cairo", fontSize: 16 }]}>{title}</Text>
      <View style={[barakocta.fRow]}>
        <View style={[barakocta.col6]}>
          <TouchableOpacity
            style={[barakocta.jcEnd, { width: 100 }, barakocta.fRow]}
            onPress={() => {
              // navigation.dispatch(DrawerActions.toggleDrawer());
              router.push("OrderDetails", { id });
            }}
          >
            <Text style={[{ color: Colors.secondary, fontFamily: "Alexandria", fontSize: 10 }]}>التفاصيل</Text>
            <Image source={require("@/assets/images/icons8-restaurant-80.png")} resizeMode={"contain"} style={[{ width: 20, height: 20 }]} />
          </TouchableOpacity>
        </View>
        <View style={[barakocta.col6, barakocta.fRow]}>
          <Text style={[{ color: Colors.secondary, fontFamily: "Alexandria", fontSize: 8 }]}>جنيه</Text>
          <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 12 }]}>{price}</Text>
        </View>
      </View>
      {captin ? (
        <Text style={[barakocta.tCenter, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 12 }]}>
          {captin.name} - {captin.phone}
        </Text>
      ) : null}
      <View style={[barakocta.fRow, barakocta.jcBetween, barakocta.p2]}>
        <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>{status}</Text>
        <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>{date}</Text>
      </View>
    </View>
  );
};
export default Order;
