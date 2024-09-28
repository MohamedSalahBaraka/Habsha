import { Image, Text, TouchableOpacity, View } from "react-native";
import barakocta from "baracota-style";
import { ColorsInterface } from "@/types/utils.t";
import { User } from "@/types/Models.t";
import { ImageUrl } from "@/constants/URLs";
const Category: React.FC<{ Colors: ColorsInterface; Title: string; uri: string; onPress: () => void }> = ({ Colors, Title, uri, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        barakocta.p2,
        { transform: [{ scaleX: -1 }] },
        barakocta.jcCenter,
        barakocta.aiCenter,
        barakocta.mx1,
        { borderColor: Colors.primary, borderWidth: 1, borderRadius: 20 },
      ]}
    >
      <Image
        source={{ uri: ImageUrl + uri }}
        resizeMode={"contain"}
        style={[barakocta.mxAuto, { width: 50, height: 50 }, barakocta.my0, barakocta.p0]}
      />
      <Text style={[barakocta.tRight, barakocta.mx2, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 14, opacity: 0.8 }]}>{Title}</Text>
    </TouchableOpacity>
  );
};
export default Category;
