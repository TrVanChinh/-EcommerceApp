import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import { SimpleLineIcons, AntDesign, Octicons,MaterialCommunityIcons } from "@expo/vector-icons";
import color from "../../components/color";
const MyShopScreen = ({ navigation }) => {
  return (
    <View>
      <View style={styles.todo_list}>
        <TouchableOpacity style={styles.todo_item}>
          <Text style={styles.numberTodoItem}>100</Text>
          <Text style={styles.todoItemText}>Chờ xác nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.todo_item}>
          <Text style={styles.numberTodoItem}>20</Text>
          <Text style={styles.todoItemText}>Chờ lấy hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.todo_item}>
          <Text style={styles.numberTodoItem}>30</Text>
          <Text style={styles.todoItemText}>Đã xử lý</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.todo_item}>
          <Text style={styles.numberTodoItem}>10</Text>
          <Text style={styles.todoItemText}>Đã hủy</Text>
        </TouchableOpacity>
      </View>
      {/* Thêm sp */}
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
      {/* Thống kê */}
      <TouchableOpacity style={styles.list_items}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Octicons
            name="graph"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={{ marginLeft: 10 }}>X Thống kê </Text>
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
      {/* Thông tin cửa hàng */}
      <TouchableOpacity style={styles.list_items}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <MaterialCommunityIcons
            name="store-edit-outline"
            size={25}
            marginLeft={10}
            color={color.origin}
          />
          <Text style={{ marginLeft: 10 }}>X Thông tin cửa hàng </Text>
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
  );
};
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
  todo_list: {
    marginVertical:10,
    flexDirection: "row",
    alignItems: "top",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  todo_item: {
    alignItems: "center",
    paddingHorizontal: 5,
    width: "20%",
    backgroundColor:"white",
    borderRadius:10,
    padding:10,
    borderWidth:1,
    borderColor:"#e6e3e3"
  },
  todoItemText: {
    textAlign: "center",
  },
  numberTodoItem:{
    fontSize:30,
    color:color.origin,
    fontWeight:'bold'
  }
});
