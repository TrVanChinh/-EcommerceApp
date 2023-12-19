import { StyleSheet, Text, View, Button, Image } from 'react-native'
import React from 'react'
import {getAuth, FacebookAuthProvider, signInWithCredential} from 'firebase/auth'
import 'expo-dev-client'
import { firebase } from '../firebase'
import { useState, useEffect } from "react";
import { LoginManager, AccessToken} from "react-native-fbsdk-next"


const authFacebookButton = () => {

  const [initializing, setInitializing] = useState(true)
  const [user, setUser] = useState('')

  // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user)
        if(initializing) setInitializing(false)
    }

    useEffect(() => {
        const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
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
            const auth = getAuth()
            const response = await signInWithCredential(firebase.auth(), facebookCredential) 
            console.log(response)

        }catch(e){
            console.log(e)
        }
    }

    const signOut = async () => {
        try {
            await firebase.auth().signOut()
        } catch (e) {
            console.log(e)
        }
    }
    if(initializing) return null;
    
    if(!user) {
        return (
            <View style= {{}}>
                <Button title='Sign in with Facebook' onPress={signInWithFB}/>
            </View>
        )
    }
 
  return (
    <View style={{marginTop:10, alignItems:'center'}}>
      <Text style={{ fontWeight:'bold', fontSize:20}}>authFacebookButton</Text>
      <View>
        <Text>{user.displayName}</Text>
        {/* <Image source={{uri: user.photo}}/> */}
      </View>
    </View>
  )
}

export default authFacebookButton

const styles = StyleSheet.create({})