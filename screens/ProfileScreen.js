import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  Image,
  Alert,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import color from "../components/color";
import auth from "@react-native-firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  where,
  query,
  getFirestore,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { app } from "../firebase";
import { useUser } from '../UserContext';
import { db } from "../firebase";
import { useIsFocused } from "@react-navigation/native";

const ProfileScreen = ({ navigation }) => {
  const { updateUser, user } = useUser();
  const [isLogin, setLogin] = useState(null);
  const [dataUser, setDataUser] = useState(null);
  const idUser = user?.user?.uid;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      if(user){
        getUser();
      }
    }
  }, [isFocused]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const docRef = doc(db, "user", idUser);
          const docSnap = await getDoc(docRef);
          console.log("dataUser", docSnap.data());
          setDataUser(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [user, idUser]);
  
  const getUser = async () => {
    const docRef = doc(db, "user", idUser);
    const docSnap = await getDoc(docRef);
    setDataUser(docSnap.data());
  };
  const handleLogout = () => {
    updateUser(null);
    setLogin(null);
    setDataUser(null)
    navigation.navigate("Profile");
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
        <View style={styles.upperView}>
          <View style={styles.buttonContainer}>
            {/* nut cai dat */}
            <TouchableOpacity style={styles.button}>
              <Feather name="settings" size={24} color="white" />
            </TouchableOpacity>
            {/* nut gio hang */}
            <TouchableOpacity style={styles.button}>
              <AntDesign name="shoppingcart" size={25} color="white" />
              <View
                style={{
                  position: "absolute",
                  top: 1,
                  right: -3,
                  backgroundColor: color.origin,
                  borderRadius: 10,
                  borderColor: "white",
                  borderWidth: 1,
                  width: 30,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>99+</Text>
              </View>
            </TouchableOpacity>
            {/* nut nhan tin */}
            <TouchableOpacity style={styles.button}>
              <Ionicons
                name="chatbox-ellipses-outline"
                size={24}
                color="white"
              />

              <View
                style={{
                  position: "absolute",
                  top: 1,
                  right: -3,
                  backgroundColor: color.origin,
                  borderRadius: 10,
                  borderColor: "white",
                  borderWidth: 1,
                  width: 30,
                  height: 20,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: "white", fontSize: 12 }}>99+</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {/* Area avt, username */}
            { dataUser ? (
              <>
                <View
                  style={{
                    flexDirection: "row",
                    padding: 15,
                  }}
                >
                  <View
                    style={{
                      borderRadius: 100,
                      backgroundColor: "white",
                    }}
                  >
                    <Image
                      source={{
                        uri: dataUser?.photo || null,
                      }}
                      style={styles.avt_image}
                    />
                  </View>
                  <View
                    style={{ marginLeft: 10, justifyContent: "space-between" }}
                  >
                    <Text
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: 17,
                      }}
                    >
                      {dataUser?.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        backgroundColor: "#d3ddde",
                        paddingHorizontal: 3,
                        borderRadius: 10,
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: "#424852",
                          fontSize: 12,
                          marginLeft: 10,
                        }}
                      >
                        Thành viên bạc
                      </Text> 
                      <SimpleLineIcons
                        marginLeft={15}
                        padding={5}
                        name="arrow-right"
                        size={10}
                        color="#60698a"
                      />
                    </View>
                    <View style={{ flexDirection: "row" }}>
                      <Text style={{ color: "white", fontSize: 14 }}>
                        Người theo dõi
                      </Text>
                      <Text
                        style={{
                          marginLeft: 5,
                          color: "white",
                          fontWeight: "bold",
                          fontSize: 14,
                        }}
                      >
                        2
                      </Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                {/* Area nut dang nhap, dang ki */}
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  {/* btn dang nhap */}
                  <TouchableOpacity
                    style={styles.btn_login}
                    onPress={() => navigation.navigate("Login")}
                  >
                    <Text style={{ color: "white" }}>Đăng nhập</Text>
                  </TouchableOpacity>
                  {/* btn dang ki */}
                  <TouchableOpacity
                    style={styles.btn_login}
                    onPress={() => navigation.navigate("Register")}
                  >
                    <Text style={{ color: "white" }}>Đăng kí</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
        <View style={styles.lowerView}>
        {!dataUser?
          <>
          {/* Dang ki ban hang */}
          <TouchableOpacity
                style={styles.list_items}
                onPress={() =>                    
          Alert.alert("Thông báo", "Vui lòng đăng nhập trước", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Login");
              },
            },
          ])                  
                }
              >
                <View
                  style={{
                    alignItems: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Entypo
                    name="shop"
                    size={25}
                    marginLeft={10}
                    color={color.origin}
                  />
                  <Text style={{ marginLeft: 10 }}> Bắt đầu bán</Text>
                </View>
                <View
                  style={{
                    alignItems: "flex-end",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text> Đăng kí ngay</Text>
                  <SimpleLineIcons
                    marginLeft={15}
                    name="arrow-right"
                    size={10}
                    color="#60698a"
                  />
                </View>
              </TouchableOpacity>
              </>
          :dataUser.status==null?
          //Chuyen sang man hinh dang ky seller
          <>
          
              {/* Dang ki ban hang */}
              <TouchableOpacity
                style={styles.list_items}
                onPress={() =>
                    navigation.navigate("Register Seller", {
                        idUser: idUser,
                      })                    
                }
              >
                <View
                  style={{
                    alignItems: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Entypo
                    name="shop"
                    size={25}
                    marginLeft={10}
                    color={color.origin}
                  />
                  <Text style={{ marginLeft: 10 }}> Bắt đầu bán</Text>
                </View>
                <View
                  style={{
                    alignItems: "flex-end",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text> Đăng kí ngay</Text>
                  <SimpleLineIcons
                    marginLeft={15}
                    name="arrow-right"
                    size={10}
                    color="#60698a"
                  />
                </View>
              </TouchableOpacity>
          </>
          :
            dataUser.status===false?
            //Thông báo chưa duyệt
            <>            
            <TouchableOpacity
                style={styles.list_items}
                onPress={() =>
                    Alert.alert("Đã đăng ký","Yêu cầu đang được phê duyệt")                 
                }
              >
                <View
                  style={{
                    alignItems: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Entypo
                    name="shop"
                    size={25}
                    marginLeft={10}
                    color={color.origin}
                  />
                  <Text style={{ marginLeft: 10 }}> Đã đăng ký bán hàng</Text>
                </View>
                <View
                  style={{
                    alignItems: "flex-end",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text> Đang duyệt</Text>
                  <SimpleLineIcons
                    marginLeft={15}
                    name="arrow-right"
                    size={10}
                    color="#60698a"
                  />
                </View>
              </TouchableOpacity>
            </>
            :
              dataUser.seller?
              //Chuyển sang MyShopScreen
              <>
              
              {/* My shop */}
              <TouchableOpacity
                style={styles.list_items}
                onPress={() => navigation.navigate("MyShop", {idUser: idUser})}
              >
                <View
                  style={{
                    alignItems: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Entypo
                    name="shop"
                    size={25}
                    marginLeft={10}
                    color={color.origin}
                  />
                  <Text style={{ marginLeft: 10 }}> Cửa hàng của tôi </Text>
                </View>
                <View
                  style={{
                    alignItems: "flex-end",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text> Xem </Text>
                  <SimpleLineIcons
                    marginLeft={15}
                    name="arrow-right"
                    size={10}
                    color="#60698a"
                  />
                </View>
              </TouchableOpacity>
              </>
              :
              //Thông báo từ chối và đăng ký lại
              <>              
              <TouchableOpacity
                style={styles.list_items}
                onPress={() => 
                  Alert.alert(
                    'Quản trị viên đã từ chối yêu cầu',
                    'Đăng ký lại?',
                    [
                      { text: 'No', 
                      style: 'cancel' },
                      { text: 'Yes', 
                      onPress: () => {
                        navigation.navigate("Register Seller", {
                          idUser: idUser,
                        })
                      } },
                    ],
                    { cancelable: false }
                  )}
              >
                <View
                  style={{
                    alignItems: "flex-start",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Entypo
                    name="shop"
                    size={25}
                    marginLeft={10}
                    color={color.origin}
                  />
                  <Text style={{ marginLeft: 10 }}> Bắt đầu bán</Text>
                </View>
                <View
                  style={{
                    alignItems: "flex-end",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <Text> Đăng ký ngay </Text>
                  <SimpleLineIcons
                    marginLeft={15}
                    name="arrow-right"
                    size={10}
                    color="#60698a"
                  />
                </View>
              </TouchableOpacity>
              </>
        }
          <TouchableOpacity
            style={styles.list_items}
            onPress={() =>
              dataUser
                ? navigation.navigate("EditUserInfo", {
                    idUser: idUser,
                  })
                : Alert.alert("Thông báo", "Vui lòng đăng nhập trước", [
                    {
                      text: "OK",
                      onPress: () => {
                        navigation.navigate("Login");
                      },
                    },
                  ])
            }
          >
            <View
              style={{
                alignItems: "flex-start",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Feather
                name="user"
                size={25}
                marginLeft={10}
                color={color.origin}
              />
              <Text style={{ marginLeft: 10 }}>Chỉnh sửa thông tin</Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text></Text>
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
          



          {/* Đơn hàng */}
          <TouchableOpacity
            style={styles.list_items}
          >
            <View
              style={{
                alignItems: "flex-start",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 10
              }}
              // onPress={() =>  navigation.navigate("PurchaseOrder")}
            >
              <FontAwesome5 name="receipt" size={24} color={color.origin} />
              
              <Text style={{ marginLeft: 10 }}>Đơn mua</Text>
            </View>
            <View
              style={{
                alignItems: "flex-end",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text></Text>
              <SimpleLineIcons
                marginLeft={15}
                name="arrow-right"
                size={10}
                color="#60698a"
              />
            </View>
          </TouchableOpacity>
            <View style={{ flex:1, flexDirection:"row", padding:12, backgroundColor:'white'}}> 
              <Pressable
                style={{ flex:1, alignItems:'center'}}
                onPress={() => dataUser ? navigation.navigate("PurchaseOrder") : navigation.navigate("Login")}
              >
                <Ionicons name="wallet-outline" size={24} color={color.origin} />
                <Text style={styles.text_order}>Chờ xác nhận</Text>
              </Pressable>
              <Pressable
                style={{ flex:1, alignItems:'center'}}
              >
                <AntDesign name="inbox" size={24} color={color.origin} />
                <Text style={styles.text_order}>Chờ lấy hàng</Text>
              </Pressable>
              <Pressable
                style={{ flex:1, alignItems:'center'}}
              >
                <MaterialCommunityIcons name="truck-delivery-outline" size={24} color={color.origin} />
                <Text style={styles.text_order}>Chờ giao hàng</Text>
              </Pressable>
              <Pressable
                style={{ flex:1, alignItems:'center'}}
              >
                <MaterialIcons name="star-rate" size={24} color={color.origin} />
                <Text style={styles.text_order}>Đánh giá</Text>
              </Pressable>
            </View>
          <Button title="Logout" onPress={handleLogout} disabled={!dataUser} />
        </View>
        
      </ScrollView>
      
      
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  upperView: {
    flex: 2,
    backgroundColor: color.origin,
  },
  lowerView: {
    flex: 7,
    justifyContent: "center",
    alignItems: "center",
  },
  avt_image: {
    width: 70,
    height: 70,
    borderRadius: 100,
    padding: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 8,
  },
  btn_login: {
    width: 100,
    borderWidth: 1,
    borderColor: "white",
    alignItems: "center",
    paddingVertical: 10,
    marginVertical: 10,
    marginLeft: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  list_items: {
    marginVertical: 1,
    width: "100%",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    backgroundColor: "white",
  },
  text_order : {
    fontSize:12,
    color: color.origin
  }
});