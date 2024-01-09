import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Keyboard,
  Dimensions,
  ScrollView,
  StyleSheet,
  FlatList,
  Pressable,
} from "react-native";
import {
  collection,
  doc,
  query,
  onSnapshot,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import color from "../components/color"

const SearchScreen = ({ navigation, route }) => {
  //   const searchInfo = route.params;
  //   console.log(searchInfo.search);
  const { height, width } = Dimensions.get("window");
  const [searchText, setSearchText] = useState("");
  const [product, setProduct] = useState([]);
  const [arrange, setArrange] = useState(false);
  const [searchStatus, setSearchStatus] = useState(true)
  // const fetchData = async () => {
  //   //sử dụng toán tử array-contains của Firestore
  //   const q = query(collection(db, "product"), where("name", ">=", searchText),where("name", "<=", searchText + '\uf8ff'))
  //   const querySnapshot = await getDocs(q);
  //   querySnapshot.forEach((doc) => {
  //     console.log( doc.data().name);
  //   });

  // }
  // Hàm chuyển đổi chuỗi thành chữ thường và loại bỏ dấu
  function normalizeString(str) {
    return str.toLowerCase()
    .normalize("NFD") // Chuẩn hóa dấu
    .replace(/[\u0300-\u036f]/g, ""); // Loại bỏ dấu
  }

  const fetchData = async () => {
    const normalizedSearchText = normalizeString(searchText);
    const q = query(collection(db, "product"));
    const querySnapshot = await getDocs(q);
    const productsData = [];
    const ProductDataSuggests = [];

    for (const doc of querySnapshot.docs) {
      const normalizedProductName = normalizeString(doc.data().name);

      if (normalizedProductName.includes(normalizedSearchText)) {

        const productId = doc.id;
        const productData = doc.data();

        const imageSnapshot = await getDocs(
          collection(db, "product", productId, "image")
        );

        if (imageSnapshot.docs.length > 0) {
          const imageUrl = imageSnapshot.docs[0].data().url;
          productsData.push({
            id: productId,
            data: { ...productData, imageUrl },
          });
        }
      } else {
        // kiểm tra normalizedSearchText có chứa dấu cách không
        const hasSpace = normalizedSearchText.includes(" ");
        if (hasSpace) {
          const searchParts = normalizedSearchText.split(" ");
          if (normalizedProductName.includes(searchParts[0])) {

            const productId = doc.id;
            const productData = doc.data();
    
            const imageSnapshot = await getDocs(
              collection(db, "product", productId, "image")
            );
    
            if (imageSnapshot.docs.length > 0) {
              const imageUrl = imageSnapshot.docs[0].data().url;
              ProductDataSuggests.push({
                id: productId,
                data: { ...productData, imageUrl },
              });
            }
          }
        } else {
          const firstLetter = normalizedSearchText[0];
          if (normalizedProductName.includes(firstLetter)) {

            const productId = doc.id;
            const productData = doc.data();
    
            const imageSnapshot = await getDocs(
              collection(db, "product", productId, "image")
            );
    
            if (imageSnapshot.docs.length > 0) {
              const imageUrl = imageSnapshot.docs[0].data().url;
              ProductDataSuggests.push({
                id: productId,
                data: { ...productData, imageUrl },
              });
            }
          }
            
        }
      }
    }
    if(productsData.length !== 0) {
      setSearchStatus(true)
      setProduct(productsData);
    } else {
      setSearchStatus(false)
      setProduct(ProductDataSuggests)
    }
  };

  // Sắp xếp sản phẩm từ thấp đến cao
  const sortProductsByLowToHigh = (products) => {
    setArrange(!arrange)
    return products.sort((a, b) => {
      const priceA = parseInt(a.data.price, 10);
      const priceB = parseInt(b.data.price, 10);
      return priceA - priceB;
    });
  };
  
  // Sắp xếp sản phẩm từ cao đến thấp
  const sortProductsByHighToLow = (products) => {
    setArrange(!arrange)
    return products.sort((a, b) => {
      const priceA = parseInt(a.data.price, 10);
      const priceB = parseInt(b.data.price, 10);
      return priceB - priceA;
    });
  };

  // Điều hướng sang màn hình chi tiết và gửi ID của sản phẩm
  const handleItem = (product) => {
    navigation.navigate("Detail", { product });
  };

  return (
    <View style={{ flex: 1, paddingTop: 30 }}>
      <View
        style={{
          height: 60,
          marginHorizontal: 20,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            if (searchText == "") {
              alert("Xin mời bạn nhập sản phẩm");
            } else {
              fetchData();
            }
          }}
        >
          <Feather name="search" size={24} color="#857E7C" />
        </TouchableOpacity>
        <TextInput
          onChangeText={(text) => {
            setSearchText(text);
          }}
          style={{
            height: 35,
            flex: 1,
            marginHorizontal: 10,
            borderRadius: 5,
            opacity: 0.5,
            paddingStart: 30,
            borderWidth: 1,
          }}
          autoCorrect={false}
        />
        <Feather name="filter" size={24} color="black" />
      </View>
      {/* <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: 10,
        }}
      >

      </View> */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          paddingHorizontal: 10,
        }}
      >
        <Pressable style={styles.buttonArrange}>
          <Text style={{ color: color.origin}}>Mới nhất</Text>
        </Pressable>
        <Pressable style={styles.buttonArrange}>
          <Text style={{ color: color.origin}}>Bán chạy</Text>
        </Pressable>
        {arrange ? (
          <Pressable
            style={styles.buttonArrange}
            onPress={() => sortProductsByLowToHigh(product)}
          >
            <Text style={{ color: color.origin, paddingRight:2}}>Giá</Text>
            <AntDesign name="caretdown" size={24} color="black" />
          </Pressable>
        ) : (
          <Pressable
            style={styles.buttonArrange}
            onPress={() => sortProductsByHighToLow(product)}
          >
            <Text style={{ color: color.origin, paddingRight:2}}>Giá</Text>
            <AntDesign name="caretup" size={24} color= {color.origin} />
          </Pressable>
        )}
      </View>
      {searchStatus ? (
        <View style={{ flex: 1 }}>
        <FlatList
          numColumns={2}
          data={product}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => handleItem(item)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 5,
                }}
              >
                <View
                  style={{
                    width: width / 2,
                  }}
                >
                  <Image
                    style={{
                      width: width / 2.5,
                      height: height / 4,
                      resizeMode: "cover",
                      borderRadius: 25,
                      margin: 10,
                    }}
                    source={{
                      uri: item.data.imageUrl,
                    }}
                  />
                  <View
                    style={{
                      width: 50,
                      position: "absolute",
                      marginTop: 20,
                      alignItems: "flex-end",
                      backgroundColor: "red",
                    }}
                  >
                    <Text style={{ color: "yellow" }}>
                      {item.data.discount}%
                    </Text>
                  </View>
                </View>
                <View style={{ width: width / 2 }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 15, color: "red" }}
                  >
                    {item.data.name}
                  </Text>
                </View>
                <View style={{ width: 100, paddingBottom: 10 }}>
                  <Text
                    style={{ textAlign: "center", fontSize: 20, color: "red" }}
                  >
                    {item.data.price}đ
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        ></FlatList>
      </View>
      ) : (
        <View style={{ flex: 1 }}>
        <View style = {{ width: width, height: height/7, alignItems:'center', justifyContent:'center'}}>
          <Text style={{ color: color.origin }}>Không tìm thấy sản phẩm nào</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}></View>
          <Text style={{ color:color.origin}}>Có thể bạn cũng thích</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD"}}></View>
        </View>
        <FlatList
          numColumns={2}
          data={product}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() => handleItem(item)}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  paddingLeft: 5,
                }}
              >
                <View
                  style={{
                    width: width / 2,
                  }}
                >
                  <Image
                    style={{
                      width: width / 2.5,
                      height: height / 4,
                      resizeMode: "cover",
                      borderRadius: 25,
                      margin: 10,
                    }}
                    source={{
                      uri: item.data.imageUrl,
                    }}
                  />
                  <View
                    style={{
                      width: 50,
                      position: "absolute",
                      marginTop: 20,
                      alignItems: "flex-end",
                      backgroundColor: "red",
                    }}
                  >
                    <Text style={{ color: "yellow" }}>
                      {item.data.discount}%
                    </Text>
                  </View>
                </View>
                <View style={{ width: width / 2 }}>
                  <Text
                    numberOfLines={1}
                    style={{ fontSize: 15, color: "red" }}
                  >
                    {item.data.name}
                  </Text>
                </View>
                <View style={{ width: 100, paddingBottom: 10 }}>
                  <Text
                    style={{ textAlign: "center", fontSize: 20, color: "red" }}
                  >
                    {item.data.price}đ
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        ></FlatList>
      </View>
      )}
      
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  buttonArrange: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    borderWidth:0.5,
    justifyContent: "center",
    height: 40,
  },
});
