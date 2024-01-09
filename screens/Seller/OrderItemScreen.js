import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Image } from "react-native-elements";

const OrderItemScreen = ({ route }) => {
  const { idOrder: idOrder } = route.params;
  const [orderItems, setOrderItems] = useState([]);

  useEffect(() => {
    getOrderDetail();
  }, []);

  const getProductInfo = async (id) => {    
    const docRef = doc(db, "product", id);
    const docSnap = await getDoc(docRef);
    return (docSnap.data());
  }
  const getOptionProduct = async (idPrd,idOption) => {    
    const docRef = doc(db, "product", idPrd, "option",idOption);
    const docSnap = await getDoc(docRef);
    return (docSnap.data());
  }

  const getOrderDetail = async () => {
    const orderItems = await getDocs(
      collection(db, "order", idOrder, "option")
    );
    const items = [];
    for (const item of orderItems.docs) {
      const prdInfo =  await getProductInfo(item.data().idProduct);
      const optionInfo = await getOptionProduct(item.data().idProduct,item.data().idOption);
      items.push({
        image: optionInfo.image,
        idProduct: prdInfo.name,
        idOptionPruct: optionInfo.name,
        price: item.data().price,
        quantity: item.data().quantity,
      });
    }
    setOrderItems(items);
  };

  return (
    <View>
      {orderItems.map((item,index) => (
        <View key={index} style={styles.orderItems}>
            <Image source={{ uri: item.image }} style={{ width: 50, height: 50 }} />
            <View style={{flex:1}}>
            <Text style={styles.prdName}>{item.idProduct}</Text>
            <Text style={styles.prdOption}>Loại: {item.idOptionPruct}</Text>
            <Text style={styles.prdQty}>Số lượng: {item.quantity}</Text>
            <Text style={styles.prdPrice}>Giá: {item.price}</Text>

            </View>
        </View>
      ))}
    </View>
  );
};

export default OrderItemScreen;

const styles = StyleSheet.create({
    orderItems: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
        // padding: 20,
        marginVertical: 8,
        backgroundColor: "white",
    },
    prdName: {
        // width: "40%",
        fontWeight: "bold",
    },
    prdOption: {
        // width: "20%",
    },
    prdPrice: {
        // width: "20%",
        color: "red",
        alignSelf: "flex-end",
    },
    prdQty: {
        // width: "20%",
    },
});
