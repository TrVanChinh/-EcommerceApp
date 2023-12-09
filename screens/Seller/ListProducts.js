import { Alert, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, where, query } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "react-native-elements";
import auth from "@react-native-firebase/auth";
//idUserTuong:SGRmRvN7t2aKv4ylKAmqs0Llbnr1

const ListProducts = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser);

      if (!authenticatedUser) {
        // Nếu user là null, hiển thị thông báo yêu cầu đăng nhập
        Alert.alert("Thông báo", "Vui lòng đăng nhập để tiếp tục.", [
          {
            text: "OK",
            onPress: () => navigation.navigate("Login"),
          },
        ]);
      } else {
        // Nếu user không null, tiến hành lấy dữ liệu sản phẩm
        getProductList(authenticatedUser);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const getProductList = async (authenticatedUser) => {
    // Lấy user ID
    const userId = authenticatedUser.uid;
    const q = query(collection(db, "product"), where("idShop", "==", userId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.id, " => ", doc.data());
      const nameProduct = doc.data().name;
      setName(nameProduct);
    });
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log("User signed out!"))
      .catch((error) => console.error("Error signing out:", error));
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Tên sản phẩm: {name}</Text>
      </View>
      <Button title="Logout" onPress={handleLogout} />
    </SafeAreaView>
  );
};

export default ListProducts;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
  },
});
