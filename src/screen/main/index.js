import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  block,
  cancelAnimation,
  Extrapolate,
  Extrapolation,
  interpolate,
  set,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useCode,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {PanGestureHandler} from 'react-native-gesture-handler';
import {snapPoint} from 'react-native-redash';
import _ from 'lodash';
const {height, width} = Dimensions.get('window');

const MainApp = () => {
  const translateY = useSharedValue(0);
  const [containerHeight, setContainerHeight] = useState(height);
  const TRESHOLD = containerHeight - 2 * height + 60;

  const clampTranslateY = useDerivedValue(() => {
    return Math.max(Math.min(translateY.value, 0), -TRESHOLD);
  });

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startY = clampTranslateY.value;
      cancelAnimation(translateY.value);
    },
    onActive: (event, ctx) => {
      if (event.translationY < 0 || event.translationY > 0) {
        translateY.value = ctx.startY + event.translationY;
      }
    },
    onEnd: (event, ctx) => {
      if (event.translationY < 0 || event.translationY > 0) {
        translateY.value = withDecay({velocity: event.velocityY});
      }
    },
    onFinish: (event, ctx) => {
      if (translateY.value > 30) {
        translateY.value = withDelay(3000, withSpring(0));
      }
    },
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    const translationY = interpolate(
      clampTranslateY.value,
      [0, -TRESHOLD],
      [0, -TRESHOLD],
      Extrapolate.CLAMP,
    );

    return {
      transform: [{translateY: translationY}],
    };
  });
  const animatedRefreshContainer = useAnimatedStyle(() => {
    const height = interpolate(
      translateY.value,
      [0, 130],
      [0, 130],
      Extrapolation.CLAMP,
    );

    return {
      height,
    };
  });

  const animatedHeaderContainer = useAnimatedStyle(() => {
    const elevation = interpolate(
      clampTranslateY.value,
      [0, -50],
      [0, 5],
      Extrapolation.CLAMP,
    );

    return {
      elevation,
    };
  });

  return (
    <View>
      <Animated.View
        style={[
          animatedHeaderContainer,
          {
            height: 60,
            backgroundColor: 'white',
            zIndex: 10,
            elevation: 5,
            justifyContent: 'center',
            padding: 20,
          },
        ]}>
        <Text
          style={{
            height: 30,
            fontSize: 20,
          }}>
          Instagram
        </Text>
      </Animated.View>
      <Animated.View
        style={[
          // animatedRefreshContainer,
          {
            backgroundColor: 'red',
          },
        ]}
      />
      <PanGestureHandler onGestureEvent={onGestureEvent}>
        <Animated.View
          style={[animatedContainerStyle, {backgroundColor: 'yellow', height}]}>
          {Array(100)
            .fill('')
            .map((_, i) => {
              return (
                <View
                  key={i}
                  onLayout={e => {
                    if (!Number.isNaN(e.nativeEvent.layout.height)) {
                      setContainerHeight(
                        parseFloat(containerHeight) +
                          parseFloat(e?.nativeEvent?.layout?.height),
                      );
                    }
                  }}
                  style={{
                    height: 50,
                    backgroundColor: 'white',
                    borderBottomWidth: 0.5,
                    borderBottomColor: 'grey',
                  }}>
                  <Text>{i}</Text>
                </View>
              );
            })}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

export {MainApp};

const styles = StyleSheet.create({});
