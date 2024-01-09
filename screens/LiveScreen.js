import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  Pressable,
} from 'react-native';

const YourScreen = () => {
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Gọi hàm reload của bạn ở đây
    setTimeout(() => {
      setRefreshing(false);
    }, 1000); // Giả định hàm reload mất 1 giây để hoàn thành
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: 'center' }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text>Your Content Here</Text>
      </ScrollView>
      {refreshing && (
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          {/* Icon reload hoặc nội dung tùy ý */}
          <Pressable onPress={onRefresh}>
            <Text>Reload</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

export default YourScreen;
