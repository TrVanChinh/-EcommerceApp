
import 'expo-dev-client'
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const authGoogleButton = ({ onLoginSuccess }) => {
    // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState('')

  GoogleSignin.configure({
    webClientId:'94539330946-of6c7os8nnevt42emh65ijh16kbaojhp.apps.googleusercontent.com',
  })
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  const onGoogleButtonPress = async() => {

    try {
    // Check if your device supports Google Play
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        await GoogleSignin.signOut();
        // Get the users ID token
        const { idToken } = await GoogleSignin.signIn();
    
        // Create a Google credential with the token
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    
        // Sign-in the user with the credential
        const user_sign_in = auth().signInWithCredential(googleCredential);
        // Gọi hàm xử lý đăng nhập thành công từ prop
        onLoginSuccess(user_sign_in.user);
        }catch (error) {
            console.log(error);
          }
    
  }

//   const signOut = async () => {
//     try {
//         await GoogleSignin.revokeAccess()
//         await auth().signOut()
//     } catch (error) {
//         console.error(error)
        
//     }
//   }

  if (initializing) return null;

  return (
    <GoogleSigninButton 
        style={{ width: 300, height: 65, margin:10}}
        onPress={onGoogleButtonPress}
    />
  )
}

export default authGoogleButton

const styles = StyleSheet.create({})