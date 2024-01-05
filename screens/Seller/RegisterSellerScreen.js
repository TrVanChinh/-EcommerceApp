import { StyleSheet, Text, View, TextInput, Alert ,ActivityIndicator} from "react-native";
import React, { useEffect, useState } from "react";
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
  const [address, setAddress] = useState("");
  const [shopDescript, setShopDescript] = useState("");
  const [phone, setPhoneNumber] = useState("");
  const { idUser: idUser } = route.params || {};
  const db = getFirestore();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    try {
      const docRef = doc(db, "user", idUser);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.id);

      // Set state only when data is available
      setUser(docSnap.data());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  useEffect(() => {
    if (user) {
      onChangeShopName(user.shopName);
      setAddress(user.address);
      setShopDescript(user.shopDescript);
    }
  }, [user]);

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
          shopName: shopName,
          seller: false,
          status:false,
          address: address,
          shopDescript:shopDescript
        });
        const updatedDocSnap = await getDoc(docRef);
        setLoading(false);
        if (updatedDocSnap.exists()) {
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
            onChangeText={setAddress}
            value={address}
          />
        </View>

        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Mô tả cho cửa hàng</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setShopDescript}
            value={shopDescript}
            maxLength={200}
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
