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
  import React, { useEffect, useState, useLayoutEffect, useContext, useCallback } from "react";
  import { Feather,AntDesign } from "@expo/vector-icons";
  // import jwtDecode from 'jwt-decode';
  import axios from "axios";
  import { useFocusEffect } from "@react-navigation/native";
  import { useUser } from '../UserContext';
  import { doc, getDoc } from 'firebase/firestore';
  import { db } from '../firebase';
  const CartScreen = ({navigation}) => {
    const { user } = useUser();

    const[carts,setCart] = useState([])
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0)
    const { height, width } = Dimensions.get("window");
    const [quantity, setQuantity] = useState(0)
    return (
      <>
        <ScrollView style={{ flex: 1, backgroundColor: "white" }}> 
          <View style={{ marginHorizontal: 10 }}>
              <View
                style={{
                  backgroundColor: "white",
                  marginVertical: 10,
                  borderBottomColor: "#F0F0F0",
                  borderWidth: 2,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                }}
              >
                <Pressable
                  style={{
                    flexDirection: "row",
                    
                  }}
                >
                  <View style={{
                    paddingRight: 20,
                    
                  }}>
                    <Image
                      style={{ width: 140, height: 140, resizeMode: "contain",  }}
                     source={{uri: "https://vcdn1-dulich.vnecdn.net/2022/09/03/2-1-1662221151.jpg?w=460&h=0&q=100&dpr=2&fit=crop&s=Kwi46kzNspwVA_f3JUhgFg"}}
                    />
                  </View>
    
                  <View>
                    <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>
                      tên sản phẩm
                    </Text>
                    <Text
                      style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                    >
                      giá sản phẩm
                    </Text>
                    <Text style={{ fontWeight: "500", marginTop: 6 }}>
                       ratings
                    </Text>
                  </View>
                </Pressable>
    
                <Pressable
                  style={{
                    marginTop: 15,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    alignSelf: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 7,
                    }}
                  >
                    {quantity > 1 ? (
                      <Pressable
                        style={{
                          backgroundColor: "#D8D8D8",
                          padding: 7,
                          borderTopLeftRadius: 6,
                          borderBottomLeftRadius: 6,
                        }}
                      >
                        <AntDesign name="minus" size={20} color="black" />
                      </Pressable>
                    ) : (
                      <Pressable
                        style={{
                          backgroundColor: "#6E7280",
                          padding: 7,
                          borderTopLeftRadius: 6,
                          borderBottomLeftRadius: 6,
                        }}
                      >
                        <AntDesign name="minus" size={20} color="black" />
                      </Pressable>
                    )}
    
                    <Pressable
                      style={{
                        backgroundColor: "white",
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                      }}
                    >
                      <Text>số lượng </Text>
                    </Pressable>
    
                    <Pressable
                      style={{
                        backgroundColor: "#D8D8D8",
                        padding: 7,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                    >
                      <Feather name="plus" size={20} color="black" />
                    </Pressable>
                  </View>
                  <Pressable
                    style={{
                      backgroundColor: "white",
                      paddingHorizontal: 8,
                      paddingVertical: 10,
                      borderRadius: 5,
                      borderColor: "#C0C0C0",
                      borderWidth: 0.6,
                    }}
                  >
                    <Text>Xóa</Text>
                  </Pressable>
                </Pressable>
    

              </View>
          </View>
          
          <View style={{ marginHorizontal: 10 }}>
            {carts?.map((item, index) => (
              <View
                style={{
                  backgroundColor: "white",
                  marginVertical: 10,
                  borderBottomColor: "#F0F0F0",
                  borderWidth: 2,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                }}
                key={index}
              >
                <Pressable
                  style={{
                    marginVertical: 10,
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Image
                      style={{ width: 140, height: 140, resizeMode: "contain" }}
                      source={{ uri: item?.Image }}
                    />
                  </View>
    
                  <View>
                    <Text numberOfLines={3} style={{ width: 150, marginTop: 10 }}>
                      {item?.title}
                    </Text>
                    <Text
                      style={{ fontSize: 20, fontWeight: "bold", marginTop: 6 }}
                    >
                      {item?.price}đ
                    </Text>
                    <Text style={{ fontWeight: "500", marginTop: 6 }}>
                      {item?.quantity} ratings
                    </Text>
                  </View>
                </Pressable>
    
                <Pressable
                  style={{
                    marginTop: 15,
                    marginBottom: 10,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 10,
                      paddingVertical: 5,
                      borderRadius: 7,
                    }}
                  >
                    {item?.quantity > 1 ? (
                      <Pressable
                        onPress={() => reduceQuantity(item._id)}
                        style={{
                          backgroundColor: "#D8D8D8",
                          padding: 7,
                          borderTopLeftRadius: 6,
                          borderBottomLeftRadius: 6,
                        }}
                      >
                        <AntDesign name="minus" size={24} color="black" />
                      </Pressable>
                    ) : (
                      <Pressable
                        style={{
                          backgroundColor: "#6E7280",
                          padding: 7,
                          borderTopLeftRadius: 6,
                          borderBottomLeftRadius: 6,
                        }}
                      >
                        <AntDesign name="minus" size={24} color="black" />
                      </Pressable>
                    )}
    
                    <Pressable
                      style={{
                        backgroundColor: "white",
                        paddingHorizontal: 18,
                        paddingVertical: 6,
                      }}
                    >
                      <Text>{item?.quantity}</Text>
                    </Pressable>
    
                    <Pressable
                      onPress={() => increaseQuantity(item._id)}
                      style={{
                        backgroundColor: "#D8D8D8",
                        padding: 7,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                    >
                      <Feather name="plus" size={24} color="black" />
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => handleProductDelete(item._id)}
                    style={{
                      backgroundColor: "white",
                      paddingHorizontal: 8,
                      paddingVertical: 10,
                      borderRadius: 5,
                      borderColor: "#C0C0C0",
                      borderWidth: 0.6,
                    }}
                  >
                    <Text>Xóa</Text>
                  </Pressable>
                </Pressable>
    
                <Pressable
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 15,
                  }}
                >
                </Pressable>
              </View>
            ))}
          </View>
          <Text
            style={{
              height: 1,
              borderColor: "#D0D0D0",
              borderWidth: 1,
              marginTop: 16,
            }}
          />
          
        </ScrollView>
        <View style={{ height:height/12, flexDirection:'row', padding: 10,}}> 
            <View style={{ padding: 10, flexDirection: "row", alignItems: "center" , 
              }}>
              <Text style={{ fontSize: 18, fontWeight: "300" }}>Tổng cộng : {total}đ</Text>
            </View>
          <Pressable
            // onPress={() => navigation.navigate("Confirm")}
            style={{
              backgroundColor: "#FFC72C",
              padding: 10,
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Mua tất cả</Text>
          </Pressable>
        </View> 
      </>  
  )};
  
  export default CartScreen;
  
  const styles = StyleSheet.create({});
