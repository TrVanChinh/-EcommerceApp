import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, where, query, doc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Image } from "react-native-elements";
import auth from "@react-native-firebase/auth";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
//idUserTuong:SGRmRvN7t2aKv4ylKAmqs0Llbnr1

const ListProducts = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);

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
    const listproducts = [];
    const promises = querySnapshot.docs.map(async (a) => {
      // console.log(a.id, " => ", a.data().name);

      const val = doc(db, "product", a.id);
      const cltImg = collection(val, "image");
      const getValue = await getDocs(cltImg);
      const idProduct = a.id;
      const nameProduct = a.data().name;
      const priceProduct = a.data().price;
      const imageProduct = getValue.docs[0].data().url;
      const prdOject = {
        idProduct,
        nameProduct,
        imageProduct,
        priceProduct,
      };
      listproducts.push(prdOject);
      // console.log(idProduct,nameProduct,imageProduct,"price: ",price);
    });
    await Promise.all(promises);
    setProducts(listproducts);
  };

  return (
    <SafeAreaView>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity key={item.id} style={styles.item_prd}>
            <Image
              source={{
                uri: item.imageProduct,
              }}
              style={[styles.prd_image, { flex: 1 }]}
            />
            <View style={{ flex: 9, justifyContent: "space-between" }}>
              <Text style={[styles.name_prd]}>{item.nameProduct}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Text style={styles.prd_price}>{item.priceProduct} vnđ</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
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

  item_prd: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "white",
    marginVertical: 5,
  },

  name_prd: {
    fontWeight: "bold",
  },
  prd_image: {
    width: 70,
    height: 70,
    padding: 5,
    margin: 5,
  },
  prd_price: {
    fontWeight: "bold",
    marginBottom: 10,
    marginRight: 10,
    color: "red",
  },
});
