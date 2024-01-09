
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
  import { collection, doc, query, onSnapshot, getDocs  } from 'firebase/firestore';
  import { db } from "../firebase";
  import { useUser } from '../UserContext';

const ShippingUnitScreen = ({navigation}) => {
  const { updateShippingUnit } = useUser()
    const { height, width } = Dimensions.get("window");
    const [ShippingUnit, setShippingUnit] = useState([])
    useEffect (() => {
        const getShippingUnit = async () => {
            try {
              const snapshot = await getDocs(collection(db, 'shippingUnit'));
              const shippingUnitData = []
              snapshot.forEach(doc => {
                shippingUnitData.push({
                  id: doc.id,
                  data: {...doc.data(), checked: false}
                  
                })
              })
              console.log("data", shippingUnitData)
              setShippingUnit(shippingUnitData)
            } catch (error) {
              console.error("Error fetching user data:", error);
            }
        }
        getShippingUnit()
    },[])

    const handleCheckboxChange = (ShippingUnit) => {
      setShippingUnit((prevData) => 
          prevData.map((item) =>
            item.id === ShippingUnit.id ? { ...item, data: { ...item.data, checked: true } } : { ...item, data: { ...item.data, checked: false } }
          )
        );
        updateShippingUnit(ShippingUnit)
        navigation.navigate('Order');
    };
  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
      {ShippingUnit?.map((item, index) =>
        <Pressable
          key={item.id}
          style={{
            borderWidth: 1,
            borderColor: "#D0D0D0",
            padding: 10,
            gap: 5,
            marginVertical: 5,
            flexDirection: "row",
            justifyContent:'space-between'
          }}
          onPress={() => {
            handleCheckboxChange(item)
          }}
        >
          <CheckBox
            center
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={item.data.checked}
            checkedColor="#f95122"
          />
          <View style={{ width:width*0.7}}>
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {item.data.name} 
            </Text>
            <Text style={{ fontSize: 12, color: "#181818" }}>
              thời gian vận chuyển: {item.data.deliveryTime}
            </Text>
            <Text style={{ color: "#f95122" }}>Giá: {item.data.price}</Text>
          </View>
        </Pressable>
      )}
      </ScrollView>
    </>
  )
}

export default ShippingUnitScreen

const styles = StyleSheet.create({})