import { ColorsInterface } from "@/types/utils.t";
import { FontAwesome5 } from "@expo/vector-icons";
import barakocta from "baracota-style";
import { Text, TouchableOpacity, View } from "react-native";
const Address: React.FC<{ Colors: ColorsInterface; neighbourhood: string; city: string; onPress: () => void }> = ({
  Colors,
  neighbourhood,
  city,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        barakocta.fRow,
        { borderBottomWidth: 1, borderBottomColor: Colors.fourth, borderStyle: "dashed" },
        barakocta.w100,
        barakocta.jcEnd,
        barakocta.aiCenter,
      ]}
    >
      <View>
        <Text style={[barakocta.tRight, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 16 }]}>{neighbourhood}</Text>
        <Text style={[barakocta.tRight, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>{city}</Text>
      </View>
      <View style={[barakocta.p3]}>
        <FontAwesome5 name="map-marker" size={48} color={Colors.fourth} />
      </View>
    </TouchableOpacity>
  );
};
export default Address;
