// use navigation:
// npm install @react-navigation/native
// npx expo install react-native-screens react-native-safe-area-context
// npm install @react-navigation/native-stack
// npm install @react-navigation/bottom-tabs


// use react native element:
// npm install react-native-elements
// npm install react-native-vector-icons


//npm i axios

//npm install --save @react-native-firebase/app

//create slide:
//npm install react-native-swiper

//login google
//npx expo install expo-dev-client
//eas build --profile development --platform android
//npx expo install @react-native-google-signin/google-signin
//npm i @react-native-firebase/auth
//npx expo start --dev-client


import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ProfileScreen from './screens/ProfileScreen';
import StackNavigator from './navigation/StackNavigator';
export default function App() {
  return (
    <StackNavigator/>
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
