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
import React, { useEffect, useState, useLayoutEffect, useContext, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { Feather,AntDesign } from "@expo/vector-icons";
import { useUser } from '../UserContext';
import {
  collection,
  doc,
  query,
  onSnapshot,
  getDoc,
  where,
  runTransaction ,
  getDocs,
  deleteDoc ,
} from "firebase/firestore";
import { db } from "../firebase";
const CartScreen = ({navigation}) => {
  const { user, updateProduct, updateAddress, updateShippingUnit } = useUser();
  const idUser = user.user.uid
  const[cart,setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [selectAll, setSelectAll] = useState(false);
  const { height, width } = Dimensions.get("window");
   
  // useEffect(() => {
  //   const GetCart = async () => {
  //     try {
  //       const cartRef = collection(db, 'user', idUser, 'cart'); 
  //       const cartSnapshot = await getDocs(cartRef);
  //       const optionProductsData = [];
  //       for (const doc of cartSnapshot.docs) {
  //         const productId = doc.data().productId;
  //         const optionProductId = doc.data().optionProductId;
  //         const quantity = doc.data().quantity;
         
  //         // Retrieve optionProduct details
  //         const productRef = collection(db, 'product', productId, 'option');
  //         const optionProductSnapshot = await getDocs(productRef);
  //         optionProductSnapshot.forEach(optionSnapshot => {
  //           if (optionSnapshot.id === optionProductId) {
  //             optionProductsData.push({
  //             id: optionSnapshot.id,
  //             data: optionSnapshot.data(),
  //             quantity: quantity,
  //           });
  //         }
  //       });
  //       };
  //       setCart(optionProductsData)
  //       console.log(optionProductsData)
  //     } catch (error) {
  //       console.error("Lỗi khi lấy dữ giỏ hàng:", error);
  //     }
  //   };
  //   GetCart();
  // }, [idUser]);

  const GetCart = async () => {
    try {
      const cartRef = collection(db, 'user', idUser, 'cart'); 
      const cartSnapshot = await getDocs(cartRef);
      const optionProductsData = [];
      // Sử dụng Promise.all để đợi tất cả các promise hoàn thành
      await Promise.all(cartSnapshot.docs.map(async (doc) => {
        const productId = doc.data().productId;
        const optionProductId = doc.data().optionProductId;
        const quantity = doc.data().quantity;
        
        const productInfo =  await getProductById(db,productId)
        const OptionproductRef = collection(db, 'product', productId, 'option');
        const optionProductSnapshot = await getDocs(OptionproductRef);
        optionProductSnapshot.forEach(optionSnapshot => {
          if (optionSnapshot.id === optionProductId) {
              optionProductsData.push({
              product: productInfo,
              id: optionSnapshot.id,
              data: optionSnapshot.data(),
              quantity: quantity,
              checked: false,
            });
          }
        });
      
      }));
      setCart(optionProductsData)
    } catch (error) {
      console.error("Lỗi khi lấy dữ giỏ hàng:", error);
    }
  };
  useEffect(() => {
    GetCart();
  }, [idUser]);
  
  useFocusEffect(
    React.useCallback(() => {
      console.log('Trang Cart đã được tập trung');
      GetCart()
    }, [])
  );
  // lấy thông tin sản phẩm
  const getProductById = async (db, productId) => {
    try {
      const productRef = doc(db, 'product', productId);
      const productSnapshot = await getDoc(productRef);
  
      if (productSnapshot.exists()) {
        const productData = productSnapshot.data();
        return {
          id: productSnapshot.id,
          data: productData,
        };
      } else {
        console.log('Không tìm thấy sản phẩm với id là', productId);
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin sản phẩm:", error);
    }
  };

  
  const increaseQuantity = async (userId, optionProductId) => {
    const userRef = doc(db, 'user', userId);
    const cartRef = collection(userRef, 'cart');
    
    try {
      await runTransaction(db, async (transaction) => {
        const q = query(cartRef, where('optionProductId', '==', optionProductId));
        const cartSnapshot = await getDocs(q);

        if (!cartSnapshot.empty) {
          const productDoc = cartSnapshot.docs[0]; 
          const currentQuantity = productDoc.data().quantity;
            transaction.update(productDoc.ref, {
              quantity: currentQuantity + 1,
              
            });
          setCart((prevCart) => {
          const updatedCart = prevCart.map(item => {
            if (item.id === optionProductId) {
              return {
                ...item,
                quantity: currentQuantity + 1,
              };
            }
            return item;
          });
          return updatedCart;
        });
        } else {
          throw 'Không tìm thấy sản phẩm có tên là Xeeproduct trong giỏ hàng.';
        }
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
    }
  };

  const reduceQuantity = async (userId, optionProductId) => {
    const userRef = doc(db, 'user', userId);
    const cartRef = collection(userRef, 'cart');
    
    try {
      await runTransaction(db, async (transaction) => {
        const q = query(cartRef, where('optionProductId', '==', optionProductId));
        const cartSnapshot = await getDocs(q);

        if (!cartSnapshot.empty) {
          const productDoc = cartSnapshot.docs[0]; 
          const currentQuantity = productDoc.data().quantity;
          if (currentQuantity >= 2) {
            transaction.update(productDoc.ref, {
              quantity: currentQuantity - 1,
            })}

          setCart((prevCart) => {
          const updatedCart = prevCart.map(item => {
            if (item.id === optionProductId) {
              return {
                ...item,
                quantity: currentQuantity - 1,
              };
            }
            return item;
          });
          return updatedCart;
        });
        } else {
          throw 'Không tìm thấy sản phẩm có tên là Xeeproduct trong giỏ hàng.';
        }
      });
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
    }
  };

const removeFromCart = async (userId, optionProductId) => {
  const userRef = doc(db, 'user', userId);
  const cartRef = collection(userRef, 'cart');

  try {
    await runTransaction(db, async (transaction) => {
      const q = query(cartRef, where('optionProductId', '==', optionProductId));
      const cartSnapshot = await getDocs(q);

      if (!cartSnapshot.empty) {
        const productDoc = cartSnapshot.docs[0];
        // Xóa sản phẩm khỏi giỏ hàng
        transaction.delete(productDoc.ref);

        // Cập nhật local state
        setCart((prevCart) => {
          return prevCart.filter(item => item.id !== optionProductId);
        });
      } else {
        throw 'Không tìm thấy sản phẩm có optionProductId là ' + optionProductId + ' trong giỏ hàng.';
      }
    });
  } catch (error) {
    console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
  }
};
useEffect(() => {
  const calculateTotal = () => {
    let total = 0;
    cart.forEach(item => {
      if (item.checked) {
        total += item.quantity * item.data.price;
      }
    });
    setTotal(total);
  };

  calculateTotal();
}, [cart]);

const handleCheckboxChange = (itemId) => {
  setCart((prevData) =>
      prevData.map((item) =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
};

const handleSelectAll = () => {
  const newSelectAll = !selectAll;
  setSelectAll(newSelectAll);
  setCart((prevData) =>
    prevData.map((item) => ({ ...item, checked: newSelectAll }))
  );
};

const handleItemCart = () => {
  console.log("số lần")
  let products = [];
  cart.forEach(item => {
  if (item.checked) {
    products.push(item);
  }
})
  updateProduct(products)
  updateAddress(null)
  updateShippingUnit(null)
  if(products.length === 0) {
    alert("Vui lòng chọn sản phẩm bạn muốn mua")
  } else {
    // navigation.navigate('Order', { products });
    navigation.navigate('Order');

  }  
    
};
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}> 
        <View style={{ marginHorizontal: 10 }}>
        
        {cart?.map((item, index) =>
            <View
              key={item.id}
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
              <View style={{
                  flexDirection: "row",
                }}>
              <CheckBox
                checked={item.checked}
                checkedIcon="check-square"
                checkedColor="black"
                onPress={() => handleCheckboxChange(item.id)}
              />
              <Pressable
                style={{
                  flexDirection: "row",
                }}
                onPress={() =>  navigation.navigate('Detail', {product: item.product})}
              >
                <View style={{
                  paddingRight: 10,
                }}>
                  <Image
                    style={{ width: 100, height: 120, resizeMode: "contain",  }}
                   source={{uri: item?.data.image}}
                  />
                </View>
   
                <View>
                  <Text numberOfLines={3} style={{ width: 200, fontSize:16, marginTop: 10 }}>
                  {item?.product.data.name} - {item?.data.name}
                  </Text>
                  <Text
                    style={{ color:'red',fontSize: 15, fontWeight: "bold", marginTop: 6 }}
                  >
                    {item?.data.price} đ 
                  </Text>
                
                </View>
              </Pressable>
              </View>
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
                  {item.quantity > 1 ? (
                    <Pressable
                      style={{
                        backgroundColor: "#D8D8D8",
                        padding: 7,
                        borderTopLeftRadius: 6,
                        borderBottomLeftRadius: 6,
                      }}
                      onPress={() => reduceQuantity(idUser, item.id)}
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
                    <Text>{item.quantity}</Text>
                  </Pressable>
  
                  <Pressable
                    style={{
                      backgroundColor: "#D8D8D8",
                      padding: 7,
                      borderTopLeftRadius: 6,
                      borderBottomLeftRadius: 6,
                    }}
                    onPress={() => increaseQuantity(idUser, item.id)}
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
                  onPress={() => removeFromCart(idUser, item.id)}
                >
                  <Text>Xóa</Text>
                </Pressable>
              </Pressable>
            </View>
        )}
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
      <View style={{ height:height/12, flexDirection:'row', padding: 5,}}> 
          <CheckBox 
            title="Chọn tất cả" 
            checkedIcon="check-square"
            checkedColor="black"
            checked={selectAll} 
            onPress={handleSelectAll}
            />
          <View style={{ padding: 5, alignItems: "center" , width:120
            }}>
            <Text style={{ fontSize: 15, fontWeight: "300" }}>Tổng cộng :</Text>
            <Text style={{ fontSize: 15, color:'red', fontWeight: "300" }}>{total}đ</Text>
          </View>
        <Pressable
          // onPress={() => navigation.navigate("Confirm")}
          style={{
            backgroundColor: "red",
            padding: 10,
            marginLeft:10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            width: 90,
          }}
          onPress={() => handleItemCart()}
        >
          <Text style={{ color:'white'}}>Mua</Text>
        </Pressable>
      </View> 
    </>  
)};

export default CartScreen;

const styles = StyleSheet.create({});
