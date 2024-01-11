import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { getAuth, getUser } from 'firebase/auth';
import { doc, getDoc, getFirestore, updateDoc, setDoc  } from "firebase/firestore";
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
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUser } from '../UserContext';
import auth from '@react-native-firebase/auth';


const EditUserInfoScreen = ({ navigation, route }) => {
  const { user } = useUser();
  // console.log("pass",user.user.email)
  const { idUser: idUser } = route.params;
  const [avatar, setAvatar] = useState("");
  const [userData, setUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("")
  // console.log(idUser)

  const db = getFirestore(app);
  useEffect(() => {
    fetchUserData()
    getUserData();
  }, []);


  const fetchUserData = async() => {
    try {
      const userRecord = await auth().getUser(idUser);
  
      console.log("Successfully fetched user data:", userRecord);
  
      // Truy cập các thuộc tính của userRecord
      console.log("User UID:", userRecord.uid);
      console.log("User email:", userRecord.email);
      console.log("User displayName:", userRecord.displayName);
      // ...
    } catch (error) {
      console.log('Error fetching user data:', error);
    }
  }

  // Update state inside the useEffect when data is fetched
  useEffect(() => {
    if (userData) {
      setName(userData.name);
      setAddress(userData.address);
      setEmail(userData.email);
      setPhoneNumber(userData.mobileNo);
      setAvatar(userData.photo);
      setPassword(userData.password)
      //avatar gg = https://lh3.googleusercontent.com/a/ACg8ocJqThobPEndy9LkFEa0Dafe3pgnkZlr41UjDT3bKIUb_oU=s96-c
    }
  }, [userData]);

  useEffect(() => {
    // Log giá trị mới của loaiHangImg sau mỗi lần cập nhật
    console.log(avatar);
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
      if (name == "" || email =="" || password == "" || phoneNumber == "") {
        alert( "Không được để trống");
        return;
      }
  
      setLoading(true);
  
      const userDocRef = doc(db, "user", idUser);
      const userDocSnapshot = await getDoc(userDocRef);
      const updateData = {
        name: name, // Cập nhật giá trị của trường name
      };
      // Kiểm tra xem trường email đã tồn tại trong dữ liệu của tài liệu hay chưa
      if (!userDocSnapshot.data().hasOwnProperty("email")) {
        // Nếu không tồn tại, thêm mới trường email
        updateData.email = email;
      }
  
      if (!userDocSnapshot.data().hasOwnProperty("password")) {
        updateData.password = password;
      } else {
        updateData.password = password;
      }
  
      if (!userDocSnapshot.data().hasOwnProperty("mobileNo")) {
        updateData.mobileNo = phoneNumber;
      } else {
        updateData.mobileNo = phoneNumber;
      }
      await updateDoc(userDocRef, updateData);
      alert("Cập nhật thành công");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  

// const updateUser = async () => {
//   try {
//     if (name === "" || email === "" || password === "" || phoneNumber === "") {
//       Alert.alert("Thông báo", "Không được để trống");
//     } else {
//       setLoading(true);

//       const userDocRef = doc(db, "user", idUser);
//       const userDocSnapshot = await getDoc(userDocRef);

//       // Kiểm tra xem trường email đã tồn tại trong document hay chưa
//       if (!userDocSnapshot.exists("email")) {
//         // Nếu không tồn tại, thêm mới trường email
//         await updateDoc(userDocRef, { email: email });
//       }

//       // Kiểm tra xem trường password đã tồn tại trong document hay chưa
//       if (!userDocSnapshot.exists("password")) {
//         // Nếu không tồn tại, thêm mới trường password
//         await updateDoc(userDocRef, { password: password });
//       }

//       // Kiểm tra xem trường mobile đã tồn tại trong document hay chưa
//       if (!userDocSnapshot.exists("mobileNo")) {
//         // Nếu không tồn tại, thêm mới trường mobileNo
//         await updateDoc(userDocRef, { mobileNo: phoneNumber });
//       }

//       // Cập nhật thông tin trong Authentication
//       dataUser = user.user
//       console.log("dataUser", dataUser)
//       // Cập nhật email
//       if (!dataUser.email) {
//         await updateEmail(dataUser, email);
//       }

//       // Cập nhật password nếu tồn tại
//       if (password !== "") {
//         await updatePassword(dataUser, password);
//       }

//       // Kiểm tra và cập nhật số điện thoại nếu không tồn tại
//       if (!dataUser.phoneNumber) {
//         await updatePhoneNumber(dataUser, phoneNumber);
//       }

//       setLoading(false);

//       // Gửi email xác nhận
//       if (email !== user.email) {
//         await sendEmailVerification(user);
//         Alert.alert("Thông báo", "Vui lòng kiểm tra email và xác nhận địa chỉ email của bạn.");
//       } else {
//         Alert.alert("Thông báo", "Cập nhật thành công");
//       }
//     }
//   } catch (e) {
//     console.error(e);
//   }
// };

// const sendEmailVerification = async (user) => {
//   try {
//     await sendEmailVerification(user);
//   } catch (error) {
//     console.error(error);
//   }
// };


  const changeAvatar = async () => {
    if (loading===false){
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
      const urlAvatar = await uploadImage(newAvatarUri)
      //Cập nhật url ảnh vào colection users
      const docRef = doc(db, "user", idUser);
        await updateDoc(docRef, {
          photo:urlAvatar,
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
        .padStart(2, "0")}${date
        .getMinutes()
        .toString()
        .padStart(2, "0")}${date.getSeconds().toString().padStart(2, "0")}`;
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
        <ActivityIndicator size="large" color={color.origin}/> 
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
        {/* <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Địa chỉ</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setAddress}
            value={address}
          />
        </View> */}
        
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Email</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput style={styles.input} onChangeText={setEmail} value={email} />
        </View>

        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Số điện thoại</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
              style={styles.input}
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              placeholder="+84"
            />
        </View>
        
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Mật khẩu</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput style={styles.input} onChangeText={setPassword} value={password} />
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the loading indicator is above the image
  },
  imageContainer: {
    position: 'relative',
  },
});
