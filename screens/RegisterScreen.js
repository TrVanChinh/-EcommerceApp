import {
  StyleSheet,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  View,
  Alert,
} from "react-native";
import React from "react";
import { useState } from "react";
import { Feather, AntDesign } from "@expo/vector-icons";
import { Input, Icon } from "react-native-elements";
import { Axios } from "axios";


const RegisterScreen = () => {
  const [inputValue, setInputValue] = useState("");
  const clearInput = () => {
    setInputValue("");
  };
  // const handleRegister = () => {
  //   const user = {
  //     photo: photo, 
  //     email: email, 
  //     id: id
  //   }
  //   Axios.post("http://localhost:8000/register", user).then((response) => {
  //     console.log(response)
  //     Alert.alert(
  //       "Registration Successfully",
  //       "You have registered successfully"
  //     );

  //   })
  // }
  return (
    <SafeAreaView style={{ width: "100%", alignItems: "center" }}>
      <View>
        <Image
          style={{ width: 60, height: 60, top: 20 }}
          source={require("../assets/LogoShopee.png")}
        />
      </View>
      <View style={{ width: "90%", top: 30 }}>
        <KeyboardAvoidingView behavior="padding">
          <Input
            placeholder="Số điện thoại"
            onChangeText={(text) => setInputValue(text)}
            value={inputValue}
            leftIcon={<Feather name="phone" size={24} color="black" />}
            rightIcon={
              inputValue ? (
                <AntDesign
                  name="close"
                  size={24}
                  color="black"
                  onPress={clearInput}
                />
              ) : null
            }
          />
        </KeyboardAvoidingView>
        <TouchableOpacity
          style={{
            backgroundColor: inputValue.length > 0 ? "#F1582C" : "lightgray",
            padding: 12,
            alignItems: "center",
          }}
          disabled={inputValue.length === 0}
          onPress={() => {
            alert("hehe");
          }}
        >
          <Text style={{ color: inputValue.length > 0 ? "white" : "#857E7C" }}>
            Tiếp theo
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: 'center', marginVertical: 20 }}>
          <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD" }}></View>
          <Text style={{ color:"#857E7C"}}>Hoặc</Text>
          <View style={{ flex: 1, height: 1, backgroundColor: "#D5DBCD"}}></View>
        </View>
        
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor:'#D5DBCD',
            padding: 12,
            alignItems: "center",
            marginBottom: 10,
          }}
          onPress={() => {
            console.log("Facebook");
          }}
        > 
          
          <Text>Sign in with Facebook</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({});
