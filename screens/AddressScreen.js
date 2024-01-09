import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { CheckBox, Icon } from 'react-native-elements';
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useContext,
  useCallback,
} from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Feather, AntDesign, Entypo ,MaterialCommunityIcons} from "@expo/vector-icons";
import { useUser } from "../UserContext";
import {
  collection,
  doc,
  query,
  onSnapshot,
  getDoc,
  where,
  runTransaction,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const AddressScreen = ({navigation}) => {
  const { user, updateAddress } = useUser();
  const idUser = user.user.uid
  const[address,setAddress] = useState([])
  const { height, width } = Dimensions.get("window");

  const GetAddress = async () => {
    try {
      const addressRef = collection(db, 'user', idUser, 'address'); 
      const addressSnapshot = await getDocs(addressRef);
      // Sử dụng Promise.all để đợi tất cả các promise hoàn thành
      const addresses = [];
      addressSnapshot.forEach((doc) => {
        addresses.push({
          id: doc.id,
          ...doc.data(),
        });
      });
  // Đây là mảng addresses chứa tất cả các địa chỉ từ subcollection "address"
      console.log(addresses);
      setAddress(addresses)
      return addresses;
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu địa chỉ:", error);
    }
  };
  useEffect(() => {
    GetAddress();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      console.log('Trang Address đã được tập trung');
      GetAddress();
    }, [])
  );

  const handleItemAddress = (address) => {
    updateAddress(address);
    navigation.navigate('Order');
  };
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {address?.map((item, index) =>
        <Pressable
          key={item.id}
          style={{
            borderWidth: 1,
            borderColor: "#D0D0D0",
            padding: 10,
            flexDirection: "column",
            gap: 5,
            marginVertical: 5,
            flexDirection: "row",
            justifyContent:'space-between'
          }}
          onPress={() => handleItemAddress(item)}
        >
          <CheckBox
            center
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={true}
            checkedColor="#f95122"
          />
          <View style={{ width:width*0.7}}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {item.name} | {item.phoneNumber}
            </Text>
            <Text style={{ fontSize: 12, color: "#181818" }}>
              {item.street}
            </Text>

            <Text style={{ fontSize: 12, color: "#181818" }}>
              {item.Ward}, {item.District}, {item.Provinces}
            </Text>
          </View>
          <Pressable
            style={{padding:5}}
            onPress={()=> navigation.navigate("UpdateAddress", { address: item })}
          >
            <Text style={{ color: "#f95122" }}>Sửa</Text>
          </Pressable>
        </Pressable>
      )}
        <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#D0D0D0",
            padding: 10,
            flexDirection: "column",
            gap: 5,
            flexDirection: "row",
            justifyContent:'center'
          }}
          onPress={() => navigation.navigate("NewAddress", 'address')}
        >
          <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#f95122" />
          <Text style={{ color: "#f95122" }}>Thêm địa chỉ mới</Text>
        </Pressable>
      </ScrollView>
    </>
  )
}

export default AddressScreen

const styles = StyleSheet.create({})