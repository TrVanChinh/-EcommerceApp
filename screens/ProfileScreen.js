import { StyleSheet, Button, Text, View } from 'react-native'
import React from 'react'

const ProfileScreen = ({navigation}) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate('Login')}
      />
       <Button title="Go to Register" onPress={() => navigation.navigate('Register')} />
    </View>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({})