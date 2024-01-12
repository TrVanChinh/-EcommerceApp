import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  where,
  query,
  doc,
  getFirestore,
} from "firebase/firestore";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Image } from "react-native-elements";
import auth from "@react-native-firebase/auth";
import { useUser } from "../../UserContext";
import color from "../../components/color";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
//idUserTuong:SGRmRvN7t2aKv4ylKAmqs0Llbnr1

const ListProducts = ({ navigation, route }) => {
  const { user } = useUser();
  const idUser = user?.user?.uid;
  const [name, setName] = useState("");
  const [products, setProducts] = useState([]);
  const db = getFirestore();
  const [loading, setLoading] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [isModalVisible, setModalVisible] = useState(false);
  const [shopCategory, setShopCategory] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedCategoryName, setSelectedCategoryName] = useState("Tất cả");

  useEffect(() => {
    if (idUser === "") {
      // Nếu user là null, hiển thị thông báo yêu cầu đăng nhập
      Alert.alert("Thông báo", "Vui lòng đăng nhập để tiếp tục.", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Login"),
        },
      ]);
    } else {
      // Nếu user không null, tiến hành lấy dữ liệu sản phẩm
      getProductList();
      getShopCategory();
    }
    // });
  }, []);
  // useEffect(() => {
  //   if (selectedCategoryId === "") {
  //     setSelectedCategoryName("Tất cả");
  //   } else {
  //     const index = shopCategory.findIndex(
  //       (item) => item.id === selectedCategoryId
  //     );
  //     setSelectedCategoryName(shopCategory[index].name);
  //     getProductByCategory();
  //   }
  // }
  // , [selectedCategoryId]);

  getProductByCategory = async (id, name) => {
    setSelectedCategoryName(name);
    closeModal();
    setLoading(true);
    const userId = idUser;
    const q = query(
      collection(db, "product"),
      where("idShop", "==", userId),
      where("idCategoryShop", "==", id)
    );
    const querySnapshot = await getDocs(q);
    const listproducts = [];
    const promises = querySnapshot.docs.map(async (a) => {
      // console.log(a.id, " => ", a.data().name);

      const val = doc(db, "product", a.id);
      const cltImg = collection(val, "image");
      const getValue = await getDocs(cltImg);
      const idProduct = a.id;
      const sold = a.data().sold;
      const nameProduct = a.data().name;
      const priceProduct = a.data().price;
      const imageProduct = getValue.docs[0].data().url;
      const prdOject = {
        idProduct,
        nameProduct,
        imageProduct,
        idCategoryShop: a.data().idCategoryShop,
        sold,
        priceProduct,
      };
      listproducts.push(prdOject);
      // console.log(idProduct,nameProduct,imageProduct,"price: ",price);
    });
    await Promise.all(promises);
    setProducts(listproducts);
    setLoading(false);
  };

  const getShopCategory = async () => {
    const querySnapshot = await getDocs(
      collection(db, "user", idUser, "categoryShop")
    );
    let temp = [];
    querySnapshot.forEach((doc) => {
      temp.push({ id: doc.id, ...doc.data() });
    });
    setShopCategory(temp);
  };

  const getProductList = async () => {
    // Lấy user ID
    setSelectedCategoryName("Tất cả");
    closeModal();
    setLoading(true);
    const userId = idUser;
    const q = query(collection(db, "product"), where("idShop", "==", userId));
    const querySnapshot = await getDocs(q);
    const listproducts = [];
    const promises = querySnapshot.docs.map(async (a) => {
      // console.log(a.id, " => ", a.data().name);

      const val = doc(db, "product", a.id);
      const cltImg = collection(val, "image");
      const getValue = await getDocs(cltImg);
      const idProduct = a.id;
      const sold = a.data().sold;
      const nameProduct = a.data().name;
      const priceProduct = a.data().price;
      const imageProduct = getValue.docs[0].data().url;
      const prdOject = {
        idProduct,
        nameProduct,
        imageProduct,
        idCategoryShop: a.data().idCategoryShop,
        sold,
        priceProduct,
      };
      listproducts.push(prdOject);
      // console.log(idProduct,nameProduct,imageProduct,"price: ",price);
    });
    await Promise.all(promises);
    setProducts(listproducts);
    setLoading(false);
  };
  const closeModal = () => {
    if (isModalVisible) {
      toggleModal();
    }
  };
  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ margin: 10 }}>Chọn danh mục</Text>
        <TouchableOpacity
          style={{
            paddingHorizontal: 5,
            backgroundColor: "white",

            margin: 5,
            alignItems: "center",
            borderColor: "gray",
            borderWidth: 1,
          }}
          onPress={() => {
            toggleModal();
          }}
        >
          <Text style={{ textAlign: "center", margin: 10 }}>
            -- {selectedCategoryName} --
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        visible={isModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={toggleModal}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
              width: "90%",
            }}
          >
            {/* button đóng */}
            <TouchableOpacity
              style={{
                marginTop: -10,
                marginRight: -10,
                alignSelf: "flex-end",
              }}
              onPress={closeModal}
            >
              <Ionicons name="close-circle" size={25} color="lightgray" />
            </TouchableOpacity>

            <View style={{ backgroundColor: "white" }}>
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  marginBottom: 10,
                }}
              >
                Chọn danh mục cần xem
              </Text>
              <TouchableOpacity
                style={{
                  borderColor: "lightgray",
                  borderWidth: 1,
                  marginVertical: 5,
                  paddingVertical: 5,
                  marginHorizontal: 50,
                }}
                onPress={() => {
                  getProductList();
                }}
              >
                <Text style={{ color: "black", textAlign: "center" }}>
                  Tất cả
                </Text>
              </TouchableOpacity>
              {shopCategory.map((item, key) => (
                <TouchableOpacity
                  key={key}
                  style={{
                    borderColor: "lightgray",
                    borderWidth: 1,
                    marginVertical: 5,
                    paddingVertical: 5,
                    marginHorizontal: 50,
                  }}
                  onPress={() => {
                    getProductByCategory(item.id, item.name);
                  }}
                >
                  <Text style={{ color: "black", textAlign: "center" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        data={products}
        renderItem={({ item }) => (
          <TouchableOpacity
            key={item.id}
            style={styles.item_prd}
            onPress={() =>
              navigation.navigate("EditProduct", { idProduct: item.idProduct })
            }
          >
            <Image
              source={{
                uri: item.imageProduct,
              }}
              style={[styles.prd_image, { flex: 1 }]}
            />
            <View style={{ flex: 9, justifyContent: "space-between" }}>
              <Text style={[styles.name_prd]}>{item.nameProduct}</Text>
              <Text style={{ marginLeft: 10 }}>
                Đã bán: {item.sold >= 0 ? item.sold : 0}
              </Text>
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
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
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
    marginLeft: 10,
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

  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
