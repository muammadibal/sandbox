import {
  Alert,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {UltimateListView} from '@bang88/react-native-ultimate-listview';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Directions,
  FlingGestureHandler,
  Gesture,
  GestureDetector,
  State,
} from 'react-native-gesture-handler';
const END_POSITION = 200;
const Home = () => {
  const refScroll = React.createRef();
  const position = useSharedValue(-100);
  const [layout, setLayout] = useState('list');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    onFetch();
  }, []);

  const onFetch = async (page = 1, startFetch, abortFetch) => {
    fetch(`https://reqres.in/api/users?page=${page}`)
      .then(res => res.json())
      .then(resVal => {
        startFetch(resVal?.data, resVal?.per_page);
      })
      .catch(err => {
        abortFetch();
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  // const onGestureEvent = Gesture.Pan()
  //   .onUpdate(e => {
  //     position.value = e.translationX;
  //   })
  //   .onEnd(e => {
  //   });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateY: position.value}],
  }));

  return (
    <View>
      <Animated.View
        style={[
          {
            height: 100,
            backgroundColor: 'red',
          },
          animatedStyle,
        ]}
      />
      <Animated.FlatList
        onScrollBeginDrag={e => {
          console.log('onScrollBeginDrag', e.nativeEvent.contentOffset.y);
          if (e.nativeEvent.contentOffset.y === 0) {
            position.value = withTiming(100, {duration: 10});
            setTimeout(() => {
              position.value = withTiming(-100, {duration: 10});
            }, 2000);
          }
        }}
        onStartShouldSetResponder={e => {
          console.log('onStartShouldSetResponder', e.nativeEvent.pageY);
        }}
        onScroll={e => {
          console.log('onScroll', e.nativeEvent.contentOffset.y);
        }}
        onScrollToTop={e => {
          console.log('onScrollToTop', e.nativeEvent.contentOffset.y);
        }}
        ref={refScroll}
        data={Array(50).fill('')}
        renderItem={({item, index}) => {
          return <Text>{index}</Text>;
        }}
      />

      {/* <UltimateListView
        onFetch={onFetch}
        key={layout}
        keyExtractor={(item, index) => `${index} - ${item}`}
        refreshableMode="advanced"
        item={(item, index) => {
          return (
            <View style={{flexDirection: 'row'}}>
              <Image
                source={{uri: item?.avatar}}
                style={{width: 50, height: 50}}
              />
              <View>
                <Text>
                  {item?.first_name} {item?.last_name}
                </Text>
                <Text>{item?.email}</Text>
              </View>
            </View>
          );
        }}
        displayDate
        // arrowImageStyle={{width: 20, height: 20, resizeMode: 'contain'}}
      /> */}
    </View>
  );
};

export {Home};

const styles = StyleSheet.create({});
