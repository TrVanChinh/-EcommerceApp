import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, getUser } from "firebase/auth";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { app } from "../firebase";
import {
  ref,
  deleteObject,
  getDownloadURL,
  getStorage,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { Button } from "react-native-elements";
import color from "../components/color";
import { FontAwesome5, SimpleLineIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import auth from "@react-native-firebase/auth";
import { FirebasePhoneAuth } from "@react-native-firebase/auth";

const EditUserInfoScreen = ({ navigation, route }) => {
  const { idUser: idUser } = route.params;
  const [avatar, setAvatar] = useState("");
  const [userData, setUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  const currentUser = auth().currentUser;
  console.log("currentUser", currentUser);
  const db = getFirestore(app);

  // auth().onAuthStateChanged((user) => {
  //   if (user) {
  //     console.log("currentUser ss", user);
  //   } else {
  //     console.log("currentUser ss", null);
  //   }
  // });

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setAddress(userData.address);
      setEmail(userData.email);
      setMobileNo(userData.mobileNo);
      setAvatar(userData.photo);
      //avatar gg = https://lh3.googleusercontent.com/a/ACg8ocJqThobPEndy9LkFEa0Dafe3pgnkZlr41UjDT3bKIUb_oU=s96-c
    }
  }, [userData]);

  useEffect(() => {
    // Log giá trị mới của loaiHangImg sau mỗi lần cập nhật
    // console.log(avatar);
  }, [avatar]);

  const getUserData = async () => {
    try {
      const docRef = doc(db, "user", idUser);
      const docSnap = await getDoc(docRef);
      // Set state only when data is available
      setUser(docSnap.data());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateUser = async () => {
    try {
      if (name == "" || email == "") {
        alert("Không được để trống");
        return;
      }
      setLoading(true);

      const userDocRef = doc(db, "user", idUser);
      const userDocSnapshot = await getDoc(userDocRef);
      const updateData = {
        name: name,
      };
      if (!userDocSnapshot.data().hasOwnProperty("email")) {
        updateData.email = email;
      }

      if (!userDocSnapshot.data().hasOwnProperty("mobileNo")) {
        updateData.mobileNo = mobileNo;
      } else {
        updateData.mobileNo = mobileNo;
      }
      await updateDoc(userDocRef, updateData);
      try {
        // if (email !== currentUser.email) {
        //   await updateEmail(currentUser, email);
        //   await sendEmailVerification(currentUser);
        // }
        //   else {
        //     Alert.alert("Thông báo", "Cập nhật thành công");
        // }
        // Cập nhật password nếu tồn tại

        updatePhoneNumberAuth(mobileNo);
      } catch (error) {
        Alert.alert("Thông báo lỗi", error);
      }
      alert("Cập nhật thành công");
      navigation.navigate("Main");
      // setLoading(false)
    } catch (error) {
      console.error("Lỗi khi cập nhật thông tin người dùng:", error);
      Alert.alert("Thông báo lỗi", error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendEmailVerification = async (user) => {
    try {
      await user.sendEmailVerification();
    } catch (error) {
      console.error("Lỗi khi gửi xác nhận email:", error);
      Alert.alert("Thông báo lỗi", error.message);
    }
  };

  const updatePhoneNumberAuth = async (mobileNo) => {
    try {
      if (currentUser && !currentUser.phoneNumber) {
        const confirmationResult = await auth().signInWithPhoneNumber(mobileNo);

        // Thực hiện xác nhận ngay lập tức bằng cách sử dụng mã xác nhận
        const verificationCode = "111111"; // Điền mã xác nhận bạn nhận được
        const credential = auth.PhoneAuthProvider.credential(
          confirmationResult.verificationId,
          verificationCode
        );
        await currentUser.updatePhoneNumber(credential);

        // Cập nhật thành công
        console.log("Số điện thoại đã được liên kết và xác nhận thành công");
      }
    } catch (error) {
      console.error("Lỗi khi liên kết và xác nhận số điện thoại:", error);
    }
  };

  const changeAvatar = async () => {
    if (loading === false) {
      // Chọn hình ảnh
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        base64: true,
        quality: 1,
      });

      if (!result.canceled) {
        setLoading(true);
        //Tách path ảnh từ firestorage link
        const urlAvatarFirebase = extractFileName(avatar);
        console.log(urlAvatarFirebase);
        //Xóa ảnh cũ khỏi firebase
        const storage = getStorage();

        const desertRef = ref(storage, "userImg/" + urlAvatarFirebase);
        // Delete the file
        deleteObject(desertRef)
          .then(() => {
            console.log("File deleted successfully");
          })
          .catch((error) => {
            console.log("Xoa anh firebase loi", error);
          });

        // Lấy URI của hình ảnh đã chọn trong máy
        const newAvatarUri = result.assets[0].uri;

        //Upload ảnh mới lên firebase và return url ảnh
        const urlAvatar = await uploadImage(newAvatarUri);
        //Cập nhật url ảnh vào colection users
        const docRef = doc(db, "user", idUser);
        await updateDoc(docRef, {
          photo: urlAvatar,
        });
        // Lưu URI vào trạng thái
        setAvatar(urlAvatar);

        setLoading(false);
      }
    }
  };
  const uploadImage = async (avatarImage) => {
    const storage = getStorage();
    const storageRef = ref(storage, "userImg");

    const getCurrentTimestamp = () => {
      const date = new Date();
      return `${date.getFullYear()}${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}${date.getDate().toString().padStart(2, "0")}_${date
        .getHours()
        .toString()
        .padStart(2, "0")}${date.getMinutes().toString().padStart(2, "0")}${date
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;
    };

    try {
      // Fetch the image
      const response = await fetch(avatarImage);
      const blob = await response.blob();
      // Create a filename
      const filename = idUser + `_${getCurrentTimestamp()}.jpg`;
      // Reference to the storage location
      const imageRef = ref(storageRef, filename);

      // Upload the image
      const snapshot = await uploadBytesResumable(imageRef, blob);

      // Get the download URL of the uploaded image
      const downloadURL = await getDownloadURL(snapshot.ref);

      console.log("Image has been uploaded.");
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error.message);
      return null;
    }
  };

  const extractFileName = (url) => {
    const parts = url.split("%2F");
    const fileNameWithQuery = parts[parts.length - 1];
    const fileNameParts = fileNameWithQuery.split("?");
    const fileName = fileNameParts[0];
    return fileName;
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 8 }}>
        {avatar === "" ? (
          <></>
        ) : (
          <>
            <View
              style={{
                marginVertical: 10,
                alignSelf: "center",
              }}
            >
              {/* Image Container */}
              <View style={styles.imageContainer}>
                {loading && (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={color.origin} />
                  </View>
                )}
                <Image
                  source={{ uri: avatar }}
                  style={{
                    width: 100,
                    height: 100,
                    borderWidth: 5,
                    borderColor: "white",
                    borderRadius: 100,
                  }}
                />
              </View>

              {/* Button */}
              <TouchableOpacity
                style={{
                  backgroundColor: color.origin,
                  padding: 5,
                  alignSelf: "center",
                  marginTop: -24,
                  marginLeft: 60,
                  borderRadius: 100,
                }}
                onPress={changeAvatar}
              >
                <FontAwesome5 name="exchange-alt" size={12} color="white" />
              </TouchableOpacity>
            </View>
          </>
        )}
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Tên tài khoản</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput style={styles.input} onChangeText={setName} value={name} />
        </View>

        {userData?.email ? (
          <View style={styles.list_items}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Email</Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <Text style={styles.input}>{email}</Text>
          </View>
        ) : (
          <View style={styles.list_items}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>Email</Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
            />
          </View>
        )}

        {userData?.mobileNo ? (
          <View style={styles.list_items}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>
                Số điện thoại
              </Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <Text style={styles.input}>{userData.mobileNo}</Text>
          </View>
        ) : (
          <View style={styles.list_items}>
            <View style={{ flexDirection: "row" }}>
              <Text style={{ marginLeft: 10, fontSize: 16 }}>
                Số điện thoại
              </Text>
              <Text style={{ color: "red" }}>*</Text>
            </View>
            <TextInput
              style={styles.input}
              onChangeText={setMobileNo}
              value={mobileNo}
            />
          </View>
        )}

        {/* <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Số điện thoại</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
              style={styles.input}
              onChangeText={setMobileNo}
              value={mobileNo}
              placeholder="+84"
            />
        </View> */}

        {/* <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Mật khẩu</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput style={styles.input} onChangeText={setPassword} value={password} />
        </View> */}

        <Pressable
          style={styles.list_items}
          onPress={() => navigation.navigate("UpdatePhoneNumber")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              Cập nhật số điện thoại
            </Text>
            <SimpleLineIcons
              marginLeft={15}
              name="arrow-right"
              size={10}
              color="#60698a"
            />
          </View>
        </Pressable>

        <Pressable
          style={styles.list_items}
          onPress={() => navigation.navigate("UpdatePassword")}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ marginLeft: 10, fontSize: 16 }}>
              Cập nhật mật khẩu
            </Text>
            <SimpleLineIcons
              marginLeft={15}
              name="arrow-right"
              size={10}
              color="#60698a"
            />
          </View>
        </Pressable>
      </View>

      <View style={{}}>
        <Button title="Lưu" color={color.origin} onPress={updateUser} />
      </View>
    </View>
  );
};

export default EditUserInfoScreen;

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
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure the loading indicator is above the image
  },
  imageContainer: {
    position: "relative",
  },
});
