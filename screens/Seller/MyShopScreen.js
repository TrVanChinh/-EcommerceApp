import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import color from '../../components/color';
const MyShopScreen = ({navigation})=> {
  return (
    <View>
      <TouchableOpacity
            style={styles.list_items}
            onPress={() => navigation.navigate("AddProduct")}
          >
            <View
              style={{
                alignItems: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="pluscircleo"
                size={25}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={{ marginLeft: 10 }}> Đăng sản phẩm</Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
          {/* DS san pham */}
          <TouchableOpacity
            style={styles.list_items}
            onPress={() => navigation.navigate("ListProducts")}
          >
            <View
              style={{
                alignItems: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <AntDesign
                name="inbox"
                size={25}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={{ marginLeft: 10 }}> Danh sách sản phẩm</Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
    </View>
  )
}
export default MyShopScreen;

const styles = StyleSheet.create({
  list_items: {
    marginVertical: 1,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
});