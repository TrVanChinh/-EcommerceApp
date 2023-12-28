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
import { useUser } from '../UserContext';

const OTPScreen = ({ navigation, route }) => {
  const [code, setCode] = useState("");
  const { updateUser } = useUser();
  const  verificationId  = route.params;
  console.log(verificationId.verId)

  const confirmCode = async () => {
    try {

      const credential = firebase.auth.PhoneAuthProvider.credential(
        verificationId.verId,
        code
      );
      const userCredential = await firebase.auth().signInWithCredential(credential);
      updateUser(userCredential)
      const uid = firebase.auth().currentUser.uid;
      const userRef = firebase.firestore().collection("user").doc(uid);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        await userRef.set({
          name: "User",
          mobileNo: verificationId.phoneNumber, 
        });
      }
  
      Alert.alert("Login Successful. Welcome To Dashboard");
      setCode("");
      navigation.navigate("Main");
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
