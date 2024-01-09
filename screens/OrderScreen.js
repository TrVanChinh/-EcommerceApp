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
import { Feather, AntDesign, Entypo } from "@expo/vector-icons";
import { useUser } from "../UserContext";
import { useFocusEffect } from '@react-navigation/native';
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
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const OrderScreen = ({ navigation, route }) => {
  const { user, product, address, shippingUnit } = useUser();
  const idUser = user.user.uid 
  const [transportationCost, setTransportationCost] = useState(0)
  const [totalBill, setTotalBill] = useState(0);  
  const { height, width } = Dimensions.get("window");
  const [listProducts, setListProducts] = useState([])

  const handleDataProduct = () => {
    const groupedProducts = {};
    product.forEach((product) => {
      const idShop = product.product.data.idShop;
      if (!groupedProducts[idShop]) {
        groupedProducts[idShop] = { products: [], totalByShop: 0, idShop: idShop};
      }
      groupedProducts[idShop].products.push(product);
    });

    const updatedListProducts = Object.values(groupedProducts).map((group) => {
      const { products, idShop } = group;
      let total = 0;

      // Tính tổng giá trị của sản phẩm trong nhóm
      products.forEach(item => {
        total += item.quantity * item.data.price;
      });

      // Thêm trường totalByShop vào mỗi phần tử trong nhóm sản phẩm
      const updatedProducts = products.map(item => ({ ...item }));
      updatedProducts.forEach(item => delete item.totalByShop);
      
      return {
        products: updatedProducts,
        totalByShop: total,
        idShop: idShop
      }; 
    });
    setListProducts(updatedListProducts);
    // console.log(updatedListProducts)
    updatedListProducts.forEach(group => {
      group.products.forEach(item => {
        console.log(item.product.id)
      });
    });

    //Tính tổng hóa đơn
    let total = 0;
    if (shippingUnit) {
      updatedListProducts.forEach(group => {
        total += group.totalByShop + shippingUnit.data.price
      });
    } else {
      updatedListProducts.forEach(group => {
        total += group.totalByShop
      });
    }
    
    setTotalBill(total)
  }

//Tính tổng tiền chưa có phí vận chuyển
  // const calculateTotal = () => {
  //   let total = 0;
  //   product.forEach(item => {
  //       total += item.quantity * item.data.price;
  //   });
  //   setTotalBill(total + transportationCost)
  // };
  useFocusEffect(
    React.useCallback(() => {
      console.log('Trang Order đã được tập trung');
      if(shippingUnit) {
        console.log("Ship bow", shippingUnit.data.price)
        setTransportationCost(shippingUnit.data.price)
      }else {
        setTransportationCost(0)
      } 
      handleDataProduct()
    }, [product,shippingUnit])
  );

  const SaveOrder = async (shipPrice) => {
    if (!address) {
      alert("Vui lòng chọn địa chỉ nhận hàng!")
    } else if(!shippingUnit) {
      alert("Vui lòng chọn đơn vị vận chuyển!")
    }else{
        try {
          // Tạo reference đến collection 'order' trong Firestore
          const ordersRef = db.collection('order');
          const productsToDelete = []
          // Duyệt qua từng nhóm sản phẩm trong tập dữ liệu
          for (const group of listProducts) {
            // Tạo một document mới cho mỗi nhóm sản phẩm
            const orderDocRef = await ordersRef.add({
              totalByShop: group.totalByShop + shipPrice,
              idUser: idUser, 
              idAddress: address.id,
              idShop: group.idShop,
              idShippingUnit: shippingUnit.id,
              status:"đang chờ xử lý",
              atCreate: serverTimestamp(),
            });
      
            // Tạo subcollection 'option' cho mỗi document order
            const optionsRef = orderDocRef.collection('option');
            // Duyệt qua từng sản phẩm trong nhóm
            for (const product of group.products) {
              // Thêm thông tin sản phẩm vào subcollection 'option'
              console.log("Giáaaaa",product)
              await optionsRef.add({
                idOption: product.id,
                idProduct: product.product.id,
                quantity: product.quantity,
                price: product.data.price,
              });

              productsToDelete.push({ option: product.id });
            }
          }
          
          console.log('Dữ liệu đã được lưu vào Firestore thành công');
          deleteProductsFromCart(idUser,productsToDelete)
          alert('Đặt hàng thành công')
          navigation.navigate("Main")
        } catch (error) {
          console.error('Lỗi khi lưu dữ liệu vào Firestore', error);
        }
    }

  };

  const deleteProductsFromCart = async(userId, productsToDelete) => {
    try {
      const userRef = db.collection('user').doc(userId);
      const cartRef = userRef.collection('cart');
  
      for (const product of productsToDelete) {
        // Xóa sản phẩm từ subcollection 'cart'
        await cartRef.doc(product.option).delete();
      }
      console.log('Xóa sản phẩm thành công!');
    } catch (error) {
      console.error('Lỗi khi xóa sản phẩm:', error);
    }
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        <View>
        {address ? (
          <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#D0D0D0",
            padding: 10,
            flexDirection: "column",
            gap: 5,
            // marginVertical: 10,
          }}
          onPress={()=> navigation.navigate("Address")}
        >
          <View style={{ flexDirection: "row" }}>
              <Entypo name="location-pin" size={24} color="red" />
              <View>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  Địa chỉ đặt hàng
                </Text>
                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                  {address.name} | {address.phoneNumber}
                </Text>
                <Text style={{ fontSize: 15, color: "#181818" }}>
                  {address.street}
                </Text>

                <Text style={{ fontSize: 15, color: "#181818" }}>
                  {address.Ward}, {address.District}, {address.Provinces}
                </Text>
              </View>
            </View>
        </Pressable>
        ) : (
          <Pressable
            style={{
              borderWidth: 1,
              borderColor: "#D0D0D0",
              padding: 10,
              flexDirection: "column",
              gap: 5,
              marginVertical: 10,
            }}
            onPress={()=> navigation.navigate("Address")}
          >
            <View style={{ flexDirection: "row" }}>
            <Entypo name="location-pin" size={24} color="red" />
            <View>
              <Text style={{ fontSize: 15, color: "#181818" }}>
                Chọn địa chỉ nhận hàng
              </Text>
            </View>
          </View>
          </Pressable>
        )}

        {shippingUnit ? (
          <Pressable
          style={{
            borderWidth: 1,
            borderColor: "#D0D0D0",
            padding: 10,
            gap: 5,
            marginVertical: 5,
            flexDirection: "row",
            justifyContent:'center',
            alignItems:'center',
          }}
          onPress={() => navigation.navigate("ShippingUnit")}
        >
          <View style={{ width:width*0.7}}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {shippingUnit.data.name} 
            </Text>
            <Text style={{ fontSize: 15, color: "#181818" }}>
              Thời gian vận chuyển: {shippingUnit.data.deliveryTime} ngày
            </Text>
          </View>
          <View>
            <Text style={{ color: "red" }}>Giá: {shippingUnit.data.price}đ</Text>
          </View>
        </Pressable>
        ) : (
          <Pressable
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#D0D0D0",
              justifyContent: "space-between",
              marginBottom:10,
            }}
            onPress={() => navigation.navigate("ShippingUnit")}
          >
            <Text>Chọn đơn vị vận chuyển:</Text>
            <AntDesign name="right" size={24} color="#D0D0D0" />
          </Pressable>
        ) }
          
        </View >
        {listProducts?.map((group, index) => 
        <View style={{ borderTopWidth: 2, borderColor:'green' }} key={index}>
          <View style={{ marginHorizontal: 10 }}>
            {group.products?.map((item, index) =>
            // setTotalByShop(item.totalByShop),
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
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    paddingRight: 10,
                  }}
                >
                  <Image
                    style={{ width: 100, height: 120, resizeMode: "contain" }}
                    source={{uri: item?.data.image}}
                  />
                </View>

                <View>
                  <Text
                    numberOfLines={3}
                    style={{ width: width / 1.6, fontSize: 16, marginTop: 10 }}
                  >
                    {item?.product.data.name} | {item?.data.name}
                  </Text>
                  <Text
                    style={{
                      color: "red",
                      fontSize: 15,
                      fontWeight: "bold",
                      marginTop: 6,
                    }}
                  >
                  {item?.data.price} đ 
                  </Text>
                  <Text>X{item.quantity}</Text>
                </View>
              </View>
            </View>
            )} 
          </View>
        
          {/* <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: "#D0D0D0",
            }}
          >
            <Text>Tin nhắn:</Text>
            <TextInput
              onChangeText={(text) => {
                setMessage(text);
              }}
              style={{
                height: 35,
                flex: 1,
                paddingStart: 20,
              }}
              autoCorrect={false}
              placeholder="Lưu ý cho người bán..."
            />
          </View> */}

          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: "#D0D0D0",
              justifyContent: "space-between",
            }}
          >
            <Text>Voucher vận chuyển:</Text>
            <Pressable 
                  style={{
                      flexDirection: "row",
                  }}>
                  <Text style={{ color:'green', borderColor:'green', borderWidth:1, padding:2}}>Miễn phí vận chuyển</Text>
                  <AntDesign name="right" size={24} color="#D0D0D0" />
              </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: "#D0D0D0",
              justifyContent: "space-between",
            }}
          >
              <Text>Voucher của Shop:</Text>
              <Pressable 
                  style={{
                      flexDirection: "row",
                      
                  }}>
                  <Text style={{ color:'red', borderColor:'red', borderWidth:1, padding:2}}>Giảm giá sản phẩm</Text>
                  <AntDesign name="right" size={24} color="#D0D0D0" />
              </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: "#D0D0D0",
              justifyContent: "space-between",
            }}
          >
              <Text>Phương thức thanh toán:</Text>
              <Pressable 
                  style={{
                      flexDirection: "row",
                  }}>
                  <Text >Thanh toán khi nhân hàng</Text>
                  <AntDesign name="right" size={24} color="#D0D0D0" />
              </Pressable>
          </View>

          <View
            style={{
              flexDirection: "row",
              padding: 10,
              alignItems: "center",
              borderTopWidth: 1,
              borderColor: "#D0D0D0",
              justifyContent: "space-between",
            }}
          >
              <View style={{ padding: 10}}>
                  <Text>Tổng tiền hàng:</Text>
                  <Text>Giảm giá tiền hàng:</Text>
                  <Text>Tổng tiền phí vận chuyển:</Text>
                  <Text>Giảm giá phí vận chuyển:</Text>
                  <Text style={{ fontSize:18, color:'red'}}>Tổng thanh toán:</Text>
              </View>
              <View style={{ padding: 10}}>
                  <Text style={{textAlign: 'right'}}>{group.totalByShop} đ</Text>
                  <Text style={{textAlign: 'right'}}>0 đ</Text>
                  <Text style={{textAlign: 'right'}}>{transportationCost} đ</Text>
                  <Text style={{textAlign: 'right'}}>- 0 đ</Text>
                  <Text  style={{ fontSize:18, color:'red',textAlign: 'right'}}>{group.totalByShop + transportationCost} đ</Text>
              </View>
          </View>
        </View>
        )} 
      </ScrollView>

      <View
        style={{
          height: height / 12,
          flexDirection: "row",
          padding: 5,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            paddingLeft: 30,
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <Text style={{ fontSize: 15, fontWeight: "300" }}>Tổng cộng :</Text>
          <Text
            style={{
              fontSize: 17,
              paddingLeft: 10,
              color: "red",
              fontWeight: "300",
            }}
          >
            {totalBill} đ
          </Text>
        </View>
        <Pressable
          onPress={() => SaveOrder(transportationCost)}
          style={{
            backgroundColor: "red",
            padding: 10,
            marginLeft: 10,
            borderRadius: 5,
            justifyContent: "center",
            alignItems: "center",
            width: 100,
          }}
        >
          <Text style={{ color: "white" }}>Đặt hàng</Text>
        </Pressable>
      </View>
    </>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({});
