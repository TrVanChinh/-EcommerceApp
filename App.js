// use navigation:
// npm install @react-navigation/native
// npx expo install react-native-screens react-native-safe-area-context
// npm install @react-navigation/native-stack
// npm install @react-navigation/bottom-tabs


// use react native element:
// npm install react-native-elements
// npm install react-native-vector-icons


//npm i axios

//npx expo install @react-native-firebase/app
//npx expo install firebase

//create slide:
//npm install react-native-swiper

//login google:
//npx expo install expo-dev-client
//eas build --profile development --platform android
//npx expo install @react-native-google-signin/google-signin
//npm i @react-native-firebase/auth
//npx expo start --dev-client

//login facebook:
//npm install --save react-native-fbsdk-next


// check sha-1:
//eas credentials 

//image picker
//npx expo install expo-image-picker
//npm install expo-module-scripts
//expo install expo-constants


//login sms
//npx expo install expo-firebase-recaptcha@2.3.1
//npx expo install expo-firebase-recaptcha
//npm install react-native-webview@11.23.1
//npx expo install expo-firebase-core

//delete all node_modules
//rd /s /q node_modules

//filter
//npm install @react-navigation/drawer
//npx expo install react-native-gesture-handler react-native-reanimated

//modal
//npm i react-native-modals

//npm install react-native-element-dropdown --save

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ProfileScreen from './screens/ProfileScreen';
import StackNavigator from './navigation/StackNavigator';
import ImgPicker from './components/ImgPicker';
import DetailScreen from './screens/DetailScreen';
import SearchScreen from './screens/SearchScreen';
import TestFB from './components/TestFB'
import SmsLoginScreen from './screens/SmsLoginScreen';
import CartScreen from './screens/CartScreen';
import { UserProvider } from './UserContext';
import { ModalPortal } from 'react-native-modals';
import OrderScreen from './screens/OrderScreen';
import NewAddressScreen from './screens/NewAddressScreen';
import SetUpAddressScreen from './screens/SetUpAddressScreen';
import ShopScreen from './screens/ShopScreen';
export default function App() {
  return (
    <UserProvider>
      
      <StackNavigator/> 
      <ModalPortal/>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


