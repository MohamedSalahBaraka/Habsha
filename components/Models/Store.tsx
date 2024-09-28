import { Image, Text, TouchableOpacity, View } from "react-native";
import barakocta from "baracota-style";
import { ColorsInterface } from "@/types/utils.t";
import { User } from "@/types/Models.t";
import { ImageUrl } from "@/constants/URLs";
import { fullScreenHeight } from "@/constants/sizes";
const Store: React.FC<{ Colors: ColorsInterface; Title: string; uri: string; user_id: number }> = ({ Colors, Title, uri, user_id }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        // navigation.dispatch(DrawerActions.toggleDrawer());
        router.push("Dishes", { user_id });
      }}
      style={[
        barakocta.p2,
        { transform: [{ scaleX: -1 }] },
        barakocta.jcCenter,
        barakocta.aiCenter,
        barakocta.mx1,
        { borderColor: Colors.primary, borderWidth: 1, borderRadius: 20 },
      ]}
    >
      <Text style={[{ color: Colors.tertiary, fontFamily: "Marhey", fontSize: 20 }]}>{Title}</Text>
      <Image
        source={{ uri: ImageUrl + uri }}
        resizeMode={"contain"}
        style={[barakocta.mxAuto, { width: fullScreenHeight * 0.3, height: fullScreenHeight * 0.3 }, barakocta.my0, barakocta.p0]}
      />
    </TouchableOpacity>
  );
};
export default Store;
