import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { RootNavigator } from './navigation/RootNavigator';
import { PhoneFrame } from '../shared/components/PhoneFrame';

export function App() {
  return (
    <PhoneFrame>
      <GestureHandlerRootView style={styles.root}>
        <StatusBar style="light" />
        <RootNavigator />
      </GestureHandlerRootView>
    </PhoneFrame>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
});
