import { Text, TouchableOpacity, View } from "react-native";
import barakocta from "baracota-style";
import React from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { ColorsInterface } from "@/types/utils.t";

export const Categorycheck: React.FC<{ Colors: ColorsInterface; Title: string; onPress: () => void }> = ({ Colors, Title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        barakocta.p2,
        { transform: [{ scaleX: -1 }] },
        barakocta.fRow,
        barakocta.jcCenter,
        barakocta.aiCenter,
        barakocta.mx1,
        { backgroundColor: Colors.secondary, borderRadius: 20 },
      ]}
    >
      <Text style={[barakocta.tRight, barakocta.mx2, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 14, opacity: 0.8 }]}>{Title}</Text>
      <FontAwesome5 name="check" size={24} color={Colors.fourth} />
    </TouchableOpacity>
  );
};
export const Category: React.FC<{ Colors: ColorsInterface; Title: string; onPress: () => void }> = ({ Colors, Title, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        barakocta.p2,
        { transform: [{ scaleX: -1 }] },
        barakocta.fRow,
        barakocta.jcCenter,
        barakocta.aiCenter,
        barakocta.mx1,
        { backgroundColor: Colors.primary, borderRadius: 20 },
      ]}
    >
      <Text style={[barakocta.tRight, barakocta.mx2, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14, opacity: 0.8 }]}>{Title}</Text>
      <FontAwesome5 name="plus" size={24} color={Colors.tertiary} />
    </TouchableOpacity>
  );
};
