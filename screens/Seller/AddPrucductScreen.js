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
  ActivityIndicator,
  BackHandler,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import color from "../../components/color";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import auth from "@react-native-firebase/auth";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  getFirestore,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";

const AddProductScreen = ({ navigation, route }) => {
  const db = getFirestore();
  const [name, onchangeProductName] = useState("");
  const [descript, onchangeProductDes] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [urlImage, setUrlImage] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [userId, setUser] = useState(null);
  const storage = getStorage();
  const [categories, setCategory] = useState([]);
  const { idSubcategory, nameSubcategory } = route.params || {};
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authenticatedUser) => {
      setUser(authenticatedUser.uid);
    });
    getCategorytList();
    // Hủy người nghe khi component unmount
    return () => unsubscribe();
  }, []);

  const getCategorytList = async () => {
    setCategory([]);
    const list = [];
    const docSnap = await getDocs(collection(db, "category"));
    docSnap.forEach((doc) => {
      idCate = doc.id;
      nameCate = doc.data().name;
      photo = doc.data().photo;
      const cateOject = {
        idCate,
        nameCate,
        photo,
      };
      list.push(cateOject);
      // console.log(doc.id, " => ", doc.data());
    });

    setCategory((preCate) => [...preCate, ...list]);

    // console.log(categories)
  };
  const areInputsFilled = (inputValues) => {
    for (const value of inputValues) {
      if (!value || value.trim() === "") {
        return false; // Nếu một trong các thẻ input chưa nhập, trả về false
      }
    }
    return true; // Nếu tất cả các thẻ input đã được nhập, trả về true
  };

  const addProduct = async (downloadURLs) => {
    const productRef = await addDoc(collection(db, "product"), {
      name: name,
      price: price,
      description: descript,
      idShop: userId,
      quantity: quantity,
      sold: 0,
      idSubCategory: idSubcategory,
      discount: "",
    });
    console.log("Document written with ID: ", productRef.id);
    const productId = productRef.id;

    const imageCollectionRef = collection(db, "product", productId, "image");

    // Thêm mỗi URL hình ảnh vào subcollection "images"
    downloadURLs.forEach(async (url) => {
      await addDoc(collection(db, "product", productId, "image"), {
        url: url,
        // order: index + 1, // Để duy trì thứ tự của các hình ảnh
      });
    });

    setLoading(false);
    Alert.alert("Thông báo", "Sản phẩm đã được thêm thành công", [
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("MyShop");
        },
      },
    ]);
  };

  const pickImages = async () => {
    if (images.length < 10) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsMultipleSelection: true,
        aspect: [4, 3],
        base64: true,
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
    } else {
      Alert.alert("Thông báo", "Đã đủ 10 ảnh");
    }
  };

  const uploadImage = async () => {
    const inputValues = [name, price, descript, quantity];
    if (areInputsFilled(inputValues)) {
      if (images.length > 0) {
        const storageRef = ref(storage, "productImg");
        const getCurrentTimestamp = () => {
          const date = new Date();
          return `${date.getFullYear()}${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}${date
            .getDate()
            .toString()
            .padStart(2, "0")}_${date
            .getHours()
            .toString()
            .padStart(2, "0")}${date
            .getMinutes()
            .toString()
            .padStart(2, "0")}${date.getSeconds().toString().padStart(2, "0")}`;
        };
        setLoading(true);
        const uploadTasks = images.map(async (uri, index) => {
          const response = await fetch(uri);
          const blob = await response.blob();

          // Construct a unique filename based on the index (you might want to use a more meaningful name)
          const filename =
            userId + `_${index + 1}_${getCurrentTimestamp()}.jpg`;

          // Create a reference to the new file in Firebase Storage
          const imageRef = ref(storageRef, filename);

          const snapshot = await uploadBytesResumable(imageRef, blob);
          return snapshot.ref;
        });

        try {
          // Wait for all upload tasks to complete
          const uploadSnapshots = await Promise.all(uploadTasks);

          // Get download URLs for each uploaded image
          const downloadURLs = await Promise.all(
            uploadSnapshots.map((snapshot) => getDownloadURL(snapshot))
          );
          // Log the download URLs
          const list = [];
          downloadURLs.forEach((url, index) => {
            setUrlImage((prevUrlImage) => [...prevUrlImage, url]);

            // console.log(`Download URL ${index + 1}: ${url}`);
          });
          // console.log(`Download URL: `,urlImage);
          console.log("Tất cả ảnh đã được upload.");

          addProduct(downloadURLs);
          setSelectedImages([]);
          setImages([]);
        } catch (error) {
          setLoading(false);
          console.error("Error uploading images:", error.message);
        }
      } else {
        Alert.alert("Cảnh báo", "Chưa thêm ảnh sản phẩm");
      }
    } else {
      Alert.alert("Cảnh báo", "Nhập thiếu thông tin sản phẩm");
    }
  };
  const handleImagePress = (index) => {
    // Khi người dùng nhấn vào ảnh, xóa ảnh khỏi danh sách đã chọn
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
      {/* Tên sản phẩm */}
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
      {/* Mô tả */}
      <View style={styles.name_item}>
        <View style={{ flexDirection: "row" }}>
          <Text style={{ marginLeft: 10, fontSize: 16 }}>Mô tả</Text>
          <Text style={{ color: "red" }}>*</Text>
        </View>
        <TextInput
          style={[styles.input]}
          onChangeText={onchangeProductDes}
          multiline
          placeholder="Nhập mô tả sản phẩm"
          value={descript}
        />
      </View>

      {/* Danh muc */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SelectCategory", { categories: categories })
        }
        style={[styles.list_items, { marginVertical: 5 }]}
      >
        <View
          style={{
            alignItems: "flex-start",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Ionicons name="list" size={25} marginLeft={10} color="gray" />
          <Text style={{ marginLeft: 10 }}> Danh mục </Text>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ marginLeft: 10 }}> {nameSubcategory}</Text>
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
          style={{ marginRight: 5, textAlign: "right" }}
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
          <Octicons name="stack" size={25} marginLeft={10} color="gray" />
          <Text style={{ marginLeft: 10 }}> Kho hàng </Text>
        </View>
        <TextInput
          style={{ marginRight: 5, textAlign: "right" }}
          placeholder="Nhập số lượng sản phẩm"
          keyboardType="numeric"
          value={quantity}
          onChangeText={handleQuantityChange}
        />
      </View>
      {/* Button Thêm */}
      <TouchableOpacity
        style={{ backgroundColor: color.origin, marginHorizontal: 100 }}
        onPress={uploadImage}
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", height: 35 }}
        >
          <Text style={{ color: "white" }}>Thêm sản phẩm</Text>
        </View>
      </TouchableOpacity>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
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
    marginBottom: 5,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  input: {
    marginLeft: 20,
    marginTop: 5,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
});
