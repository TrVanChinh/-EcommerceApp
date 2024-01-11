import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { Image } from "react-native-elements";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

const OrderItemScreen = ({ navigation, route }) => {
  const { idOrder: idOrder } = route.params;
  const [order, setOrder] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    setLoading(true);
    await getOrder();
    await getOrderDetail();
    setLoading(false);
  };
  const getOrder = async () => {
    const docRef = doc(db, "order", idOrder);
    const docSnap = await getDoc(docRef);
    const orders = [];
    const buyer = await getBuyerInfo(docSnap.data().idUser);
    const address = await getAdress(
      docSnap.data().idUser,
      docSnap.data().idAddress
    );
    const shippingUnit = await getShippingUnit(docSnap.data().idShippingUnit);
    orders.push({
      id: docSnap.id,
      buyerName: buyer.name,
      atCreate: convertDate(docSnap.data().atCreate),
      image: buyer.photo,
      idUser: docSnap.data().idUser,
      status: docSnap.data().status,
      totalByShop: formatPrice(docSnap.data().totalByShop),
      receiver: address.name,
      phoneNum: address.phoneNumber,
      shippingUnit: shippingUnit.name,
      shipCost: formatPrice(shippingUnit.price),
      deliveryTime: shippingUnit.deliveryTime,
      address:
        address.street +
        ", " +
        address.Ward +
        ", " +
        address.District +
        ", " +
        address.Provinces,
    });
    setOrder(orders[0]);
  };

  const convertDate = (timestamp) => {
    const date = new Date(
      timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000
    );
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year} `;
  };
  const getAdress = async (idBuyer, idAddress) => {
    const q = doc(db, "user", idBuyer, "address", idAddress);
    const addressDoc = await getDoc(q);
    return addressDoc.data();
  };

  const getBuyerInfo = async (id) => {
    const q = doc(db, "user", id);
    const userDoc = await getDoc(q);
    const user = {
      id: userDoc.id,
      name: userDoc.data().name,
      photo: userDoc.data().photo,
    };
    return user;
  };

  const getProductInfo = async (id) => {
    const docRef = doc(db, "product", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };
  const getOptionProduct = async (idPrd, idOption) => {
    const docRef = doc(db, "product", idPrd, "option", idOption);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };
  const getShippingUnit = async (id) => {
    const docRef = doc(db, "shippingUnit", id);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };

  const getOrderDetail = async () => {
    const orderItems = await getDocs(
      collection(db, "order", idOrder, "option")
    );
    const items = [];
    for (const item of orderItems.docs) {
      const prdInfo = await getProductInfo(item.data().idProduct);
      const optionInfo = await getOptionProduct(
        item.data().idProduct,
        item.data().idOption
      );
      items.push({
        image: optionInfo.image,
        idProduct: prdInfo.name,
        idOptionPruct: optionInfo.name,
        price: formatPrice(item.data().price),
        quantity: item.data().quantity,
      });
    }
    setOrderItems(items);
  };

  const confirmOrder = async () => {
    setLoading(true);
    const docRef = doc(db, "order", idOrder);
    await updateDoc(docRef, {
      status: "đang vận chuyển",
    });
    setLoading(false);
    Alert.alert("Thông báo", "Đơn hàng đang được vận chuyển", [
      {
        text: "OK",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };

  const deliveredOrder = async () => {
    setLoading(true);
    const docRef = doc(db, "order", idOrder);
    await updateDoc(docRef, {
      status: "đã giao hàng",
    });
    setLoading(false);
    Alert.alert("Thông báo", "Đơn hàng đã giao", [
      {
        text: "OK",
        onPress: () => {
          navigation.goBack();
        },
      },
    ]);
  };
  
  const formatPrice = (price) => {
    // Sử dụng Intl.NumberFormat để định dạng số thành chuỗi với dấu ngăn cách hàng nghìn
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ padding: 10 }}>
        <Text style={{ fontWeight: "bold" }}>
          Trạng thái đơn hàng: {order.status}
        </Text>
        <Text style={{ fontWeight: "bold" }}>Mã đơn hàng:{order.id}</Text>
        <Text style={{ fontWeight: "bold" }}>
          Người đặt hàng:{order.buyerName}
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          Ngày đặt hàng:{order.atCreate}
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          Người nhận hàng:{order.receiver}
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          Số điện thoại:{order.phoneNum}
        </Text>
        <Text style={{ fontWeight: "bold" }}>
          Địa chỉ nhận hàng:{order.address}
        </Text>
      </View>
      <Text style={{ fontWeight: "bold" }}>Thông tin sản phẩm</Text>
      {orderItems.map((item, index) => (
        <TouchableOpacity key={index} style={styles.orderItems}>
          <Image
            source={{ uri: item.image }}
            style={{ width: 50, height: 50 }}
          />
          <View style={{ flex: 1 }}>
            <Text style={styles.prdName}>{item.idProduct}</Text>
            <Text style={styles.prdOption}>Loại: {item.idOptionPruct}</Text>
            <Text style={styles.prdQty}>Số lượng: {item.quantity}</Text>
            <Text style={styles.prdPrice}>Giá: {item.price}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Text style={{ fontWeight: "bold" }}>Thông tin vận chuyển</Text>
      <Text style={{ fontWeight: "bold" }}>
        Đơn vị vận chuyển: {order.shippingUnit}
      </Text>
      <Text style={{ fontWeight: "bold" }}>
        Phí vận chuyển: {order.shipCost}
      </Text>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          position: "absolute",
          backgroundColor: "white",
          padding: 10,
          bottom: 0,
          justifyContent: "space-between",
          width: "100%",
          // alignSelf: "flex-end",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            alignSelf: "center",
            color: "red",
            fontSize: 20,
            flex: 2,
          }}
        >
          Tổng tiền: {order.totalByShop}
        </Text>
        {order.status !== "đã giao hàng" && (
          <TouchableOpacity
            style={{
              backgroundColor: "red",
              padding: 10,
              alignSelf: "flex-end",
              alignItems: "center",
              flex: 1,
            }}
            onPress={() => order.status==="đang xử lý"?confirmOrder():deliveredOrder()}
          >
            <Text
              style={{
                color: "white",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Xác nhận
            </Text>
          </TouchableOpacity>
        )         
        }
      </View>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default OrderItemScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
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
