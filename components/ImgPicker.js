import { StyleSheet, Text, View, SafeAreaView, Platform, ScrollView, TouchableOpacity, Image, TextInput, FlatList, Pressable } from 'react-native'
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";

export default function ImagPicker() {
  const [selectedImage, setSelectedImage] = useState(null);
  const pickImageAsync = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  return (
        <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 400, height: 400 }}>
            <Image source={{ uri: selectedImage }} style={{ width: 400, height: 400 }} />
  
            </View>  
          <TouchableOpacity
            onPress={pickImageAsync}
            style={{
                marginTop: 20,
                height: 50,
                width:'60%',
                backgroundColor:'skyblue',
                borderRadius: 20,
                justifyContent:'center',
                alignItems:'center',
                alignSelf:'center'
            }}
          >
            <Text>Gallery</Text>
          </TouchableOpacity>
        </SafeAreaView>
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
