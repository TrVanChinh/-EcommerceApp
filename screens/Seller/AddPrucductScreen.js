import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Button,
  Image,
  View,
  TextInput,
  Text,
  Alert,
  ScrollView,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import color from "../../components/color";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,Octicons
} from "@expo/vector-icons";

const AddProductScreen = () => {
  const [name, onchangeProductName] = useState("");
  const [descript, onchangeProductDes] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      const totalImages = [...images, ...newImages];

      if (totalImages.length > 10) {
        Alert.alert("Thông báo", "Chỉ được chọn tối đa 10 ảnh");
      } else {
        setImages(totalImages);
      }
    }
  };

  const handleImagePress = (index) => {
    // Khi người dùng nhấn vào ảnh, thêm hoặc xóa ảnh khỏi danh sách đã chọn
    const isSelected = selectedImages.includes(index);
    const updatedSelectedImages = isSelected
      ? selectedImages.filter((selectedIndex) => selectedIndex !== index)
      : [...selectedImages, index];

    setSelectedImages(updatedSelectedImages);
  };

  const handleDelete = () => {
    // Xóa các ảnh đã chọn khỏi danh sách images
    const updatedImages = images.filter(
      (_, index) => !selectedImages.includes(index)
    );
    setImages(updatedImages);
    setSelectedImages([]);
  };

  const handleQuantityChange = (text) => {
    // Loại bỏ các ký tự không phải số
    const numericValue = text.replace(/[^0-9]/g, "");
    if (numericValue <= 10000) {
      setQuantity(numericValue);
    } else {
      Alert.alert("Thông báo", "Số lượng sản phẩm không vượt quá 10.000");
    }
  };

  return (
    <ScrollView style={{ flex: 1 }}>
      {/* hình ảnh */}
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <View
          style={[
            styles.name_item,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
              paddingHorizontal: 20,
              paddingVertical: 10,
            },
          ]}
        >
          <Text style={{}}>Hình ảnh sản phẩm</Text>
          <TouchableOpacity onPress={handleDelete}>
            <Text style={{ color: "red" }}>Xóa ảnh</Text>
          </TouchableOpacity>
        </View>
        <View style={{ width: "90%", flexDirection: "row", flexWrap: "wrap" }}>
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleImagePress(index)}
              style={{
                borderColor: selectedImages.includes(index)
                  ? "red"
                  : "lightgray",
                borderWidth: selectedImages.includes(index) ? 1 : 1,
                margin: 3,
                padding: 5,
              }}
            >
              <Image
                source={{ uri: image }}
                style={{
                  width: 200 / 3,
                  height: 200 / 3,
                }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={pickImages}>
            <View
              style={{
                margin: 3,
                padding: 5,
                borderColor: "black",
                borderWidth: 1,
                borderStyle: "dashed",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: "red",
                  textAlign: "center",
                  textAlignVertical: "center",
                  width: 200 / 3,
                  height: 200 / 3,
                }}
              >
                +Thêm ảnh
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={{ paddingVertical: 5 }}>Thêm tối đa 10 ảnh</Text>
      </View>
      <View style={styles.name_item}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginLeft: 10, fontSize: 16 }}>Tên sản phẩm</Text>
          <Text style={{ color: "red" }}>*</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={onchangeProductName}
          placeholder="Nhập tên sản phẩm"
          value={name}
        />
      </View>
      <View style={styles.name_item}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginLeft: 10, fontSize: 16 }}>Mô tả</Text>
          <Text style={{ color: "red" }}>*</Text>
        </View>
        <TextInput
          style={styles.input}
          onChangeText={onchangeProductDes}
          placeholder="Nhập mô tả sản phẩm"
          value={descript}
        />
      </View>

      {/* Danh muc */}
      <TouchableOpacity style={[styles.list_items, { marginVertical: 5 }]}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="list" size={25} marginLeft={10} color="gray" />
          <Text style={{ marginLeft: 10 }}> Danh mục sản phẩm </Text>
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

      {/* Gia */}
      <View style={styles.list_items}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons
            name="pricetag-outline"
            size={25}
            marginLeft={10}
            color="gray"
          />
          <Text style={{ marginLeft: 10 }}> Giá </Text>
        </View>
        <TextInput
          style={{marginRight:5, textAlign:'right'}}
          placeholder="Thiết lập giá"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />
      </View>
      {/* So luong kho */}
      <View style={styles.list_items}>
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Octicons
            name="stack"
            size={25}
            marginLeft={10}
            color="gray"
          />
          <Text style={{ marginLeft: 10 }}> Kho hàng </Text>
        </View>
        <TextInput
          style={{marginRight:5, textAlign:'right'}}
          placeholder="Nhập số lượng sản phẩm"
          keyboardType="numeric"
          value={quantity}
          onChangeText={handleQuantityChange}
        />
      </View>
    </ScrollView>
  );
};

export default AddProductScreen;

const styles = StyleSheet.create({
  name_item: {
    marginVertical: 1,
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  list_items: {
    backgroundColor: "white",
    marginBottom:5,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    marginLeft: 20,
    marginTop: 5,
  },
});
