import {
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  ScrollView,
  View,
  Image,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Feather,
  SimpleLineIcons,
  Entypo,
  AntDesign,
  Ionicons,
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
import { app } from "../firebaseConfig";

const ProfileScreen = ({ navigation }) => {
  const [isLogin, setLogin] = useState(null);
  const [user, setUser] = useState(null);
  const db = getFirestore(app);
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authenticatedUser) => {
      setLogin(authenticatedUser);
      // console.log(isLogin);
      if (authenticatedUser) {
        // Nếu user không null, tiến hành lấy dữ liệu
        getUser(authenticatedUser);
      }
    });

    // Hủy người nghe khi component unmount
    return () => unsubscribe();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Nếu màn hình được focus (được hiển thị), thực hiện các hành động cần thiết
      const unsubscribe = auth().onAuthStateChanged((authenticatedUser) => {
        setLogin(authenticatedUser);
        if (authenticatedUser) {
          getUser(authenticatedUser);
        }
      });

      // Hủy người nghe khi màn hình không còn được focus
      return () => unsubscribe();
    }, [])
  );

  const getUser = async (authenticatedUser) => {
    const docRef = doc(db, "user", authenticatedUser.uid);
    const docSnap = await getDoc(docRef);
    // console.log(docSnap.id);
    setUser(docSnap.data());
  };

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => console.log("Đã đăng xuất!"))
      .catch((error) => alert("Vui lòng đăng nhập trước"));
    setLogin(null);
    setUser(null);
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
            {isLogin && user ? (
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
                        uri: user.photo,
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
                      {user.name}
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
          {user && user.seller ? (
            <>
              {/* My shop */}
              <TouchableOpacity
                style={styles.list_items}
                onPress={() => navigation.navigate("MyShop")}
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
          ) : (
            <>
              {/* Dang ki ban hang */}
              <TouchableOpacity
                style={styles.list_items}
                onPress={() =>
                  user
                    ? navigation.navigate("Register Seller", {
                        idUser: isLogin.uid,
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
                  <Text> Đăng kí miễn phí</Text>
                  <SimpleLineIcons
                    marginLeft={15}
                    name="arrow-right"
                    size={10}
                    color="#60698a"
                  />
                </View>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity
            style={styles.list_items}
            onPress={() =>
              user
                ? navigation.navigate("EditUserInfo", {
                    idUser: isLogin.uid,
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

          <Button title="Logout" onPress={handleLogout} disabled={!isLogin} />
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
});
