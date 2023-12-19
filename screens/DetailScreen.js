import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  Button,
  TextInput,
} from "react-native";
import React, { useState, useEffect, useLayoutEffect } from "react";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
  Feather,
} from "@expo/vector-icons";
import slides from "../slide/slides";
import {
  collection,
  doc,
  query,
  onSnapshot,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebase";
import { useRoute } from "@react-navigation/native";

const DetailScreen = ({ route }) => {
  const { height, width } = Dimensions.get("window");
  const [selectIndex, setSelectIndex] = useState(0);
  // const [selectImage, setSelectImage] = useState(0);
  // const firstFourImage = slides.slice(0, 4);
  const { product } = route.params;
  const [listImage, setListImage] = useState([]);
  const [shop, setShop] = useState([]);
  // const productId = '3NuOrzoU0NaJMkAUOrzX'
  const productId = product.id;
  const ShopId = product.data.idShop;

  // useLayoutEffect(() => {
  //   const GetImage = onSnapshot(
  //     query(collection(doc(collection(db, "product"), productId), "image")),
  //     (snapshot) =>
  //       setListImage(
  //         snapshot.docs.map((doc) => ({
  //           id: doc.id,
  //           data: doc.data(),
  //         }))
  //       )
  //   );

  //   return () => {
  //     GetImage();
  //   };
  // }, [productId]);

  useEffect(() => {
    const GetImage = async () => {
      try {
        const imageQuery = query(
          collection(doc(collection(db, "product"), productId), "image")
        );
        const snapshot = await getDocs(imageQuery);
        const images = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setListImage(images);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu ảnh:", error);
      }
    };
    const fetchShopData = async () => {
      try {
        const userDocRef = doc(db, "user", ShopId);
        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          const userData = { id: docSnapshot.id, data: docSnapshot.data() };
          setShop(userData);
        } else {
          console.log("Document không tồn tại cho ShopId:", ShopId);
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchShopData();
    GetImage();
  }, [productId, ShopId]);
  console.log(shop.data);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }}>
        <View style={{ height: height / 2 }}>
          <FlatList
            pagingEnabled
            horizontal
            onScroll={(e) => {
              setSelectIndex(
                (e.nativeEvent.contentOffset.x / width).toFixed(0)
              );
            }}
            data={listImage}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => {
              return (
                <Image
                  style={{
                    width: width,
                    height: height / 2,
                  }}
                  // source={item.image}
                  source={{ uri: item.data.url }}
                />
              );
            }}
          />
          <View
            style={{
              width: width,
              height: 40,
              position: "absolute",
              bottom: 0,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {listImage.map((slide, index) => {
              return (
                <View
                  style={{
                    backgroundColor:
                      selectIndex == index ? "#8e8e8e" : "#f2f2f2",
                    height: 5,
                    width: 30,
                  }}
                ></View>
              );
            })}
          </View>
        </View>
        <View
          style={{
            position: "absolute",
            flexDirection: "row",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Ionicons
            name="chevron-back-circle"
            size={30}
            color="#858585"
            style={{}}
          />
          <View style={{ flex: 1 }} />
          <Ionicons name="cart" size={30} color="#858585" right={0} />
        </View>
        <View style={{ paddingBottom: 10, paddingLeft: 5 }}>
          <Text style={{ fontSize: 20 }}>{product.data.name}</Text>
          <Text style={{ color: "red", fontSize: 20 }}>
            {product.data.price}đ
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignContent: "center",
            paddingBottom: 10,
            paddingLeft: 5,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Ionicons name="ios-star" size={24} color="yellow" />
            <Text>4.9</Text>
          </View>
          <Text style={{ flex: 1 }}>Đã bán 1.2k</Text>
          <View style={{ flex: 1, flexDirection: "row", paddingStart: 40 }}>
            <TouchableOpacity
              style={{ alignItems: "center", paddingRight: 20 }}
            >
              <AntDesign name="hearto" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: "center" }}>
              <AntDesign name="sharealt" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
            paddingLeft: 5,
            height: height / 10,
            flexDirection: "row",
            alignItems: "center",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: "lightgray",
          }}
        >
          {/* <Image
            style={{ width: width / 5, height: height / 12 }}
            source={{
              uri: shop.data.photo,
            }}
          /> 
          <Text style={{ fontWeight: "bold", paddingLeft:10 }}>{shop.data.name}</Text>
          <TouchableOpacity
            style={{
              paddingVertical: 10,
              paddingHorizontal: 15,
              borderRadius: 5,
              paddingStart: 10,
              marginStart: 70,
              borderWidth: 1,
              borderColor: "#F1582C",
            }}
          >
            <Text style={{ color: "#F1582C", fontSize: 16 }}>Xem shop</Text>
          </TouchableOpacity> */}
          {shop.data ? (
            <>
              <Image
                style={{ width: width / 5, height: height / 12 }}
                source={{
                  uri: shop.data.photo,
                }}
              />
              <Text style={{ fontWeight: "bold", paddingLeft: 10 }}>
                {shop.data.name}
              </Text>
              <TouchableOpacity
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 15,
                  borderRadius: 5,
                  paddingStart: 10,
                  marginStart: 70,
                  borderWidth: 1,
                  borderColor: "#F1582C",
                }}
              >
                <Text style={{ color: "#F1582C", fontSize: 16 }}>Xem shop</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>Loading...</Text>
          )}
        </View>
        <View style={{ paddingTop: 10, paddingLeft: 5 }}>
          <Text>Mô tả sản phẩm</Text>
          <Text>{product.data.description}</Text>
        </View>

        {/* <View>
          <FlatList
            horizontal
            style={{ flex: 1 }}
            keyExtractor={(item) => item.id}
            data={firstFourImage}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setSelectImage(index)
                  }}
                  style={{
                    width: width/4,
                    height: height/5,
                    borderWidth: 2,
                    borderColor:"#fff"
                  }}
                >
                  <Image
                    style={{width:'100%', height:'100%'}}
                    source={item.image}
                  />
                </TouchableOpacity>
              );
            }}
          />
        </View> */}
      </ScrollView>
      <View
        style={{
          height: height / 12,
          backgroundColor: "red",
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#12B3AF",
            alignItems: "center",
            justifyContent: "center",
            borderRightColor: "black",
          }}
        >
          <AntDesign name="message1" size={24} color="white" />
          <Text style={{ color: "white", fontSize: 10 }}>Chat ngay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#0CD44C",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="cart-plus" size={24} color="white" />
          <Text style={{ color: "white", fontSize: 10 }}>
            Thêm vào giỏ hàng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 2,
            backgroundColor: "red",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white" }}>Mua với voucher</Text>
        </TouchableOpacity>
      </View>
      {/* <AntDesign name="arrowleft" size={24} color="black" />
      <MaterialCommunityIcons name="share-outline" size={24} color="black" />
      
      <MaterialIcons name="add-shopping-cart" size={24} color="black" /> */}
      {/* style={{
                height: 60,
                width: '100%',
                borderBottomColor:"#8e8e8e",
                borderBottomWidth: 0.2,
                justifyContent:'center'
            }} */}
    </SafeAreaView>
  );
};

export default DetailScreen;

const styles = StyleSheet.create({});
