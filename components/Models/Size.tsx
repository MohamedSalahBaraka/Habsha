import { ColorsInterface } from "@/types/utils.t";
import React from "react";
import barakocta from "baracota-style";
import { Text, TouchableOpacity, View } from "react-native";

const Size: React.FC<{
  Colors: ColorsInterface;
  onPress: () => void;
  Price: number;
  Title: string;
  Active: boolean;
}> = ({ Colors, Title, Price, Active, onPress }) => {
  let dot = { borderWidth: 1, borderColor: Colors.tertiary };
  let mainborder = { borderColor: Colors.primary };
  if (Active) {
    dot = { borderWidth: 5, borderColor: Colors.secondary };
    mainborder = { borderColor: Colors.secondary };
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        barakocta.p2,
        { transform: [{ scaleX: -1 }], height: 130 },
        barakocta.jcCenter,
        barakocta.aiCenter,
        barakocta.mx1,
        { borderWidth: 1, borderRadius: 20 },
        mainborder,
      ]}
    >
      <View style={[barakocta.my3, { height: 15, width: 15, borderRadius: 8 }, dot]}></View>
      <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 12, opacity: 0.5 }]}>{Title}</Text>
      <View style={[barakocta.fRow]}>
        <Text style={[{ color: Colors.secondary, fontFamily: "Alexandria", fontSize: 10 }]}>جنيه</Text>
        <Text style={[{ color: Colors.tertiary, fontFamily: "Alexandria", fontSize: 16 }]}>{Price}</Text>
      </View>
    </TouchableOpacity>
  );
};
export default Size;
