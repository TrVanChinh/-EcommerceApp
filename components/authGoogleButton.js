import "expo-dev-client";
import {
  GoogleSignin,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
import auth from "@react-native-firebase/auth";
import { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { firebaseDatabase, db } from "../firebase";

const authGoogleButton = ({ onLoginSuccess }) => {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState("");

  GoogleSignin.configure({
    webClientId:
      "94539330946-of6c7os8nnevt42emh65ijh16kbaojhp.apps.googleusercontent.com",
  });
  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  // const onGoogleButtonPress = async () => {
  //   try {
  //     // Check if your device supports Google Play
  //     await GoogleSignin.hasPlayServices({
  //       showPlayServicesUpdateDialog: true,
  //     });
  //     await GoogleSignin.signOut();
  //     // Get the users ID token
  //     const { idToken,user } = await GoogleSignin.signIn();
  //     // Create a Google credential with the token
  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //     // Sign-in the user with the credential
  //     const user_sign_in = auth().signInWithCredential(googleCredential);
  //     const currentUser = auth().currentUser;
  //     const userDocRef = db.collection("user").doc(currentUser.uid);
  //     // Lưu thông tin người dùng vào Firestore
  //     await userDocRef.set({
  //       name: currentUser.displayName,
  //       email: currentUser.email,
  //     });
  //     onLoginSuccess(user_sign_in);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };



  const onGoogleButtonPress = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      
      await GoogleSignin.signOut();
      // Get the users ID token
      const { idToken, user } = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      const userCredential = await auth().signInWithCredential(googleCredential);
      // Get the current user after successful sign-in
      const currentUser = userCredential.user;
      console.log(currentUser.uid);
      const userDocRef = db.collection("user").doc(currentUser.uid);
      
      // Lưu thông tin người dùng vào Firestore
      await userDocRef.set({
        name: currentUser.displayName,
        email: currentUser.email,
        photo: currentUser.photoURL || null,
      });
  
      onLoginSuccess(userCredential);
    } catch (error) {
      console.log(error);
    }
  };
  
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
      style={{
        width: "100%",
        height: 65,
        alignItems: "center",
        marginBottom: 10,
      }}
      onPress={onGoogleButtonPress}
    />
  );
};

export default authGoogleButton;

const styles = StyleSheet.create({});
