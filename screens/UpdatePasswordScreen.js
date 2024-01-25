import {
  StyleSheet,
  Text,
  Image,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Alert,
} from "react-native";
import React, { useEffect, version } from "react";
import { useState, useRef } from "react";
import { Input, Icon } from "react-native-elements";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import {
  doc,
  getDoc,
  getFirestore,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import { useUser } from "../UserContext";
import { db } from "../firebase";
import auth from "@react-native-firebase/auth";

const UpdatePasswordScreen = ({navigation}) => {
  const { user } = useUser();
  const idUser = user.user.uid;
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [userData, setUserData] = useState([]);
  const currentUser = auth().currentUser;

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const docRef = doc(db, "user", idUser);
      const docSnap = await getDoc(docRef);
      // Set state only when data is available
      setUserData(docSnap.data());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updatePassword = async () => {
    if( password != userData.password) {
        alert("Mật khẩu không chính xác");
    }else if(newPassword.length < 8) {
        alert("Mật khẩu có ít nhất 8 kí tự");
    } else if(newPassword === confirm){
        try {
            const userDocRef = doc(db, "user", idUser);
            const userDocSnapshot = await getDoc(userDocRef);
            const updateData = {};

            updateData.password = newPassword;
            // Thực hiện cập nhật dữ liệu trong firestore
            await updateDoc(userDocRef, updateData);

            // Cập nhật password trong auth nếu password tồn tại và khác rỗng
            if (newPassword && newPassword !== "") {
                await currentUser.updatePassword(newPassword);
            }
            alert("Cập nhật thành công");
            navigation.navigate("Main");
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin người dùng:', error);
            Alert.alert("Thông báo lỗi", error.message);
        }
    } else {
        alert("Xác thực mật khẩu chưa chính xác");
    }
};

const  AddPassword = async () => {
    if (password.length < 8) {
        alert("Mật khẩu có ít nhất 8 kí tự");
    }
     else if (password === confirm) {
        try {
            const userDocRef = doc(db, "user", idUser);
            const userDocSnapshot = await getDoc(userDocRef);
            const updateData = {};

            // Kiểm tra sự tồn tại của trường "password"
            if (!userDocSnapshot.data().hasOwnProperty("password")) {
                // Nếu không tồn tại, tạo mới trường "password"
                updateData.password = password;
            } else {
                // Nếu tồn tại, cập nhật giá trị của trường "password"
                updateData.password = password;
            }

            // Thực hiện cập nhật dữ liệu trong firestore
            await updateDoc(userDocRef, updateData);

            // Cập nhật password trong auth nếu password tồn tại và khác rỗng
            if (password && password !== "") {
                await currentUser.updatePassword(password);
            }
            alert("Cập nhật thành công");
            navigation.navigate("Main");
        } catch (error) {
            console.error('Lỗi khi cập nhật thông tin người dùng:', error);
            Alert.alert("Thông báo lỗi", error.message);
        }
    } else {
        alert("Xác thực mật khẩu chưa chính xác");
    }
};



  return (
    <SafeAreaView style={{ width: "100%", alignItems: "center" }}>
      {userData?.password ? (
        <View style={{ width: "90%", top: 30 }}>
          <KeyboardAvoidingView behavior="padding">
            <Input
              placeholder="Nhập mật khẩu"
              onChangeText={setPassword}
              value={password}
              style={{ fontSize: 16 }}
            />
            <Input
              placeholder="Nhập mật khẩu mới"
              onChangeText={setNewPassword}
              value={newPassword}
              style={{ fontSize: 16 }}
            />
            <Input
              placeholder="Nhập lại mật khẩu"
              onChangeText={setConfirm}
              value={confirm}
              style={{ fontSize: 16 }}
            />
          </KeyboardAvoidingView>

          <TouchableOpacity
            style={{
              backgroundColor:
                confirm.length && password.length > 0 ? "#F1582C" : "lightgray",
              padding: 12,
              alignItems: "center",
            }}
            disabled={confirm.length === 0 && password.length === 0}
            onPress={updatePassword}
          >
            <Text
              style={{
                color:
                  confirm.length && password.length > 0 ? "white" : "#857E7C",
              }}
            >
              Cập nhật
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: "90%", top: 30 }}>
          <KeyboardAvoidingView behavior="padding">
            <Input
              placeholder="Nhập mật khẩu"
              onChangeText={setPassword}
              value={password}
              style={{ fontSize: 16 }}
            />
          </KeyboardAvoidingView>
          <Input
            placeholder="Nhập lại mật khẩu"
            onChangeText={setConfirm}
            value={confirm}
            style={{ fontSize: 16 }}
          />
          <TouchableOpacity
            style={{
              backgroundColor:
                confirm.length && password.length > 0 ? "#F1582C" : "lightgray",
              padding: 12,
              alignItems: "center",
            }}
            disabled={confirm.length === 0 && password.length === 0}
            onPress={AddPassword}
          >
            <Text
              style={{
                color:
                  confirm.length && password.length > 0 ? "white" : "#857E7C",
              }}
            >
              Cập nhật
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default UpdatePasswordScreen;

const styles = StyleSheet.create({});
