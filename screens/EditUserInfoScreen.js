import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";
import { app } from "../firebaseConfig";
import { Button } from "react-native-elements";
import color from "../components/color";

const EditUserInfoScreen = ({ navigation, route }) => {
  const { idUser: idUser } = route.params;
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const db = getFirestore(app);

  useEffect(() => {
    getUser();
  }, []);

  // Update state inside the useEffect when data is fetched
  useEffect(() => {
    if (user) {
      setName(user.name);
      setAddress(user.address);
      setEmail(user.email);
      setPhoneNumber(user.phone);
    }
  }, [user]);

  const getUser = async () => {
    try {
      const docRef = doc(db, "user", idUser);
      const docSnap = await getDoc(docRef);
      console.log(docSnap.id);

      // Set state only when data is available
      setUser(docSnap.data());
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };
  const updateUser = async () => {
    try {
      const docRef = doc(db, "user", idUser);
      await updateDoc(docRef, {
        name: name,
        address: address,
      });
    //   const updatedDocSnap = await getDoc(docRef);
    } catch (e) {console.log(e)}
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flex: 8 }}>
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Tên tài khoản</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput style={styles.input} onChangeText={setName} value={name} />
        </View>
        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Địa chỉ</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <TextInput
            style={styles.input}
            onChangeText={setAddress}
            value={address}
          />
        </View>

        {/* <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Email</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <Text style={styles.input}>{email}</Text>
        </View>

        <View style={styles.list_items}>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ marginLeft: 10, fontSize: 16 }}>Số điện thoại</Text>
            <Text style={{ color: "red" }}>*</Text>
          </View>
          <Text style={styles.input}>{phoneNumber}</Text>
        </View> */}
      </View>

      <View style={{}}>
        <Button title="Lưu" color={color.origin} onPress={updateUser}/>
      </View>
    </View>
  );
};

export default EditUserInfoScreen;

const styles = StyleSheet.create({
  list_items: {
    marginVertical: 1,
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  input: {
    marginLeft: 12,
  },
});
