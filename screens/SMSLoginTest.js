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
  import auth from '@react-native-firebase/auth';

  
  const SMSLoginTest = ({navigation}) => {
    const { updateUser} = useUser();
    const [phoneNumber, setPhoneNumber] = useState('')
    const [code, setCode] = useState('')
    const [verificationId, setVerificationId] = useState(null)
    const recaptchaVerifier = useRef(null)
  
    const handleSendCode = async () => {
        try {
            
          const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
          console.log(confirmation)
          setVerificationId(confirmation.verificationId);
        } catch (error) {
          console.error(error);
        }
      };
    
      const handleConfirmCode = async () => {
        try {
          const credential = auth.PhoneAuthProvider.credential(
            verificationId,
            code
          );
          const userCredential = await auth().signInWithCredential(credential);
          updateUser(userCredential) 
          Alert.alert("Login Successful. Welcome To Dashboard");
          setCode("");
          navigation.navigate("Main");
        } catch (error) {
          console.error(error);
        }
      };
   
    const clearInput = () => {
      setPhoneNumber('');
    };
  
  
    return (
      <SafeAreaView style={{ width: "100%", alignItems: "center" }}>
        {/* <FirebaseRecaptchaVerifierModal
            ref={recaptchaVerifier}
            firebaseConfig={firebaseConfig}
        /> */}
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
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              autoComplete="tel"
              value={phoneNumber}
              leftIcon={<Feather name="phone" size={24} color="#857E7C" />}
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
            onPress={handleSendCode }
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
            onPress={handleConfirmCode }
        >
            <Text style={{ color: code.length > 0 ? "white" : "#857E7C" }}>
            Đăng nhập
            </Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };
  
  export default SMSLoginTest;
  
  const styles = StyleSheet.create({});
  