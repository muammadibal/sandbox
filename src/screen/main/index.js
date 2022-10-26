import {StyleSheet, Text, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import Animated, {
  block,
  cancelAnimation,
  Extrapolate,
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
  const TRESHOLD = containerHeight - 2 * height;

  const clampTranslateY = useDerivedValue(() => {
    return Math.max(Math.min(translateY.value, 100), parseFloat(-TRESHOLD));
  });

  // console.log('clampTranslateY', clampTranslateY?.value);

  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      ctx.startY = clampTranslateY.value;
      cancelAnimation(translateY.value);
    },
    onActive: (event, ctx) => {
      if (ctx.startY + event.translationY < 100) {
        translateY.value = ctx.startY + event.translationY;
      }
      // console.log('active', ctx.startY + event.translationY);
    },
    onEnd: (event, ctx) => {
      console.log('onend', event.y);
      if (event.y < 580) {
        translateY.value = withDecay({velocity: event.velocityY});
      } else {
        translateY.value = withDelay(3000, withSpring(0));
      }
    },
    // onFinish: (event, _) => {
    //   console.log('e', event.y);
    //   console.log('e translatey', event.translationY);
    // },
  });

  // console.log('containerHeight', -(containerHeight - 2 * height));

  const animatedContainerStyle = useAnimatedStyle(() => {
    const translationY = interpolate(
      translateY.value,
      [0, -TRESHOLD],
      [0, -TRESHOLD],
      {
        extrapolateLeft: Extrapolate.EXTEND,
        extrapolateRight: Extrapolate.CLAMP,
      },
    );

    return {
      transform: [{translateY: translationY}],
    };
  });

  return (
    <View>
      <View
        style={{
          height: 130,
          backgroundColor: 'red',
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
        }}
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
                  }}>
                  <Text style={{height: 50, backgroundColor: 'green'}}>
                    {i}
                  </Text>
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
