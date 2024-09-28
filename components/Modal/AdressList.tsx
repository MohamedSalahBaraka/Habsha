import { ActivityIndicator, SafeAreaView, Text, View, ScrollView, Pressable, Modal } from "react-native";
import React, { useContext, useState, useEffect, useCallback } from "react";
import barakocta from "baracota-style";
import { useRouter } from "expo-router";
import Address from "../Models/Address";
import { Address as AddressType } from "@/types/Models.t";
import useConfig from "@/hooks/useConfig";
import AdressService from "@/Services/AdressService";
import NoNetwork from "./noNetwork";
import IsErrorModal from "./IsErrorModal";
import { AuthContext } from "@/context/AuthContext";
import { AxiosError } from "axios";

const AdressList: React.FC<{
  setname: React.Dispatch<React.SetStateAction<string>>;
  setphone: React.Dispatch<React.SetStateAction<string>>;
  setdetails: React.Dispatch<React.SetStateAction<string>>;
  setneighbourhood: React.Dispatch<React.SetStateAction<string>>;
  setcity: React.Dispatch<React.SetStateAction<number>>;
  isModalVisible: boolean;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setname, setphone, setdetails, setneighbourhood, setcity, isModalVisible, setIsModalVisible }) => {
  const { Colors, logout } = useContext(AuthContext);
  const [addresses, setaddresses] = useState<AddressType[]>([]);
  const router = useRouter();
  const config = useConfig();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFetchDataError, setIsFetchDataError] = useState(false);
  const renderAddress = addresses?.map((item, index) => {
    console.log("#" + index, item);
    return (
      <Address
        Colors={Colors}
        key={index}
        neighbourhood={item.neighbourhood}
        city={item.city.name}
        onPress={() => {
          setname(item.name);
          setphone(item.phone);
          setdetails(item.details);
          setneighbourhood(item.neighbourhood);
          setcity(item.city.id);
          router.back();
        }}
      />
    );
  });
  const fetchData = useCallback(async () => {
    try {
      setIsFetchDataError(false);
      const result = await AdressService.addressList(config);
      setaddresses(result);
      setIsLoaded(true);
    } catch (error) {
      setIsFetchDataError(true);
      const e = error as AxiosError<{ message: string }>;
      console.log("AddressList", e?.response?.data?.message);
      console.log("AddressList", e?.response?.status);
      if (e?.response?.status == 401) {
        await logout();
        return;
      }
    }
  }, []);
  useEffect(() => {
    fetchData();
  }, []);
  const networkback = () => {
    if (!isLoaded) fetchData();
  };
  return (
    <Modal visible={isModalVisible} transparent onRequestClose={() => setIsModalVisible(false)}>
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end", backgroundColor: "transparent" }}>
        <Pressable
          onPress={() => {
            setIsModalVisible(false);
          }}
          style={[{ height: "60%", width: "100%", position: "relative", top: 27, backgroundColor: Colors.tertiary, opacity: 0.15 }]}
        ></Pressable>
        <View
          style={[
            { height: "50%", width: "100%", backgroundColor: Colors.secondary, borderTopEndRadius: 50, borderTopStartRadius: 50 },
            barakocta.pt5,
            barakocta.px3,
          ]}
        >
          <NoNetwork CallBack={networkback} />
          <IsErrorModal isModalVisible={isFetchDataError} setIsModalVisible={setIsFetchDataError} CallBack={fetchData} />
          {isLoaded ? (
            <>
              <ScrollView>
                <Text style={[barakocta.tRight, { color: Colors.fourth, fontFamily: "Cairo", fontSize: 20 }]}>عناوين سابقة</Text>
                {renderAddress}
              </ScrollView>
            </>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                position: "absolute",
                width: "100%",
                height: "100%",
              }}
            >
              <ActivityIndicator size={"large"} color={Colors.primary} />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};
export default AdressList;
