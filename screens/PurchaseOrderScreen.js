
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
    TextInput,
    Image,
    Dimensions,
    FlatList,
  } from "react-native";
  import { CheckBox, Icon } from "react-native-elements";
  import color from "../components/color";
  import React, {
    useEffect,
    useState,
    useLayoutEffect,
    useContext,
    useCallback,
  } from "react";
  import { useFocusEffect } from "@react-navigation/native";
  import { Feather, AntDesign } from "@expo/vector-icons";  
  import { collection, doc, query, where, onSnapshot, getDocs, getDoc , and } from 'firebase/firestore';
  import { db } from "../firebase";
  import { useUser } from '../UserContext';

  const PurchaseOrderScreen = ({ navigation, route}) => {
    const { user } = useUser();
    const idUser = user?.user?.uid;
    const { height, width } = Dimensions.get("window");
    const [menu, setMenu] = useState('Chờ xác nhận');
    const [order, setOrder] = useState([])

    const handlePress = (menuValue) => {
        setMenu(menuValue);
    };

    // Lấy dữ liệu collection order
    const getOrderData = async (idUser) => {
      try {
        const q = query(
          collection(db, 'order'),
          where('idUser', '==', idUser),
          where('status', '==', 'đang chờ xử lý'))
        const querySnapshot = await getDocs(q);
        const orderPromises = [];

          for (const orderDoc of querySnapshot.docs) {
            const ordersId = orderDoc.id;
            const orderData = orderDoc.data();
            const optionSnapshot = await getDocs(collection(doc(db, 'order', ordersId), 'option'));
            const optionPromises = [];

            optionSnapshot.forEach(async (doc) => {
                const optionData = doc.data()
                const idOption = optionData.idOption
                const idProduct = optionData.idProduct
                const quantity = optionData.quantity
                const price = optionData.price
                const promise = fetchOptionData(idProduct,idOption, quantity, price)
                // console.log("kết quả", productOptionData.data.option.id)
                if (promise !== undefined) {
                  optionPromises.push(promise);
                } else {
                  console.error(`fetchOptionData returned undefined for idProduct: ${idProduct}, idOption: ${idOption}`);
                }
              })
              const optionDataArray = await Promise.all(optionPromises);
              const option = optionDataArray.map(productOptionData => ({
                data: productOptionData
              }));
              
              orderPromises.push({
                dataInfoOrder: { orderData, option }
              });
          }
          const ordersDataArray = await Promise.all(orderPromises);
          setOrder(ordersDataArray);

          ordersDataArray.forEach(data => {
            // const optionDatas = data.dataInfoOrder.orderData.totalByShop
            // console.log("dataInfoOrder", optionDatas)
            const optionDatas = data.dataInfoOrder.option
              optionDatas.forEach(option => {
                console.log("option:  ", option.data.data.option.quantity) 
              })
            })

          // ordersDataArray.forEach(data => {
          //   const optionDatas = data.dataInfoOrder.option
          //   // console.log("option", optionDatas)
          //   optionDatas.forEach(option => {
          //     console.log("option:  ", option.data.data.option.data.price) 
          //   })
          //   })


          // ordersDataArray.forEach(data => {
          //   const atCreateTimestamp =  data.dataInfoOrder.orderData.atCreate
          //  // Chuyển đổi Timestamp thành Date
          //   const atCreateDate = atCreateTimestamp.toDate();

          //   // Lấy thông tin về ngày, tháng và thời gian
          //   const day = atCreateDate.getDate();
          //   const month = atCreateDate.getMonth() + 1; // Tháng bắt đầu từ 0, cộng thêm 1 để hiển thị theo tháng thực tế
          //   const year = atCreateDate.getFullYear();

          //   const hours = atCreateDate.getHours();
          //   const minutes = atCreateDate.getMinutes();
          //   const seconds = atCreateDate.getSeconds();

          //   // Tạo một chuỗi hiển thị thông tin ngày tháng thời gian
          //   const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
          //   console.log(formattedDate);
          //   // console.log("optionData:  ",atCreateDate)
          //   // console.log("orderData:  ",data.dataInfoOrder.orderData)
          // })
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
        throw error;
      }
    };

    const fetchOptionData = async (idProduct,idOption, quantity, price) => {
      try {
        const productRef = doc(db, 'product', idProduct);
        const productSnapshot = await getDoc(productRef);
        if (productSnapshot.exists()) {

          const optionRef = doc(db, 'product', idProduct, 'option', idOption);
          const optionSnapshot = await getDoc(optionRef);
    
          if (optionSnapshot.exists()) {
            const optionData = {
              id: optionSnapshot.id,
              data: optionSnapshot.data(),
              quantity: quantity,
              price: price
            };
            return {
              id: productSnapshot.id, 
              data: {
                ...productSnapshot.data(),
                option: optionData
              }
          }
            // console.log("option", productData.data.option);
          } else {
            console.log('Không tìm thấy option với idOption là', idOption);
          }
        } else {
          console.log('Không tìm thấy sản phẩm với id là', productId);
        }


      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };

    useEffect (() => {
      getOrderData(idUser)
    },[])

    return (
      <View>
        <View
          style={{
            height: height * 0.06,
            width: width,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Chờ xác nhận' ? "#F1582C" : "white" 
          }}
            onPress={() => handlePress('Chờ xác nhận')}
          
          >
            <Text style={styles.text_order}>Chờ xác nhận</Text>
          </Pressable>
  
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Chờ lấy hàng' ?  "#F1582C" :"white"  
              }}
              onPress={() => handlePress('Chờ lấy hàng')}
          >
            <Text style={styles.text_order}>Chờ lấy hàng</Text>
          </Pressable>
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Chờ giao hàng' ?  "#F1582C" :"white"  
              }}
              onPress={() => handlePress('Chờ giao hàng')}
          >
            <Text style={styles.text_order}>Đang giao</Text>
          </Pressable>
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Đã giao' ?  "#F1582C" :"white"  
              }}
              onPress={() => handlePress('Đã giao')}
          >
            <Text style={styles.text_order}>Đã giao</Text>
          </Pressable>
          <Pressable 
              style={{...styles.buttonArrange,
                  borderColor: menu === 'Đã hủy' ?  "#F1582C" :"white"  
              }}
              onPress={() => handlePress('Đã hủy')}
          >
            <Text style={styles.text_order}>Đã hủy</Text>
          </Pressable>
        </View>
        <ScrollView> 
          <View style={{ marginHorizontal: 10 }}>
          {order?.map((option, index) =>
              <View
                key={index}
                style={{
                  backgroundColor: "white",
                  marginBottom: 10,
                  borderBottomColor: "#F0F0F0",
                  borderWidth: 2,
                  borderLeftWidth: 0,
                  borderTopWidth: 0,
                  borderRightWidth: 0,
                }}
              >
              {option?.dataInfoOrder.option.map((item, index) => 
              <View key={index}>
                <Pressable
                  style={{
                    flexDirection: "row",
                  }}
                  // onPress={() =>  navigation.navigate('Detail', {product: item.product})}
                >
                  <View style={{
                    paddingRight: 10,
                  }}>
                    <Image
                      style={{ width: 100, height: 120, resizeMode: "contain",  }}
                      source={{uri: item?.data.data.option.data.image}}
                    />
                  </View>
    
                  <View>
                    <Text numberOfLines={3} style={{ width: 200, fontSize:16, marginTop: 10 }}>
                    {item?.data.data.name}
                    </Text>
                    <Text numberOfLines={3} style={{ width: 200, fontSize:16, marginTop: 10 }}>
                      {item?.data.data.option.data.name}
                    </Text>
                    <Text
                      style={{fontSize: 15, fontWeight: "bold", marginTop: 6 }}
                    >
                      Giá: {item?.data.data.option.price}đ 
                    </Text>
                    <Text
                      style={{fontSize: 15, fontWeight: "bold", marginTop: 6 }}
                    >
                      Số lượng: {item?.data.data.option.quantity}
                    </Text>
                  
                  </View>
                </Pressable>
              </View>
              )} 
              <Text
                style={{ color:'red',fontSize: 15, alignSelf:"center",fontWeight: "bold", padding: 6 }}
              >
                Tổng đơn hàng: {option.dataInfoOrder.orderData.totalByShop}đ 
              </Text>
            </View>
          )}
          </View>
        </ScrollView>
      </View>
    );
  };
  
  export default PurchaseOrderScreen;
  
  const styles = StyleSheet.create({
    buttonArrange: {
      flexDirection: "row",
      flex: 1,
      borderColor:'white',
      borderBottomWidth:2,
      alignItems: "center",
      justifyContent: "center",
      height: 40,
    },
    text_order : {
        fontSize:12,
        alignSelf:'center'
      },
  });
  