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
import React, { version } from "react";
import { useState, useRef } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Input, Icon } from "react-native-elements";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { firebaseConfig } from "../firebase";
import {
    doc,
    getDoc,
    getFirestore,
    updateDoc,
    setDoc,
  } from "firebase/firestore";
import firebase from "firebase/compat/app";
import { useUser } from "../UserContext";
import auth from "@react-native-firebase/auth";
import { db } from "../firebase";

const UpdatePhoneNumberScreen = ({ navigation }) => {
  const { user } = useUser();
  const idUser = user.user.uid;
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const recaptchaVerifier = useRef(null);
  const [message, showMessage] = useState("");
  const currentUser = auth().currentUser;

  const sendVetification = async () => {
    try {
      const phoneProvider = new firebase.auth.PhoneAuthProvider();
      const verificationId = await phoneProvider.verifyPhoneNumber(
        phoneNumber,
        recaptchaVerifier.current
      );
      setVerificationId(verificationId);
      console.log(verificationId);
      showMessage({
        text: "Verification code has been sent to your phone.",
      });
    } catch (err) {
      showMessage({ text: `Error: ${err.message}`, color: "red" });
    }
  };

  const confirmCode = async () => {
    try {
        const credential = auth.PhoneAuthProvider.credential(
            verificationId,
            code
          );
          await currentUser.updatePhoneNumber(credential);

        // Cập nhật số điện thoại trong collection "user"
        const userRef = doc(db, "user", idUser);
        await updateDoc(userRef, {
            mobileNo: phoneNumber,
        });

        Alert.alert("Cập nhật thành công");
        setCode("");
        navigation.navigate("Main");
    } catch (error) {
        console.log(error);
        // Xử lý lỗi theo ý của bạn
    }
};


  const clearInput = () => {
    setPhoneNumber("");
  };

  return (
    <SafeAreaView style={{ width: "100%", alignItems: "center" }}>
      <FirebaseRecaptchaVerifierModal
        ref={recaptchaVerifier}
        firebaseConfig={firebaseConfig}
      />
      <View></View>
      <View style={{ width: "90%", top: 30 }}>
        <KeyboardAvoidingView behavior="padding">
          <Input
            placeholder="Số điện thoại"
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoComplete="tel"
            value={phoneNumber}
            rightIcon={
              phoneNumber ? (
                <AntDesign
                  name="close"
                  size={24}
                  color="#857E7C"
                  onPress={() => clearInput()}
                />
              ) : null
            }
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            backgroundColor: phoneNumber.length > 0 ? "#F1582C" : "lightgray",
            padding: 12,
            alignItems: "center",
          }}
          disabled={phoneNumber.length === 0}
          onPress={sendVetification}
        >
          <Text style={{ color: phoneNumber.length > 0 ? "white" : "#857E7C" }}>
            Tiếp theo
          </Text>
        </TouchableOpacity>
        <Input
          placeholder="OTP"
          onChangeText={setCode}
          keyboardType="phone-pad"
          autoComplete="tel"
        />
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
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default UpdatePhoneNumberScreen;

const styles = StyleSheet.create({});
