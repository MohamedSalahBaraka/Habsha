import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

const EmptyCart = () => {
  return (
    <View style={styles.container}>
      {/* Render an icon that represents an empty cart */}
      <MaterialIcons name="remove-shopping-cart" size={64} color="gray" />
      {/* Render a message that informs the user that their cart is empty */}
      <Text style={styles.message}>السلة فارغة</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  message: {
    fontSize: 24,
    color: "gray",
    margin: 10,
  },
});

export default EmptyCart;
