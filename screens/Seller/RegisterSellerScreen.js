import { StyleSheet, Text, View, TextInput, Alert ,ActivityIndicator} from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { SimpleLineIcons, Entypo } from "@expo/vector-icons";
import { Button } from "react-native-elements";
import color from "../../components/color";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  updateDoc,
} from "firebase/firestore";
const RegisterSellerScreen = ({ navigation, route }) => {
  const [shopName, onChangeShopName] = useState("");
  const [address, onChangeText] = useState("");
  const [email, onChangeEmail] = useState("");
  const [phone, onChangePhone] = useState("");
  const { idUser: idUser } = route.params || {};
  const db = getFirestore();
  const [loading, setLoading] = useState(false);

  const setToSeller = async () => {
    try {
      if (shopName === "") {
        alert("Chưa nhập tên cửa hàng");
      } else if (address === "") {
        alert("Chưa nhập địa chỉ");
      } else {
        const docRef = doc(db, "user", idUser);
        setLoading(true);
        await updateDoc(docRef, {
          seller: true,
          address: address,
          shopName: shopName,
        });
        const updatedDocSnap = await getDoc(docRef);
        setLoading(false);
        if (updatedDocSnap.exists()) {
          const isSeller = updatedDocSnap.data().seller;

          if (isSeller) {
            // Hiển thị thông báo nếu cập nhật thành công
            Alert.alert("Thông báo", "Đăng ký bán hàng thành công", [
              {
                text: "OK",
                onPress: () => {
                  navigation.popToTop();
                },
              },
            ]);
          } else {
            console.error(
              "Cập nhật không thành công. Trường 'seller' không phải là true."
            );
            setLoading(false);
          }
        } else {
          console.error("Dữ liệu không tồn tại sau khi cập nhật.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật:", error);
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>      
      <View style={{ flex: 8 }}>
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Tên cửa hàng</Text>
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
        <Button title="Đăng kí" color={color.origin} onPress={setToSeller} />
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
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
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
