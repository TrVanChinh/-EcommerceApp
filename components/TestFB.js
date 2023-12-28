import { StyleSheet, Text, View, Button, Image } from 'react-native'
import React from 'react'
// import {FacebookAuthProvider, signInWithCredential} from 'firebase/auth'
import { FacebookAuthProvider, signInWithCredential } from 'firebase/compat/auth';
import 'expo-dev-client'
import auth from "@react-native-firebase/auth";
import { firebase } from '../firebase'
import { useState, useEffect } from "react";
import { LoginManager, AccessToken} from "react-native-fbsdk-next"


const TestFB = () => {

  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState('')

  // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user)
        if(initializing) setInitializing(false)
    }

    useEffect(() => {
        const subscriber =auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber
    },[])

    const signInWithFB = async () => {
        try{
            await LoginManager.logInWithPermissions(['public_profile', 'email'])
            const data = await AccessToken.getCurrentAccessToken()
            if(!data) {
                return
            }
            const facebookCredential = FacebookAuthProvider.credential(data.accessToken)
            const response = await signInWithCredential(auth(), facebookCredential) 
            console.log(response)

        }catch(error){
            console.log(error)
        }
    }

    const signOut = async () => {
        try {
            await auth().signOut()
        } catch (e) {
            console.log(e)
        }
    }
    if(initializing) return null;
    
    if(!user) {
        return (
            <View style= {{ alignSelf:'center', justifyContent:'center', flex:1}}>
                <Button title='Sign in with Facebook' onPress={signInWithFB} />
            </View>
        )
    }
 
  return (
    <View style={{marginTop:10, flex:1, alignItems:'center', justifyContent:'center'}}>
      <Text style={{ fontWeight:'bold', fontSize:20}}>authFacebookButton</Text>
      <View>
        <Text>{user.displayName}</Text>
        {/* <Image source={{uri: user.photo}}/> */}
        <Button onPress={signOut} title='Đăng xuất'/>
      </View>
    </View>
  )
}

export default TestFB

const styles = StyleSheet.create({})