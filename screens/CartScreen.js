// import {
//     StyleSheet,
//     Text,
//     View,
//     ScrollView,
//     Pressable,
//     TextInput,
//     Image,
//   } from "react-native";
//   import React, { useEffect, useState, useLayoutEffect, useContext, useCallback } from "react";
//   import { Feather,AntDesign } from "@expo/vector-icons";
//   // import jwtDecode from 'jwt-decode';
//   import axios from "axios";
//   import { useFocusEffect } from "@react-navigation/native";
  
//   const CartScreen = ({navigation}) => {
//     const[image,setImage] = useState('')
//     const[title,setTitle] = useState('')
//     const[price,setPrice] = useState('')
//     const[quantity,setQuantity] = useState('')
//     const[carts,setCart] = useState([])
//     const [count, setCount] = useState(0);
//     const [total, setTotal] = useState(0)
  
//     const fetchCart = async() => {
//       const token = await AsyncStorage.getItem("authToken")
//       //fix 0, _jwtDecode.default is not a function (it is undefined)
//       jwtDecode = require('jwt-decode');
//       const decodedToken = jwtDecode(token);
//       const userId = decodedToken.userId;
//       setUserId(userId)
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}/carts/${userId}`
//         );
//         const { productsInCart  } = response.data;
//         setCart(productsInCart );
//         calculateMoney(productsInCart);
  
//       } catch (error) {
//         alert("error", error);
//         console.log("error", error);
//       }
//     }
//     useLayoutEffect(() => {
//       fetchCart();
//     },[count]);
  
//     useFocusEffect(
//       useCallback(() => {
//         fetchCart();
//       }, [])
//     );
//     const handleProductDelete = (idProduct) => {
//       axios.delete(`${API_BASE_URL}/carts/${userId}/${idProduct}`).then((response) => {
//         console.log(response);
//         alert(
//         "Xóa thành công"
//         );
//         setCount((prevCount) => prevCount + 1);
//       }).catch((error) => {
//           alert("Xóa không thành công")
//           console.log(error)
//         })
//     }
  
//     const increaseQuantity = (idProduct) => {
//       axios.put(`${API_BASE_URL}/carts/${userId}/${idProduct}/increaseQuantity`).then((response) => {
//         console.log(response);
//         setCount((prevCount) => prevCount + 1);
//     }).catch((error) => {
//         alert("Error","Failed to add address")
//         console.log("error",error)
//     })
//     }
  
//     const reduceQuantity = (idProduct) => {
//       axios.put(`${API_BASE_URL}/carts/${userId}/${idProduct}/reducequantity`).then((response) => {
//         console.log(response);
        
//         setCount((prevCount) => prevCount + 1);
//     }).catch((error) => {
//         alert("Error","Failed to add address")
//         console.log("error",error)
//     })
//     }
  
//     const calculateMoney = () => {
//       let calculate = 0;
//       carts?.forEach((item) => {
//         calculate += item.quantity * item.price;
//         setTotal(calculate);
//       });
//       console.log("Total:", calculate);
//     }
//     return (
//       <ScrollView style={{ marginTop: 55, flex: 1, backgroundColor: "white" }}>
//         <View style={{ padding: 10, flexDirection: "row", alignItems: "center" }}>
//           <Text style={{ fontSize: 18, fontWeight: "400" }}>Tổng cộng : {total}đ</Text>
//           {/* <Text style={{ fontSize: 20, fontWeight: "bold" }}>{total}</Text> */}
//         </View>
//         <Pressable
//           // onPress={() => navigation.navigate("Confirm")}
//           style={{
//             backgroundColor: "#FFC72C",
//             padding: 10,
//             borderRadius: 5,
//             justifyContent: "center",
//             alignItems: "center",
//             marginHorizontal: 10,
//             marginTop: 10,
//           }}
//         >
//           <Text>Mua tất cả</Text>
//         </Pressable>
  
//         <Text
//           style={{
//             height: 1,
//             borderColor: "#D0D0D0",
//             borderWidth: 1,
//             marginTop: 16,
//           }}
//         />
  
//         <View style={{ marginHorizontal: 10 }}>
//           {carts?.map((item, index) => (
//             <View
//               style={{
//                 backgroundColor: "white",
//                 marginVertical: 10,
//                 borderBottomColor: "#F0F0F0",
//                 borderWidth: 2,
//                 borderLeftWidth: 0,
//                 borderTopWidth: 0,
//                 borderRightWidth: 0,
//               }}
//               key={index}
//             >
//               <Pressable
//                 style={{
//                   marginVertical: 10,
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                 }}
//               >
//                 <View>
//                   <Image
//                     style={{ width: 140, height: 140, resizeMode: "contain" }}
//                     source={{ uri: item?.Image }}
//                   />
//                 </View>
  
//                 <View>
//                   <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>
//                     {item?.title}
//                   </Text>
//                   <Text
//                     style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
//                   >
//                     {item?.price}đ
//                   </Text>
//                   <Text style={{ fontWeight: "500", marginTop: 6 }}>
//                     {item?.quantity} ratings
//                   </Text>
//                 </View>
//               </Pressable>
  
//               <Pressable
//                 style={{
//                   marginTop: 15,
//                   marginBottom: 10,
//                   flexDirection: "row",
//                   alignItems: "center",
//                   gap: 10,
//                 }}
//               >
//                 <View
//                   style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     paddingHorizontal: 10,
//                     paddingVertical: 5,
//                     borderRadius: 7,
//                   }}
//                 >
//                   {item?.quantity > 1 ? (
//                     <Pressable
//                       onPress={() => reduceQuantity(item._id)}
//                       style={{
//                         backgroundColor: "#D8D8D8",
//                         padding: 7,
//                         borderTopLeftRadius: 6,
//                         borderBottomLeftRadius: 6,
//                       }}
//                     >
//                       <AntDesign name="minus" size={24} color="black" />
//                     </Pressable>
//                   ) : (
//                     <Pressable
//                       style={{
//                         backgroundColor: "#6E7280",
//                         padding: 7,
//                         borderTopLeftRadius: 6,
//                         borderBottomLeftRadius: 6,
//                       }}
//                     >
//                       <AntDesign name="minus" size={24} color="black" />
//                     </Pressable>
//                   )}
  
//                   <Pressable
//                     style={{
//                       backgroundColor: "white",
//                       paddingHorizontal: 18,
//                       paddingVertical: 6,
//                     }}
//                   >
//                     <Text>{item?.quantity}</Text>
//                   </Pressable>
  
//                   <Pressable
//                     onPress={() => increaseQuantity(item._id)}
//                     style={{
//                       backgroundColor: "#D8D8D8",
//                       padding: 7,
//                       borderTopLeftRadius: 6,
//                       borderBottomLeftRadius: 6,
//                     }}
//                   >
//                     <Feather name="plus" size={24} color="black" />
//                   </Pressable>
//                 </View>
//                 <Pressable
//                   onPress={() => handleProductDelete(item._id)}
//                   style={{
//                     backgroundColor: "white",
//                     paddingHorizontal: 8,
//                     paddingVertical: 10,
//                     borderRadius: 5,
//                     borderColor: "#C0C0C0",
//                     borderWidth: 0.6,
//                   }}
//                 >
//                   <Text>Xóa</Text>
//                 </Pressable>
//               </Pressable>
  
//               <Pressable
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   gap: 10,
//                   marginBottom: 15,
//                 }}
//               >
//               </Pressable>
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     );
//   };
  
//   export default CartScreen;
  
//   const styles = StyleSheet.create({});



import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CartScreen = () => {
  return (
    <View>
      <Text>CartScreen</Text>
    </View>
  )
}

export default CartScreen

const styles = StyleSheet.create({})