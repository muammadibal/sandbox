import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Home} from './src/screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Home />
    </GestureHandlerRootView>
  );
};

export default App;
