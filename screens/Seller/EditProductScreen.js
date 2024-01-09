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
  Modal,
  TouchableOpacity,
  ActivityIndicator,
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
  updateDoc,
  getDoc,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  endAsyncEvent,
  setEnabled,
} from "react-native/Libraries/Performance/Systrace";
import { useUser } from "../../UserContext";

const EditProductScreen = ({ navigation, route }) => {
  const { idProduct: idProduct } = route.params;
  const db = getFirestore();
  const [product, setProduct] = useState("");
  const [name, setName] = useState("");
  const [descript, setProductDes] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [urlImage, setUrlImage] = useState([]);
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const { user } = useUser();
  const idUser = user?.user?.uid;
  const storage = getStorage();
  const [categories, setCategory] = useState([]);
  const { idSubcategory, nameSubcategory } = route.params || {};
  const [editNameSubcate, setEditNameSubcate] = useState("");
  const [editIDSubcate, setEditIDSubcate] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };
  const [loaiHang, setLoaiHang] = useState("");
  const [soLuong, setSoLuong] = useState("");
  const [giaLoaiHang, setGiaLoaiHang] = useState("");
  const [itemLoaiHang, setItemLoaiHang] = useState([]);

  useEffect(() => {

    getCategorytList();
    getProduct();
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
  };
  const areInputsFilled = (inputValues) => {
    for (const value of inputValues) {
      if (!value || value.trim() === "") {
        return false; // Nếu một trong các thẻ input chưa nhập, trả về false
      }
    }
    return true; // Nếu tất cả các thẻ input đã được nhập, trả về true
  };

  useEffect(() => {
    if (product) {
      setName(product.name);
      setProductDes(product.description);
    }
  }, [product]);

  useEffect(() => {
    setEditNameSubcate(nameSubcategory);
  }, [nameSubcategory]);

  useEffect(() => {}, [categories]);

  useEffect(() => {}, [editNameSubcate]);
  useEffect(() => {
    getNameSubcate();
  }, [editIDSubcate]);
  useEffect(() => {}, [editNameSubcate]);

  const getNameSubcate = () => {
    categories.forEach(async (c) => {
      const subcateDoc = await getDocs(
        collection(db, "category", c.idCate, "subcategory")
      );
      subcateDoc.forEach((d) => {
        if (d.id == editIDSubcate) {
          setEditNameSubcate(d.data().name);
        }
      });
    });
  };
  const getProduct = async () => {
    try {
      //Get Thông tin sản phẩm
      const docRef = doc(db, "product", idProduct);
      const docSnap = await getDoc(docRef);
      setProduct(docSnap.data());
      setEditIDSubcate(docSnap.data().idSubCategory);

      //Lấy image
      const listImage = [];
      const imageSnap = await getDocs(
        collection(db, "product", idProduct, "image")
      );
      imageSnap.forEach((doc) => {
        // console.log(doc.data().url);
        listImage.push(doc.data().url);
      });
      setImages(listImage);
      //Lấy Option
      const listLoaiHang = [];
      const loaiHangSnap = await getDocs(
        collection(db, "product", idProduct, "option")
      );
      loaiHangSnap.forEach((doc) => {
        const loaiHangObject = {
          loaiHangImg: [doc.data().image],
          loaiHang: doc.data().name,
          giaLoaiHang: doc.data().price,
          soLuong: doc.data().quantity,
        };
        listLoaiHang.push(loaiHangObject);
      });
      setItemLoaiHang(listLoaiHang);
      // console.log(itemLoaiHang)
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateProduct = async () => {
    const inputValues = [name, descript, idSubcategory];
    if (areInputsFilled(inputValues)) {
      if (itemLoaiHang.length == 0 && !areInputsFilled([price, quantity])) {
        Alert.alert("Thông báo", "Nhập thiếu thông tin");
      } else {
        // const downloadURLs = await uploadImage(images);
        const productRef = await updateDoc(collection(db, "product"), {
          name: name,
          description: descript,
          idSubCategory: idSubcategory,
          discount: "",
        });
        console.log("Document written with ID: ", productRef.id);
        const productId = productRef.id;

        const imageCollectionRef = collection(
          db,
          "product",
          productId,
          "image"
        );

        // Thêm mỗi URL hình ảnh vào subcollection "images"
        // downloadURLs.forEach(async (url) => {
        //   await addDoc(collection(db, "product", productId, "image"), {
        //     url: url,
        //     // order: index + 1, // Để duy trì thứ tự của các hình ảnh
        //   });
        // });
        if (itemLoaiHang.length > 0) {
          const docRef = doc(db, "product", productId);
          await updateDoc(docRef, {
            price: minPrice,
            quantity: totalQuantity,
          });
          addOption(productId);
        } else {
          const docRef = doc(db, "product", productId);
          await updateDoc(docRef, {
            price: price,
            quantity: quantity,
          });
          await addDoc(collection(db, "product", productId, "option"), {
            name: "     ",
            image: downloadURLs[0],
            price: price,
            quantity: quantity,
          });
        }

        setLoading(false);
        Alert.alert("Thông báo", "Sản phẩm đã được thêm thành công", [
          {
            text: "OK",
            onPress: () => {
              navigation.navigate("MyShop");
            },
          },
        ]);
      }
    } else {
      Alert.alert("Cảnh báo", "Nhập thiếu thông tin sản phẩm");
    }
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

  const uploadImage = async (listImage) => {
    if (listImage.length > 0) {
      const storageRef = ref(storage, "productImg");
      const getCurrentTimestamp = () => {
        const date = new Date();
        return `${date.getFullYear()}${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}_${date
          .getHours()
          .toString()
          .padStart(2, "0")}${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}${date.getSeconds().toString().padStart(2, "0")}`;
      };
      setLoading(true);

      const uploadTasks = listImage.map(async (uri, index) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        // Tạo tên file
        const filename = idUser + `_${index + 1}_${getCurrentTimestamp()}.jpg`;

        const imageRef = ref(storageRef, filename);

        const snapshot = await uploadBytesResumable(imageRef, blob);
        return snapshot.ref;
      });

      try {
        // Upload
        const uploadSnapshots = await Promise.all(uploadTasks);

        // Lấy url của ảnh
        const downloadURLs = await Promise.all(
          uploadSnapshots.map((snapshot) => getDownloadURL(snapshot))
        );
        // Lưu url ảnh vào mảng
        const list = [];
        downloadURLs.forEach((url, index) => {
          setUrlImage((prevUrlImage) => [...prevUrlImage, url]);

          // console.log(`Download URL ${index + 1}: ${url}`);
        });
        // console.log(`Download URL: `,urlImage);
        console.log("Ảnh đã được upload.");
        setSelectedImages([]);
        setImages([]);
        return downloadURLs;
      } catch (error) {
        setLoading(false);
        console.error("Error uploading images:", error.message);
      }
    } else {
      Alert.alert("Cảnh báo", "Chưa thêm ảnh sản phẩm");
    }
  };

  const addOption = async (prdID) => {
    try {
      itemLoaiHang.forEach(async (item) => {
        const loaiHangUrl = await uploadImage(item.loaiHangImg);
        loaiHangUrl.forEach(async (url) => {
          await addDoc(collection(db, "product", prdID, "option"), {
            name: item.loaiHang,
            price: item.giaLoaiHang,
            quantity: item.soLuong,
            image: url,
          });
        });
      });
      setItemLoaiHang([]);
    } catch (e) {
      console.log("Loi khi them phan loai hang", e);
    }
  };

  const showitems = () => {
    console.log(itemLoaiHang);
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

  // Add thông tin phân loại hàng vào mảng
  const [loaiHangImg, setLoaiHangImg] = useState("");

  const pickLoaiHangImg = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const newImages = result.assets.map((asset) => asset.uri);
      setLoaiHangImg(newImages);
    }
  };
  useEffect(() => {
    // Log giá trị mới của loaiHangImg sau mỗi lần cập nhật
    // console.log("loaiHangImg updated:", loaiHangImg);
  }, [loaiHangImg]);
  const getMaxGiaLoaiHang = (array) => {
    if (array.length === 0) {
      return null;
    }
    return Math.max(...array.map((item) => parseFloat(item.giaLoaiHang)));
  };

  // Hàm kiểm tra giá trị tối thiểu
  const getMinGiaLoaiHang = (array) => {
    if (array.length === 0) {
      return null;
    }
    return Math.min(...array.map((item) => parseFloat(item.giaLoaiHang)));
  };

  const getTotalQty = (array) => {
    const totalQuantity = array.reduce((acc, item) => {
      return acc + parseInt(item.soLuong, 10);
    }, 0);

    return totalQuantity;
  };
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [totalQuantity, setTotalQuantity] = useState("");
  useEffect(() => {
    // Log giá trị mới của loaiHangImg sau mỗi lần cập nhật
    if (itemLoaiHang.length > 0) {
      if (itemLoaiHang.length < 2) {
        setMinPrice(getMinGiaLoaiHang(itemLoaiHang));
      } else {
        setMinPrice(getMinGiaLoaiHang(itemLoaiHang));
        setMaxPrice(getMaxGiaLoaiHang(itemLoaiHang));
      }
      setTotalQuantity(getTotalQty(itemLoaiHang));
    } else {
      setPrice("");
    }
    // console.log("item length", itemLoaiHang.length, "qty", totalQuantity);
  }, [itemLoaiHang, minPrice, maxPrice, totalQuantity]);
  const addLoaiHang = () => {
    // Kiểm tra xem cả hai thẻ input đã được nhập chưa
    if (loaiHangImg !== "" && loaiHang && soLuong > 0 && giaLoaiHang > 0) {
      const newItem = { loaiHangImg, loaiHang, soLuong, giaLoaiHang };

      if (editIndex !== null) {
        // Nếu đang chỉnh sửa, cập nhật item tại editIndex
        const updatedItems = [...itemLoaiHang];
        updatedItems[editIndex] = newItem;
        setItemLoaiHang(updatedItems);
        setEditIndex(null);
      } else {
        // Nếu không, thêm một item mới
        setItemLoaiHang([...itemLoaiHang, newItem]);
      }

      // Đặt giá trị TextInput về rỗng
      setLoaiHang("");
      setSoLuong("");
      setGiaLoaiHang("");
      setLoaiHangImg("");
      // Đóng cửa sổ pop-up
      toggleModal();
    } else {
      alert("Vui lòng nhập đầy đủ thông tin");
    }
  };

  const [editIndex, setEditIndex] = useState(null);
  useEffect(() => {
    console.log(soLuong);
    console.log(giaLoaiHang);
  }, [editIndex]);
  const editLoaiHang = (index) => {
    setEditIndex(index);
    const selectedItem = itemLoaiHang[index];
    setLoaiHangImg(selectedItem.loaiHangImg);
    setLoaiHang(selectedItem.loaiHang);
    setSoLuong(selectedItem.soLuong);
    setGiaLoaiHang(selectedItem.giaLoaiHang);
    // Mở cửa sổ pop-up để chỉnh sửa giá trị
    toggleModal();
  };

  const deleteLoaiHang = (index) => {
    // Xóa item tại vị trí index
    setItemLoaiHang(itemLoaiHang.filter((item, i) => i !== index));
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
  const closeModal = () => {
    setLoaiHangImg("");
    setLoaiHang("");
    setSoLuong("");
    setGiaLoaiHang("");
    toggleModal();
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
          onChangeText={setName}
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
          onChangeText={setProductDes}
          multiline
          placeholder="Nhập mô tả sản phẩm"
          value={descript}
        />
      </View>

      {/* Danh muc */}
      <TouchableOpacity
        onPress={() =>
          navigation.navigate("SelectCategory", {
            categories: categories,
            isUpdate: true,
          })
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
          <Text style={{ marginLeft: 10 }}> Ngành hàng </Text>
        </View>
        <View
          style={{
            alignItems: "flex-end",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ marginLeft: 10 }}> {editNameSubcate}</Text>
          <SimpleLineIcons
            marginLeft={15}
            name="arrow-right"
            size={10}
            color="#60698a"
          />
        </View>
      </TouchableOpacity>

      {/* Phân loại hàng */}
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
              padding: 20,
              borderRadius: 10,
              width: 300,
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: -15,
                marginRight: -15,
                alignSelf: "flex-end",
              }}
              onPress={closeModal}
            >
              <Ionicons name="close-circle" size={25} color="lightgray" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                borderWidth: 1,
                borderColor: color.origin,
                alignSelf: "center",
                width: "30%",
              }}
              onPress={pickLoaiHangImg}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  textAlign: "center",
                  color: color.origin,
                }}
              >
                Chọn ảnh
              </Text>
            </TouchableOpacity>
            {loaiHangImg === "" ? (
              <></>
            ) : (
              <>
                {loaiHangImg.map((image, index) => (
                  <Image
                    key={index}
                    style={{
                      width: 100,
                      height: 100,
                      alignSelf: "center",
                      marginVertical: 5,
                    }}
                    source={{ uri: image }}
                  />
                ))}
              </>
            )}
            <Text style={{ fontWeight: "bold", color: color.origin }}>
              Loại hàng:
            </Text>
            <TextInput
              style={styles.input_phanloaihang}
              placeholder="Nhập loại hàng"
              value={loaiHang}
              onChangeText={(text) => setLoaiHang(text)}
            />
            <Text style={{ fontWeight: "bold", color: color.origin }}>
              Số lượng:
            </Text>
            <TextInput
              style={styles.input_phanloaihang}
              keyboardType="numeric"
              placeholder="Nhập số lượng"
              value={soLuong.toString()}
              onChangeText={setSoLuong}
            />
            <Text style={{ fontWeight: "bold", color: color.origin }}>
              Giá:
            </Text>
            <TextInput
              style={styles.input_phanloaihang}
              keyboardType="numeric"
              placeholder="Nhập giá"
              value={giaLoaiHang.toString()}
              onChangeText={setGiaLoaiHang}
            />
            <TouchableOpacity
              style={{ backgroundColor: color.origin, marginHorizontal: 100 }}
              onPress={addLoaiHang}
            >
              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 35,
                }}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>Lưu</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* <Button title="items" onPress={showitems} /> */}
      <View
        style={{ backgroundColor: "white", marginBottom: 5, paddingBottom: 5 }}
      >
        <View
          style={[
            styles.list_items,
            { marginBottom: 0, paddingRight: 20, alignItems: "center" },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="duplicate-outline"
              size={25}
              marginLeft={10}
              color="gray"
            />
            <Text style={{ marginLeft: 10 }}>Thêm phân loại hàng</Text>
          </View>

          <TouchableOpacity
            style={{ alignContent: "flex-end" }}
            onPress={toggleModal}
          >
            <Ionicons
              style={{ alignSelf: "center" }}
              name="add-circle-outline"
              size={25}
              color={color.origin}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 1,
            width: "90%",
            alignSelf: "center",
            backgroundColor: "lightgray",
          }}
        ></View>
        {itemLoaiHang.map((item, index) => (
          <View
            key={index}
            style={[
              styles.itemContainer,
              { flexDirection: "row", marginVertical: 5, marginHorizontal: 5 },
            ]}
          >
            {/* Cột bên trái */}
            {item.loaiHangImg.map((image, index) =>
              image ? (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={{ height: 50, width: 50 }}
                />
              ) : (
                <></>
              )
            )}

            {/* Cột giữa */}
            <View
              style={{ flex: 1, paddingHorizontal: 10, alignSelf: "center" }}
            >
              <Text>Loại hàng: {item.loaiHang}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text>Số lượng: {item.soLuong}</Text>
                <Text style={{ alignSelf: "flex-end", color: "red" }}>
                  Giá: {item.giaLoaiHang}đ
                </Text>
              </View>
            </View>

            {/* Cột bên phải */}
            <View
              style={{ alignSelf: "center", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                onPress={() => editLoaiHang(index)}
                style={{ marginBottom: 5 }}
              >
                <Feather name="edit" size={20} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteLoaiHang(index)}>
                <Feather name="trash-2" size={20} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
      {/* Gia */}
      <View
        style={[
          styles.list_items,
          {
            alignItems: "center",
            backgroundColor: itemLoaiHang.length > 0 ? "lightgray" : "white",
          },
        ]}
      >
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
        {itemLoaiHang.length > 1 ? (
          <>
            <Text
              style={{ marginRight: 5, textAlign: "right" }}
            >{`${minPrice}đ-${maxPrice}đ`}</Text>
          </>
        ) : itemLoaiHang.length == 1 ? (
          <>
            <Text
              style={{ marginRight: 5, textAlign: "right" }}
            >{`${minPrice}đ`}</Text>
          </>
        ) : (
          <>
            <TextInput
              style={{ marginRight: 5, textAlign: "right" }}
              placeholder="Thiết lập giá"
              keyboardType="numeric"
              value={price}
              onChangeText={setPrice}
              editable={itemLoaiHang.length > 0 ? false : true}
            />
          </>
        )}
      </View>
      {/* So luong kho */}
      <View
        style={[
          styles.list_items,
          {
            alignItems: "center",
            backgroundColor: itemLoaiHang.length > 0 ? "lightgray" : "white",
          },
        ]}
      >
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
        {itemLoaiHang.length > 0 ? (
          <>
            <Text
              style={{ marginRight: 5, textAlign: "right" }}
            >{`${totalQuantity}`}</Text>
          </>
        ) : (
          <>
            <TextInput
              style={{ marginRight: 5, textAlign: "right" }}
              placeholder="Nhập số lượng sản phẩm"
              keyboardType="numeric"
              value={quantity}
              onChangeText={handleQuantityChange}
              editable={itemLoaiHang.length > 0 ? false : true}
            />
          </>
        )}
      </View>
      {/* Button Thêm */}
      <TouchableOpacity
        style={{ backgroundColor: color.origin, marginHorizontal: 100 , marginBottom:20}}
        onPress={updateProduct}
      >
        <View
          style={{ alignItems: "center", justifyContent: "center", height: 35 }}
        >
          <Text style={{ color: "white" }}>Lưu thay đổi</Text>
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

export default EditProductScreen;

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
  input_phanloaihang: {
    marginVertical: 2,
    paddingVertical: 0,
    paddingHorizontal: 5,
  },
});
