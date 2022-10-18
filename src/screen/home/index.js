import React, {useEffect, useState} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import {PanGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import {runOnJS} from 'react-native-reanimated/lib/reanimated2/core';
const END_POSITION = 200;
const Home = () => {
  const refScroll = React.createRef();
  const scroll = useSharedValue(true);
  const position = useSharedValue(0);
  const [enabledScroll, setEnabledScroll] = useState(true);
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

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.startY = position.value;
    },
    onActive: (event, ctx) => {
      if (event.translationY > 1 && event.translationY <= 150) {
        runOnJS(setEnabledScroll)(false);
        position.value = ctx.startY + event.translationY;
      }
    },
    onEnd: (event, _) => {
      if (event.translationY > 0) {
        position.value = withDelay(3000, withSpring(0));
      }
      runOnJS(setEnabledScroll)(true);
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: position.value}],
    };
  });

  const indicatorStyle = useAnimatedStyle(() => {
    const scale = interpolate(position.value, [0, 80], [0, 1]);
    const rotate = interpolate(position.value, [0, 80], [0, 360]);
    const translateY = interpolate(position.value, [0, 80], [-100, -50]);
    return {
      transform: [{translateY}, {rotate: `${rotate}deg`}, {scale: scale}],
    };
  });

  const indicatorTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(position.value, [0, 80], [0, 1]);
    const translateY = interpolate(position.value, [0, 80], [-100, 0]);
    return {
      // opacity: 10,
      transform: [{translateY}],
    };
  });

  return (
    <View style={{flex: 1}}>
      <Animated.View
        style={[
          {
            height: 150,
            backgroundColor: 'red',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <Animated.View
          style={[
            indicatorStyle,
            {
              width: 30,
              height: 30,
              backgroundColor: 'green',
            },
          ]}
        />
        <Animated.Text style={indicatorTextStyle}>Loading...</Animated.Text>
      </Animated.View>
      <PanGestureHandler
        enabled={!enabledScroll}
        simultaneousHandlers={refScroll}
        onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[{flex: 1, backgroundColor: 'white'}, animatedStyle]}>
          <Animated.FlatList
            ref={refScroll}
            onScrollBeginDrag={e => {
              if (e.nativeEvent.contentOffset.y <= 0) {
                setEnabledScroll(false);
              } else {
                setEnabledScroll(true);
              }
            }}
            scrollEnabled={enabledScroll}
            scrollEventThrottle={16}
            data={Array(100).fill('')}
            renderItem={({item, index}) => {
              return <Text>{index}</Text>;
            }}
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
