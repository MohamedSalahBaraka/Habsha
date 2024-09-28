import { Text, View } from "react-native";
import barakocta, { useColor } from "baracota-style";
import React, { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";

const Loading: React.FC<{ isLoading: boolean }> = ({ isLoading }) => {
  const { Colors } = useContext(AuthContext);
  const Color = useColor({ Colors });
  if (isLoading)
    return (
      <>
        <View style={[barakocta.positionAbsolute, barakocta.w100, barakocta.h100, Color.bgMuted, barakocta.opacity75]}></View>
        <View style={[barakocta.positionAbsolute, barakocta.w100, barakocta.h100, barakocta.jcCenter, barakocta.aiCenter]}>
          <Text style={[Color.Light, barakocta.t6, { fontFamily: "Cairo" }]}>جاري التحميل... </Text>
        </View>
      </>
    );
};
export default Loading;
