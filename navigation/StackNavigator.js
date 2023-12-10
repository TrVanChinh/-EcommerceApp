import { StyleSheet, Text, View,Button, TouchableOpacity } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import LiveScreen from "../screens/LiveScreen";
import NotificationScreen from "../screens/NotificationScreen";
import VideoScreen from "../screens/VideoScreeen";
import RegisterSellerScreen from "../screens/Seller/RegisterSellerScreen";
import AddPrucductScreen from "../screens/Seller/AddPrucductScreen";
import MyShopScreen from "../screens/Seller/MyShopScreen";
import color from "../components/color";

import {
  Entypo,
  AntDesign,
  Octicons,
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
} from "@expo/vector-icons";
import ListProducts from "../screens/Seller/ListProducts";


const StackNavigator = () => {
  const Stack = createNativeStackNavigator();
  const Tab = createBottomTabNavigator();
  function BottomTabs() {
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: "Home",
            tabBarLabelStyle: {
              color: "#F1582C",
            },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="home" size={24} color="#F1582C" />
              ) : (
                <AntDesign name="home" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="live"
          component={LiveScreen}
          options={{
            tabBarLabel: "Live",
            tabBarLabelStyle: {
              color: "#F1582C",
            },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <MaterialCommunityIcons
                  name="video-check"
                  size={24}
                  color="#F1582C"
                />
              ) : (
                <MaterialCommunityIcons
                  name="video-check-outline"
                  size={24}
                  color="black"
                />
              ),
          }}
        />
        <Tab.Screen
          name="video"
          component={VideoScreen}
          options={{
            tabBarLabel: "Video",
            tabBarLabelStyle: {
              color: "#F1582C",
            },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Entypo name="folder-video" size={24} color="#F1582C" />
              ) : (
                <Octicons name="video" size={24} color="black" />
              ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={NotificationScreen}
          options={{
            tabBarLabel: "Thông báo",
            tabBarLabelStyle: {
              color: "#F1582C",
            },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <Ionicons
                  name="md-notifications-sharp"
                  size={24}
                  color="#F1582C"
                />
              ) : (
                <Ionicons
                  name="md-notifications-outline"
                  size={24}
                  color="black"
                />
              ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Tôi",
            tabBarLabelStyle: {
              color: "#F1582C",
            },
            headerShown: false,
            tabBarIcon: ({ focused }) =>
              focused ? (
                <FontAwesome5 name="user-alt" size={24} color="#F1582C" />
              ) : (
                <FontAwesome5 name="user" size={24} color="black" />
              ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Main"
          component={BottomTabs}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Register Seller" component={RegisterSellerScreen}
          options={{
            headerTitle: "Đăng kí bán hàng",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => alert('This is a button!')}
              ><Text style={{color:color.origin, fontWeight:'bold'}}>Lưu</Text>
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen name="AddProduct" component={AddPrucductScreen}
          options={{
            headerTitle: "Thêm sản phẩm",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => alert('This is a button!')}
              ><Text style={{color:color.origin, fontWeight:'bold'}}>Lưu</Text>
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen name="ListProducts" component={ListProducts}
          options={{
            headerTitle: "Danh sách sản phẩm",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => alert('This is a button!')}
              ><Text style={{color:color.origin, fontWeight:'bold'}}>Lưu</Text>
              </TouchableOpacity>
            ),
          }} 
        />
        <Stack.Screen name="MyShop" component={MyShopScreen}
          options={{
            headerTitle: "Cửa hàng",
            headerRight: () => (
              <TouchableOpacity
                onPress={() => alert('This is a button!')}
              ><Text style={{color:color.origin, fontWeight:'bold'}}>Lưu</Text>
              </TouchableOpacity>
            ),
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default StackNavigator;

const styles = StyleSheet.create({});
