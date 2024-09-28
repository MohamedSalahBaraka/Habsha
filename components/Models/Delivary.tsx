import { Text, View } from "react-native";

import barakocta from "baracota-style";
import { ColorsInterface } from "@/types/utils.t";
import { User } from "@/types/Models.t";
const Delivary: React.FC<{
  Colors: ColorsInterface;
  status: string;
  money: number;
  neighbourhoodSent: string;
  citySent: string;
  neighbourhoodGet: string;
  cityGet: string;
  captin: User;
  date: string;
  title: string;
}> = ({ Colors, status, money, neighbourhoodSent, citySent, neighbourhoodGet, cityGet, captin, date, title }) => {
  return (
    <View
      style={[barakocta.w100, barakocta.my2, { borderWidth: 1, borderColor: Colors.tertiary, borderStyle: "dotted", borderRadius: 15 }, barakocta.p2]}
    >
      <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: "Cairo", fontSize: 16 }]}>{title}</Text>
      <View style={[barakocta.fRow, barakocta.jcEnd]}>
        <View style={[barakocta.col6]}>
          <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>الي</Text>
          <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 16 }]}>{neighbourhoodSent}</Text>
          <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>{citySent}</Text>
        </View>
        <View style={[barakocta.col6]}>
          <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>من</Text>
          <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 16 }]}>{neighbourhoodGet}</Text>
          <Text style={[barakocta.tRight, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>{cityGet}</Text>
        </View>
      </View>
      {captin ? (
        <Text style={[barakocta.tCenter, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 12 }]}>
          {captin.name} - {captin.phone}
        </Text>
      ) : null}
      <Text style={[barakocta.tCenter, { color: Colors.tertiary, fontFamily: "Cairo", fontSize: 12 }]}>المبالغ المستلمة: {money}</Text>
      <View style={[barakocta.fRow, barakocta.jcBetween, barakocta.p2]}>
        <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>{status}</Text>
        <Text style={[barakocta.tRight, { color: Colors.secondary, fontFamily: "Cairo", fontSize: 12, opacity: 0.8 }]}>{date}</Text>
      </View>
    </View>
  );
};
export default Delivary;
