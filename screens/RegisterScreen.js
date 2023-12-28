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
import AuthGoogleButton from '../components/authGoogleButton'
import { useUser } from '../UserContext';

const RegisterScreen = ({navigation}) => {
  const { updateUser } = useUser();
  const [phoneNumber, setPhoneNumber] = useState('')
  // const [code, setCode] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const recapchaVerifier = useRef(null)

  // const sendVetification = () => {
  //   const phoneProvider = new firebase.auth.PhoneAuthProvider()
  //   phoneProvider
  //   if (recapchaVerifier.current) {
  //     phoneProvider
  //       .verifyPhoneNumber(phoneNumber, recapchaVerifier.current)
  //       .then((confirmationResult) => {
  //         setVerificationId(confirmationResult.verificationId);
  //         setPhoneNumber('');
  //         navigation.navigate('OTPScreen', { verificationId });
  //       })
  //       .catch((error) => {
  //         // Xử lý lỗi khi xác thực số điện thoại
  //         console.error('Error sending verification code:', error);
  //       });
  //     } else {
  //       // Xử lý trường hợp recapchaVerifier.current là null
  //       console.error('recapchaVerifier.current is null');
  //     }
  // }
  const sendVetification = async () => {
    try {
        const phoneProvider = new firebase.auth.PhoneAuthProvider();
        const verId = await phoneProvider.verifyPhoneNumber(
          phoneNumber,
          recapchaVerifier.current
        );
        setVerificationId(verId);
        console.log(verificationId)
        setPhoneNumber('');
        navigation.navigate('OTPScreen', { verId, phoneNumber });
        
      } catch (err) {
        console.error('Error sending verification code:', err);
      }
}

  const onLoginSuccess = (user) => { 
    updateUser(user);
    console.log('Register success:', user);
    navigation.navigate('Main')
  }
  
  const clearInput = () => {
    setPhoneNumber("");
  };
  return (
    <SafeAreaView style={{ width: "100%", alignItems: "center" }}>
      <View>
        <FirebaseRecaptchaVerifierModal
            ref={recapchaVerifier}
            firebaseConfig={firebaseConfig}
        />
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
            value={phoneNumber}
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
        <View style={{ flexDirection: "row", alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}></View>
          <Text style={{ color:"#857E7C"}}>Hoặc</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD"}}></View>
        </View>
        <AuthGoogleButton onLoginSuccess={onLoginSuccess} />
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor:'#D5DBCD',
            backgroundColor:'#357EFF',
            padding: 12,
            alignItems: "center",
            marginBottom: 10,
          }}
          onPress={() => {
            console.log("Facebook");
          }}
        > 
          
          <Text style={{color:'white'}}>Facebook</Text>
        </TouchableOpacity>
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:"center", paddingTop:20}}>
          <Text>Bạn chưa đã có tài khoản?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={{ color:'blue'}}>Đăng nhập</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});


// import {
//   StyleSheet,
//   Text,
//   Image,
//   TextInput,
//   SafeAreaView,
//   TouchableOpacity,
//   KeyboardAvoidingView,
//   View,
//   Alert,
// } from "react-native";
// import React, { version } from "react";
// import { useState, useRef } from "react";
// import { Feather, AntDesign } from "@expo/vector-icons";
// import { Input, Icon } from "react-native-elements";
// import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
// import { firebaseConfig } from '../firebase'
// import firebase from 'firebase/compat/app'
 
// const RegisterScreen = () => {
//   const [phoneNumber, setPhoneNumber] = useState('')
//   const [code, setCode] = useState('')
//   const [verificationId, setVerificationId] = useState(null)
//   const recaptchaVerifier = useRef(null)
//   const [message, showMessage] = useState('')

//   const sendVetification = async () => {
//       try {
//           const phoneProvider = new firebase.auth.PhoneAuthProvider();
//           const verificationId = await phoneProvider.verifyPhoneNumber(
//             phoneNumber,
//             recaptchaVerifier.current
//           );
//           setVerificationId(verificationId);
//           showMessage({
//             text: "Verification code has been sent to your phone.",
//           });
//         } catch (err) {
//           showMessage({ text: `Error: ${err.message}`, color: "red" });
//         }
//   }
      

//       const confirmCode = async () => {
//           try {
//               const credential = firebase.auth.PhoneAuthProvider.credential(
//                 verificationId,
//                 code
//               );
//               await firebase.auth().signInWithCredential(credential);
//               showMessage({ text: "Phone authentication successful 👍" });
//             } catch (err) {
//               showMessage({ text: `Error: ${err.message}`, color: "red" });
//             }
//       // navigation.navigate('Main');
//       }

//   const clearInput = () => {
//     setPhoneNumber("");
//   };
//   return (
//     <SafeAreaView style={{ width: "100%", alignItems: "center" }}>
//       <FirebaseRecaptchaVerifierModal
//           ref={recaptchaVerifier}
//           firebaseConfig={firebaseConfig}
//       />
//       <View style={{ width: "90%", top: 30 }}>
//         <KeyboardAvoidingView behavior="padding">
//           <Input
//             placeholder="Số điện thoại"
//             onChangeText={(text) => setPhoneNumber(text)}
//             keyboardType="phone-pad"
//             autoComplete="tel"
//             leftIcon={<Feather name="phone" size={24} color="black" />}
//             rightIcon={
//               phoneNumber ? (
//                 <AntDesign
//                   name="close"
//                   size={24}
//                   color="black"
//                   onPress={clearInput}
//                 />
//               ) : null
//             }
//           />
//         </KeyboardAvoidingView>
//         <TouchableOpacity
//           style={{
//             backgroundColor: phoneNumber.length > 0 ? "#F1582C" : "lightgray",
//             padding: 12,
//             alignItems: "center",
//           }}
//           disabled={phoneNumber.length === 0}
//           onPress={sendVetification}
//         >
//           <Text style={{ color: phoneNumber.length > 0 ? "white" : "#857E7C" }}>
//             Tiếp theo
//           </Text>
//         </TouchableOpacity>
//         <Input
//           placeholder="OTP"
//           onChangeText={setCode}
//           keyboardType="phone-pad"
//           autoComplete="tel"
//           />
//       <TouchableOpacity
//           style={{
//           backgroundColor: code.length > 0 ? "#F1582C" : "lightgray",
//           padding: 12,
//           alignItems: "center",
//           }}
//           disabled={code.length === 0}
//           onPress={confirmCode}
//       >
//           <Text style={{ color: code.length > 0 ? "white" : "#857E7C" }}>
//           Login
//           </Text>
//       </TouchableOpacity>
//         <View style={{ flexDirection: "row", alignItems: 'center', marginVertical: 20 }}>
//           <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}></View>
//           <Text style={{ color:"#857E7C"}}>Hoặc</Text>
//           <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD"}}></View>
//         </View>
        
//         <TouchableOpacity
//           style={{
//             borderWidth: 1,
//             borderColor:'#D5DBCD',
//             padding: 12,
//             alignItems: "center",
//             marginBottom: 10,
//           }}
//           onPress={() => {
//             console.log("Facebook");
//           }}
//         > 
          
//           <Text>Sign in with Facebook</Text>
//         </TouchableOpacity>
//       </View>
//     </SafeAreaView>
//   );
// };

// export default RegisterScreen;

// const styles = StyleSheet.create({});
