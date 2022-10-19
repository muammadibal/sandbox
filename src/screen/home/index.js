import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  scrollTo,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withRepeat,
  withSpring,
} from 'react-native-reanimated';
import {runOnJS} from 'react-native-reanimated/lib/reanimated2/core';
const {width, height} = Dimensions.get('screen');
let datas = [
  {
    imageUrl:
      'https://images.unsplash.com/photo-1661961112134-fbce0fdf3d99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1666090257483-32f8b567424b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwyfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1666058091341-42486f239ebc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1666065988253-3ad95ca4404f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwxMHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1666094288098-c067a55c8e9a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw4fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=500&q=60',
  },
  {
    imageUrl:
      'https://images.unsplash.com/photo-1664575600796-ffa828c5cb6e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxMXx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=60',
  },
];

const Home = () => {
  const refScroll = useAnimatedRef();
  const scroll = useSharedValue(true);
  const position = useSharedValue(0);
  const [enabledScroll, setEnabledScroll] = useState(true);
  const [listData, setListData] = useState([]);
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [loadMore, setLoadMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onFetch = async () => {
    fetch(`${apiUrl}`)
      .then(res => res.json())
      .then(resVal => {
        console.log('resVal', resVal);
        // setListData(resVal?.data);
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

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = position.value;
    },
    onActive: (event, ctx) => {
      if (event.translationY > 1 && event.translationY <= 170) {
        position.value = ctx.startY + event.translationY;
      }
    },
    onEnd: (event, _) => {
      if (event.translationY > 100 && event.translationY < 130) {
        position.value = withSpring(130);
        position.value = withDelay(3000, withSpring(0));
        // withDelay(3000, runOnJS(setRepeatRotate)(false));
      } else if (event.translationY > 130) {
        position.value = withSpring(130);
        position.value = withDelay(3000, withSpring(0));
        // withDelay(3000, runOnJS(setRepeatRotate)(false));
      } else {
        position.value = withSpring(0);
      }
      runOnJS(setEnabledScroll)(true);
      scrollTo(refScroll, 0, 1, true);
    },
    onCancel: (e, _) => {
      scrollTo(refScroll, 0, 1, true);
    },
  });

  useEffect(() => {
    if (enabledScroll && layoutHeight <= height - 150) {
      setEnabledScroll(false);
    }
  }, [enabledScroll]);

  // useDerivedValue(() => {
  //   if (enabledScroll) {
  //     scrollTo(refScroll, 0, 1, true);
  //     // refScroll?.current?.scrollTo({x: 0, y: 15});
  //   }
  // });

  const animatedRefreshContainerStyle = useAnimatedStyle(() => {
    const translateY = interpolate(position.value, [0, 150], [0, 70]);
    return {
      top: translateY,
    };
  });

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(position.value, [0, 180], [0, 180], {
      extrapolateRight: Extrapolate.CLAMP,
    });
    return {
      transform: [{translateY}],
    };
  });

  const indicatorStyle = useAnimatedStyle(() => {
    const scale = interpolate(position.value, [0, 80], [0, 1], {
      extrapolateLeft: Extrapolate.CLAMP,
      extrapolateRight: Extrapolate.EXTEND,
    });
    const rotate = interpolate(position.value, [0, 80], [0, 360], {
      extrapolateRight: Extrapolate.EXTEND,
    });
    const translateY = interpolate(
      position.value,
      [0, 80],
      [-100, -10],
      Extrapolate.CLAMP,
    );
    return {
      transform: [{translateY}, {rotate: `${rotate}deg`}, {scale}],
    };
  });

  const indicatorTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(position.value, [0, 80], [0, 1]);
    const scale = interpolate(position.value, [0, 80], [0, 0.7], {
      extrapolateLeft: Extrapolate.CLAMP,
      extrapolateRight: Extrapolate.EXTEND,
    });
    const translateY = interpolate(
      position.value,
      [0, 80],
      [-100, 10],
      Extrapolate.CLAMP,
    );
    return {
      opacity,
      transform: [{translateY}, {scale}],
    };
  });

  return (
    <View style={{flex: 1}}>
      <View
        style={{
          height: 60,
          backgroundColor: 'white',
          zIndex: 10,
          justifyContent: 'center',
          paddingHorizontal: 16,
        }}>
        <TouchableOpacity
          onPress={() => {
            refScroll?.current?.scrollToOffset({animated: true, offset: 1});
          }}>
          <Text style={{fontSize: 22, fontWeight: 'bold'}}>Instagram</Text>
        </TouchableOpacity>
      </View>
      <Animated.View
        style={[
          animatedRefreshContainerStyle,
          {
            backgroundColor: '#eaeaea',
            position: 'absolute',
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
            height: 150,
          },
        ]}>
        <Animated.View
          style={[
            indicatorStyle,
            {
              width: 30,
              height: 30,
              backgroundColor: 'green',
              borderRadius: 30 / 3,
            },
          ]}
        />
        <Animated.Text style={[indicatorTextStyle, {color: 'black'}]}>
          Loading...
        </Animated.Text>
      </Animated.View>
      <PanGestureHandler
        enabled={!enabledScroll}
        simultaneousHandlers={refScroll}
        onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[{flex: 1, backgroundColor: 'white'}, animatedStyle]}>
          <Animated.FlatList
            ref={refScroll}
            onLayout={e => {
              if (e.nativeEvent.layout.height <= height - 150) {
                setEnabledScroll(false);
                setLayoutHeight(e.nativeEvent.layout.height);
              }
            }}
            onScrollBeginDrag={e => {
              if (e.nativeEvent.contentOffset.y > 0) {
                return setEnabledScroll(true);
              }

              setEnabledScroll(false);
            }}
            onScroll={e => {
              if (e.nativeEvent.contentOffset.y > 0) {
                setLoadMore(true);
                return setEnabledScroll(true);
              }
              setEnabledScroll(false);
            }}
            scrollEnabled={enabledScroll}
            scrollEventThrottle={16}
            data={datas} //Array(100).fill('')}
            renderItem={({item, index}) => {
              return (
                <View>
                  <Image
                    source={{uri: item?.imageUrl}}
                    style={{width: width, height: 400}}
                  />
                  <Text>{index}</Text>
                </View>
              );
            }}
            onEndReached={() => {
              setTimeout(() => {
                setLoadMore(false);
              }, 3000);
            }}
            onEndReachedThreshold={0.1}
            ListFooterComponent={
              loadMore && (
                <View
                  style={{
                    height: 50,
                    justifyContent: 'center',
                  }}>
                  <ActivityIndicator size="large" />
                </View>
              )
            }
          />
        </Animated.View>
      </PanGestureHandler>

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
