import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const ProductDetails = () => {
  const [productName, setProductName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Thực hiện truy vấn Firestore để lấy tên sản phẩm từ collection 'product' với điều kiện idShop = '123'
        const querySnapshot = await firestore()
          .collection('product')
          .where('idShop', '==', 'SGRmRvN7t2aKv4ylKAmqs0Llbnr1')
          .limit(1) // Giới hạn kết quả trả về chỉ 1 bản ghi
          .get();

        // Lấy dữ liệu từ kết quả truy vấn
        if (!querySnapshot.empty) {
          const productData = querySnapshot.docs[0].data();
          const productName = productData.name;

          // Cập nhật state để hiển thị tên sản phẩm
          setProductName(productName);
        } else {
          // Không có sản phẩm nào thỏa mãn điều kiện
          console.log('No product found for idShop = 123');
        }
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Product Name: {productName}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default ProductDetails;
