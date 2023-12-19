import { StyleSheet, Text, View,SafeAreaView, Platform, ScrollView, TouchableOpacity, Image, TextInput, FlatList, Pressable } from 'react-native'
import React from 'react'
import { useState, useEffect, useLayoutEffect } from "react";
import { Feather, SimpleLineIcons , AntDesign } from "@expo/vector-icons";
import SlideShow from '../slide/OnBoading';
import { collection, doc, query, onSnapshot, getDocs  } from 'firebase/firestore';
import {db} from '../firebase'
import auth from "@react-native-firebase/auth";

const HomeScreen = ({ navigation }) => {
    const [products, setProducts] = useState([])
    const [search, setSearch] = useState('')
    const [services, setServices] = useState([
        {
            name: 'Khung Giờ Săn Sale',
            url: 'https://cf.shopee.vn/file/e4a404283b3824c211c1549aedd28d5f'
        },
        {
            name: 'Miễn Phí Ship - Có Shopee',
            url: 'https://cf.shopee.vn/file/vn-50009109-c7a2e1ae720f9704f92f72c9ef1a494a'
        },
        {
            name: 'Voucher Giảm Đến 500.000Đ',
            url: 'https://cf.shopee.vn/file/vn-50009109-f6c34d719c3e4d33857371458e7a7059'
        },
        {
            name: 'Shopee Siêu Rẻ',
            url: 'https://cf.shopee.vn/file/vn-50009109-caaa7ee86cf5c7cd44c831cc33a9115c'
        },
        {
            name: 'Mã Giảm Giá',
            url: 'https://cf.shopee.vn/file/vn-50009109-8a387d78a7ad954ec489d3ef9abd60b4'
        },
        {
            name: 'Hàng Hiệu Outlet Giảm 50%',
            url: 'https://cf.shopee.vn/file/vn-50009109-852300c407c5e79bf5dc1854aa0cfeef'
        },
        {
            name: 'Nạp Thẻ, Dịch Vụ & Vé Maroon 5',
            url: 'https://cf.shopee.vn/file/9df57ba80ca225e67c08a8a0d8cc7b85'
        },
        {
            name: 'Xả Kho 12.000 Xu',
            url: 'https://cf.shopee.vn/file/vn-50009109-fbc98cb6dcc514259ff797e1b63c5937'
        },
        {
            name: 'Hàng Quốc Tế',
            url: 'https://cf.shopee.vn/file/a08ab28962514a626195ef0415411585'
        },
        {
            name: 'Bắt Trend - Giá Sốc',
            url: 'https://cf.shopee.vn/file/vn-50009109-1975fb1af4ae3c22878d04f6f440b6f9'
        },
        
    ])
    const [productFlashSale, setProductFlashSale] = useState([
        {
            price: '21.000đ',
            sale:'-22%',
            url: 'https://down-vn.img.susercontent.com/file/vn-50009109-15c149fd06963a25db7d53ef2ef3b4df'
        },
        {
            price: '302.000đ',
            sale:'-37%',
            url: 'https://down-vn.img.susercontent.com/file/vn-50009109-77fef5081a58b8f15f6da31d276cd1fa'
        },
        {
            price: '298.800đ',
            sale:'-25%',
            url: 'https://down-vn.img.susercontent.com/file/vn-50009109-c9dd3eb33c9898df34abe4a3388dec89'
        },
        {
            price: '433.000đ',
            sale:'-33%',
            url: 'https://down-vn.img.susercontent.com/file/vn-50009109-0b1e0b27deed9f7957e247bb9f662210'
        },
        {
            price: '1.733.000đ',
            sale:'-55%',
            url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-loumoc6ug85s10'
        },
        {
            price: '242.250đ',
            sale:'-45%',
            url: 'https://down-vn.img.susercontent.com/file/vn-11134601-7r98o-lobeu8g4o7w780'
        },
        {
            price: '314.000đ',
            sale:'-56%',
            url: 'https://down-vn.img.susercontent.com/file/ccdf463d6f861bb0b1b84066c7f27f8f'
        },
        {
            price: '440.000đ',
            sale:'-35%',
            url: 'https://down-vn.img.susercontent.com/file/vn-11134601-7r98o-lmsd9s4a310f18'
        },
        {
            price: '980.000đ',
            sale:'-45%',
            url: 'https://down-vn.img.susercontent.com/file/736e1fdfd8d0616b9f63b7ad2246763e'
        },
        
    ])
    const [product, setProduct] = useState([
        {
            sold:'234',
            price: '221.000đ',
            sale:'-22%',
            introduce:'Áo Nỉ Lót Lông Có Mũ Thời Trang THE GOOD/ Basic Hoodie',
            url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llei62d3h3go41'
        },
        {
            sold:'224',
            price: '222.000đ',
            sale:'-37%',
            introduce:'Thắt Lưng Nam PISA Giấu Đuôi Dây Khóa Tự Động Da Bò Thật',
            url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lgtepr0mzfoyca'
        },
        {
            sold:'112',
            price: '398.800đ',
            sale:'-25%',
            introduce:'áo khoác gió vansity phối màu đen trắng',
            url: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-llv06xeia21ra9'
        },
        {
            sold:'445',
            price: '34.000đ',
            sale:'-33%',
            introduce:'Sơn Bạc Mạ Crom Sơn Xịt Mạ Chrome Sáng Bóng 350ml',
            url: 'https://down-vn.img.susercontent.com/file/sg-11134201-23030-gh8iuwuxc5nv0d'
        },
        {
            sold:'788',
            price: '1.733.000đ',
            sale:'-55%',
            introduce:'Freedom Mô Hình Nhân Vật gundam eg hg mg z nt unicorn',
            url: 'https://down-vn.img.susercontent.com/file/cn-11134207-7r98o-lna6ztr124yjb0'
        },
        {
            sold:'755',
            price: '242.250đ',
            sale:'-45%',
            introduce:'1 Hồ Cá Sinh Thái Để Bàn Trang Trí Rượu hảo hạng của Hãng Marimo Eco',
            url: 'https://down-vn.img.susercontent.com/file/d0a017b9eccfbd24cb829da32eb4ceea'
        },
        
    ])
    

    useLayoutEffect(() => {
        const fetchData = async () => {
          const snapshot = await getDocs(collection(db, 'product'));
          const productsData = [];
      
          for (const productDoc of snapshot.docs) {
            const productId = productDoc.id;
            const productData = productDoc.data();
      
            const imageSnapshot = await getDocs(collection(doc(db, 'product', productId), 'image'));
      
            if (imageSnapshot.docs.length > 0) {
              const imageUrl = imageSnapshot.docs[0].data().url;
              productsData.push({
                id: productId,
                data: { ...productData, imageUrl }, 
              });
            }
          }
          setProducts(productsData);
        };
      
        const unsubscribe = onSnapshot(collection(db, 'product'), () => {
          fetchData();
        });
      
        return () => unsubscribe();
      }, []); 
      
// Điều hướng sang màn hình chi tiết và gửi ID của sản phẩm
    const handleItemPress = (product) => {
        navigation.navigate('Detail', { product });
      };

// Điều hướng sang màn hình tìm kiếm
    // const handleSearch = (search) => {
    //     navigation.navigate('Search', { search });
    //   };

    const handleSearch = () => {
        navigation.navigate('Search');
      };
  return (
    <SafeAreaView 
        style={{
            paddingTop: Platform.OS === "android" ? 40 : 0,
            flex: 1,
            backgroundColor:"white",
        }}
    >
        <ScrollView >
            <SlideShow/>
            <View style={{ position:"absolute", flexDirection:"row", alignItems:"center", justifyContent:"center"}}>  
                <View style = {{
                        height: 40,
                        width:"70%",
                        marginHorizontal: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor:"white",
                        padding: 10,
                    }}>
                    <TouchableOpacity
                        onPress={() => {
                            // if(search==''){
                            //     alert("Xin mời bạn nhập sản phẩm")
                            // }else{
                            //     handleSearch()
                            // }
                            handleSearch() 
                        }}
                    >
                        <Feather name="search" size={24} color="#857E7C" />
                    </TouchableOpacity>
                    <TextInput 
                            placeholder='Tìm kiếm'
                            onChangeText={(text) => {
                                setSearch(text)
                            }}
                            style = {{
                                height: 35,
                                flex: 1,
                                marginEnd: 8,
                                borderRadius: 5,
                                opacity: 0.5,
                                paddingStart: 10,
                            }}
                            autoCorrect = {false} />
                    <AntDesign name="camerao" size={24} color="#857E7C" />
                </View>
                <AntDesign name="shoppingcart" size={24} color="white" padding={10}/>
                <AntDesign name="message1" size={24} color="white" padding={10}/> 
            </View>
            <View style = {{height: 100}}>          
                <FlatList 
                    horizontal  
                    style={{ flex: 1}}
                    keyExtractor={item => item.name}
                    data={services}
                    renderItem={({item}) => {
                        return <TouchableOpacity
                                    onPress={() => {
                                        alert(`press ${item.name}`)
                                    }}
                                    style = {{ 
                                        justifyContent:'center',
                                        alignItems:'center'
                                    }}
                                >
                                <Image
                                    style={{
                                        width: 50,
                                        height: 50,
                                        resizeMode: 'cover',
                                        borderRadius: 25,
                                        margin: 10,
                                    }}
                                    source={{
                                        uri: item.url
                                    }}
                                    />
                                <View style={{ width: 60, paddingBottom:10}}>
                                    <Text style={{ textAlign: "center",fontSize: 10,}}>{item.name}</Text>
                                </View>
                        </TouchableOpacity>
                    }}
                >
                </FlatList>
                
            </View>
            <View>
                <Text style={{ color:'red', fontWeight:"bold", padding:20}}>FLASH SALE</Text>
            </View>
            <View style = {{height: 250}}>          
                <FlatList 
                    horizontal  
                    style={{ flex: 1}}
                    keyExtractor={item => item.url}
                    data={product}
                    renderItem={({item}) => {
                        return <TouchableOpacity
                                    onPress={() => {
                                        alert(`press ${item.price}`)
                                    }}
                                    style = {{ 
                                        justifyContent:'center',
                                        alignItems:'center'
                                    }}
                                >
                                <View>
                                    <Image
                                        style={{
                                            width: 200,
                                            height: 200,
                                            resizeMode: 'cover',
                                            borderRadius: 25,
                                            margin: 10,
                                        }}
                                        source={{
                                            uri: item.url
                                        }}
                                        />
                                    <View style={{
                                            width: 50,
                                            position:"absolute",
                                            marginTop: 20,
                                            alignItems: 'flex-end', 
                                            backgroundColor: 'red'
                                        }}>
                                        <Text style={{color:'yellow'}}>{item.sale}</Text>
                                    </View>
                                </View>    
                                <View style={{ width: 100, paddingBottom:10}}>
                                    <Text style={{ textAlign: "center",fontSize: 20, color:'red'}}>{item.price}</Text>
                                </View>
                        </TouchableOpacity>
                    }}
                >
                </FlatList>
            </View>
            <View>
                <Text style={{ color:'red', fontWeight:"bold", padding:20}}>GỢI Ý HÔM NAY</Text>
            </View>
            <View style = {{height: 250}}>          
                <FlatList 
                    horizontal  
                    style={{ flex: 1}}
                    keyExtractor={item => item.id}
                    data={products}
                    renderItem={({item}) => {
                        return <TouchableOpacity
                                    onPress={() => 
                                        handleItemPress(item)
                                    }
                                    style = {{ 
                                        justifyContent:'center',
                                        alignItems:'center'
                                    }}
                                >
                                <View>
                                    <Image
                                        style={{
                                            width: 200,
                                            height: 200,
                                            resizeMode: 'cover',
                                            borderRadius: 25,
                                            margin: 10,
                                        }}
                                        source={{
                                            uri: item.data.imageUrl
                                        }} 
                                        />
                                    <View style={{
                                            width: 50,
                                            position:"absolute",
                                            marginTop: 20,
                                            alignItems: 'flex-end',
                                            backgroundColor: 'red'
                                        }}>
                                        <Text style={{color:'yellow'}}>{item.data.discount}%</Text>
                                    </View>
                                </View>    
                                <View style={{ width: 100, paddingBottom:10}}>
                                    <Text style={{ textAlign: "center",fontSize: 20, color:'red'}}>{item.data.price}</Text>
                                </View>
                        </TouchableOpacity>
                    }}
                >
                </FlatList>
            </View>
        </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})