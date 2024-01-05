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
import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useContext,
  useCallback,
} from "react";
import {
  Feather,
  AntDesign,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useUser } from "../UserContext";
import {
  collection,
  doc,
  addDoc,
  query,
  onSnapshot,
  getDoc,
  where,
  runTransaction,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

const NewAddressScreen = ({navigation, route}) => {
  const { user } = useUser();
  const userId = user.user.uid
  const { lableProvinces, lableDistrict, lableWard } = route.params;
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [street, setStreet] = useState(null);
  const { height, width } = Dimensions.get("window");
  console.log(lableProvinces)
  console.log(lableDistrict)
  console.log(lableWard)

  const addToAddress = async (userId) => {
    try {
      // Kiểm tra xem người dùng đã có giỏ hàng chưa
      const userDocRef = doc(db, 'user', userId);
      const userDocSnapshot = await getDoc(userDocRef);
  
      if (userDocSnapshot.exists()) {
          // Nếu sản phẩm đã tồn tại trong giỏ hàng, cập nhật số lượng
          const addressCollectionRef = collection(userDocRef,'address');
          // Thêm thông tin địa chỉ vào subcollection "address"
          await addDoc(addressCollectionRef, {
            name: name,
            phoneNumber: phoneNumber,
            Provinces: lableProvinces,
            District: lableDistrict,
            Ward: lableWard,
            street: street,
          });
          alert('Thêm địa chỉ thành công.');
        }
       else {
        console.log('Người dùng không tồn tại.');
      }
    } catch (error) {
      console.error('Lỗi khi Thêm địa chỉ mới:', error);
    
      }}



  return (
    <View>
      <Text style={{ padding:10, borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Liên hệ</Text>
      <TextInput
        onChangeText={(text) => {
          setName(text);
        }}
        style={{
          height: height / 12,
          borderBottomWidth:0.5,
          paddingStart:10,
          backgroundColor:'white',
          borderColor: "#D0D0D0"
        }}
        autoCorrect={false}
        placeholder="Họ và Tên"
      />

      <TextInput
        onChangeText={(text) => {
          setPhoneNumber(text);
        }}
        style={{
          height: height / 12,
          borderBottomWidth:0.5,
          paddingStart:10,
          backgroundColor:'white',
          borderColor: "#D0D0D0"
        }}
        autoCorrect={false}
        placeholder="Số điện thoại"
      />
     
      <Text style={{ padding:10, borderBottomWidth:0.5, borderColor: "#D0D0D0"}}>Địa chỉ</Text>
      <Pressable
        style={{
            flexDirection:'row',
            justifyContent:'space-between',
            height: height / 12,
            borderBottomWidth:0.5,
            paddingStart:10,
            backgroundColor:'white',
            borderColor: "#D0D0D0",
            alignItems:'center'
        }}
        onPress={() => navigation.navigate('SetUpAddress')}
      >
        {lableProvinces ? (
          <Text>{lableProvinces}, {lableDistrict}, {lableWard}</Text>
        ) : (
          <Text>Tỉnh/Thành, Quân/Huyện, Phường/Xã</Text>
        )}
        <AntDesign name="right" size={20} color="#D0D0D0" />
      </Pressable>
      <TextInput
        onChangeText={(text) => {
          setStreet(text);
        }}
        style={{
          height: height / 12,
          borderBottomWidth:0.5,
          paddingStart:10,
          backgroundColor:'white',
          borderColor: "#D0D0D0"
        }}
        autoCorrect={false}
        placeholder="Tên đường, Tòa nhà, Số nhà."
      />
      <Pressable
        style={{
            height: height / 15,
            borderBottomWidth:0.5,
            paddingStart:10,
            backgroundColor: lableProvinces === null || lableDistrict === null || lableWard === null || phoneNumber === null || name === null || street === null ? "lightgray": "#f95122",
            borderColor: "#D0D0D0",
            alignItems:'center',
            justifyContent:'center'
        }}
        onPress={()=> {
          lableProvinces === null || lableDistrict === null || lableWard === null || phoneNumber === null || name === null || street === null ? alert("Điền đầy đủ thông tin")
          : addToAddress(userId) , navigation.navigate('Address')
        }}
      >
        <Text style={{ color: lableProvinces === null || lableDistrict === null || lableWard === null || phoneNumber === null || name === null || street === null ? "black": "white",}}>HOÀN THÀNH</Text>
        
      </Pressable>
    </View>
  );
};

export default NewAddressScreen;

const styles = StyleSheet.create({});
