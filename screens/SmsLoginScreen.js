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
import { firebaseConfig } from '../firebase'
import firebase from 'firebase/compat/app'
import { useUser } from '../UserContext';

const SmsLoginScreen = ({navigation}) => {
  const { updateUser } = useUser();
  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState('')
  const [verificationId, setVerificationId] = useState(null)
  const recaptchaVerifier = useRef(null)
  const [message, showMessage] = useState('')

  const sendVetification = async () => {
      try {
          const phoneProvider = new firebase.auth.PhoneAuthProvider();
          const verificationId = await phoneProvider.verifyPhoneNumber(
            phoneNumber,
            recaptchaVerifier.current
          );
          setVerificationId(verificationId);
          console.log(verificationId)
          showMessage({
            text: "Verification code has been sent to your phone.",
          });
        } catch (err) {
          showMessage({ text: `Error: ${err.message}`, color: "red" });
        }
  }
      

      // const confirmCode = async () => {
      //     try {
      //         const credential = firebase.auth.PhoneAuthProvider.credential(
      //           verificationId,
      //           code
      //         );
      //         await firebase.auth().signInWithCredential(credential);
      //         navigation.navigate("Main");
      //       } catch (err) {
      //         console.log(err)
      //       }
      // // navigation.navigate('Main');
      // }

      const confirmCode = async () => {
        try {
    
          const credential = firebase.auth.PhoneAuthProvider.credential(
            verificationId,
            code
          );
          const userCredential = await firebase.auth().signInWithCredential(credential);
          updateUser(userCredential) 
          console.log(userCredential)
          const uid = firebase.auth().currentUser.uid;
          const userRef = firebase.firestore().collection("user").doc(uid);
          const userDoc = await userRef.get();
      
          if (!userDoc.exists) {
            await userRef.set({
              name: "User", 
              mobileNo: phoneNumber, 
              photo: "https://icon2.cleanpng.com/20180514/xvw/kisspng-exotel-cloud-communications-privacy-policy-interac-5afa0479ea45a9.7590282815263345859596.jpg"
            });
          }
      
          Alert.alert("Login Successful. Welcome To Dashboard");
          setCode("");
          navigation.navigate("Main");
        } catch (error) {
          console.log(error);
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
      <View> 
      <Image
        style={{ width: 60, height: 80, top: 20 }}
        source={require("../assets/shopLogo.png")}
      />
    </View>
      <View style={{ width: "90%", top: 30 }}>
        <KeyboardAvoidingView behavior="padding">
          <Input
            placeholder="Số điện thoại"
            onChangeText={(text) => setPhoneNumber(text)}
            keyboardType="phone-pad"
            autoComplete="tel"
            leftIcon={<Feather name="phone" size={24} color="#857E7C" />}
            rightIcon={
              phoneNumber ? (
                <AntDesign
                  name="close"
                  size={24}
                  color="#857E7C"
                  onPress={clearInput}
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
          Login
          </Text>
      </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default SmsLoginScreen;

const styles = StyleSheet.create({});
