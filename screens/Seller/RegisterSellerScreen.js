import { StyleSheet, Text, View, TextInput } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { SimpleLineIcons, Entypo } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import color from "../../components/color";
const RegisterSellerScreen = () => {
  
  const [shopName, onChangeShopName] = React.useState("FurinShop");
  const [address, onChangeText] = React.useState(
    "48 Thanh Bình Hải Châu Đà Nẵng"
  );
  const [email, onChangeEmail] = React.useState("abc@gmail.com");
  const [phone, onChangePhone] = React.useState("09123456789");
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 8 }}>

        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              Tên cửa hàng
            </Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeShopName}
            value={shopName}
          />
        </View>
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              Địa chỉ lấy hàng
            </Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={address}
          />
        </View>

        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Email</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangeEmail}
            value={email}
          />
        </View>

        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Điện thoại</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={onChangePhone}
            value={phone}
          />
        </View>
      </View>

      <View style={{}}>
        <Button title="Đăng kí" color={color.origin} />
      </View>
    </View>
  );
};

export default RegisterSellerScreen;

const styles = StyleSheet.create({
  list_items: {
    marginVertical: 1,
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  input: {
    marginLeft: 12,
  },
});
