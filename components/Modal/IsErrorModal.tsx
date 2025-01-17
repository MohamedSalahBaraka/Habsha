import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, Modal } from "react-native";
import Feather from "@expo/vector-icons/Feather";

const IsErrorModal = ({
  CallBack,
  isModalVisible,
  setIsModalVisible,
}: {
  isModalVisible: boolean;
  CallBack: () => void;
  setIsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Modal visible={isModalVisible} transparent onRequestClose={() => setIsModalVisible(false)}>
      <View style={styles.modal}>
        <Feather name="wifi-off" size={32} color="black" />
        <Text
          style={{
            fontSize: 18,
            color: "red",
            marginBottom: 10,
          }}
        >
          شيء ما خاطئ
        </Text>
        <Button title="حاول مجدداً" onPress={CallBack} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    color: "black",
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    color: "red",
    marginBottom: 10,
  },
});

export default IsErrorModal;
