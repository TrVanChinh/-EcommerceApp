import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";

import { doc, setDoc, addDoc, collection, getDocs, getFirestore } from "firebase/firestore";

const CategoryScreen = ({ route, navigation }) => {
  const { categories: categories } = route.params;
  const [subcategories, setSubcategory]=useState([])

  const db = getFirestore();
  useEffect(() => {
    // console.log(subcategories);
    if (subcategories.length > 0) {
      navigation.navigate("SelectSubcategory", { subcategories: subcategories });
    }
  }, [subcategories, navigation]);

  const getSubcategory = async (idcatergory) => {
    const list = [];
    const docSnap = await getDocs(collection(db, "category",idcatergory,"subcategory"))
    docSnap.forEach((doc) => {
      idSubcate = doc.id;
      nameSubcate = doc.data().name;
      const cateOject = {
        idSubcate,
        nameSubcate,
      };
      list.push(cateOject)
      // console.log(doc.id, " => ", doc.data());
    });
    
    // setSubcategory((preCate)=>[...preCate,...list])
    setSubcategory(list)
    // setSubcategory(list)
    // console.log(subcategories)
    // navigation.navigate("SelectSubcategory",{ subcategories: subcategories })
  };
  return (
    <View>
      <FlatList
        data={categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => getSubcategory(item.idCate)
              // navigation.navigate("SelectSubcategory")
            }
            style={[styles.list_items, { marginVertical: 5 }]}
          >
            <View
              style={{
                alignItems: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Image
                style={styles.imgCategory}
                source={{
                  uri: item.photo,
                }}
              />
              <Text style={{ marginLeft: 10 }}>{item.nameCate}</Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  list_items: {
    backgroundColor: "white",
    marginBottom: 5,
    padding: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imgCategory: {
    width: 70,
    height: 70,
  },
});
