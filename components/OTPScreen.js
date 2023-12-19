import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Alert,
  SafeAreaView,
} from "react-native";
import React from "react";
import { Input, Icon } from "react-native-elements";
import { useState, useRef } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import firebase from "firebase/compat/app";

const OTPScreen = ({ navigation, route }) => {
  const [code, setCode] = useState("");
  
  const  verificationId  = route.params;
  console.log(verificationId.verificationId)
  const confirmCode = async () => {
    try {
        const credential = firebase.auth.PhoneAuthProvider.credential(
          verificationId.verificationId,
          code
        );
        await firebase.auth().signInWithCredential(credential);
        Alert.alert("Login Successful. Welcom To Dashboard");
        setCode("");
        navigation.navigate("Home");
      } catch (error) {
        console.log(error);
      }
  }
  const confirmCodes = async () => {
    try {
      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId.verificationId,
        code
      );
  
      // Kiểm tra xem số điện thoại đã đăng ký hay chưa
      const userCredential = await firebase.auth().signInWithCredential(credential);
      const user = userCredential.user;
      console.log(user.uid)
      if (user) {
        // Nếu số điện thoại đã đăng ký, đăng nhập thành công
        Alert.alert("Login Successful. Welcome To Dashboard");
        setCode("");
        navigation.navigate("Main");
      } else {
        const randomName = "User" + Math.floor(Math.random() * 1000);
        const newUser = {
          mobileNo: user.phoneNumber,
          name: randomName,
        };
  
        // Thêm người dùng mới vào Firestore với uid từ authentication làm khóa chính
        await firebase.firestore().collection("users").doc(user.uid).set(newUser);
        Alert.alert("Account created successfully!");
        setCode("");
        navigation.navigate("Home");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={{ width: "100%", alignItems: "center", padding:30 }}>
      <View style={{ width: "90%", top: 30 }}>
        <KeyboardAvoidingView behavior="padding">
          <Input
            placeholder="Nhập OTP"
            onChangeText={setCode}
            keyboardType="phone-pad"
            autoComplete="tel"
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            backgroundColor: code.length > 0 ? "#F1582C" : "lightgray",
            padding: 12,
            alignItems: "center",
          }}
          disabled={code.length === 0}
          onPress={confirmCode}
        >
          <Text style={{ color: code.length > 0 ? "white" : "#857E7C" }}>
            Tiếp theo
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({});
