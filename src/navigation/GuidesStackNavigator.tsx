
// src/navigation/GuidesStackNavigator.tsx

import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import GuidesScreen from '../screens/GuidesScreen';
import GuideDetailScreen from '../screens/GuideDetailScreen';

export type GuidesStackParamList = {
  GuidesList: undefined;
  GuideDetail: {guide: {title: string; content: string; imageUrl?: string}};
};

const Stack = createNativeStackNavigator<GuidesStackParamList>();

const GuidesStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="GuidesList" component={GuidesScreen} />
      <Stack.Screen name="GuideDetail" component={GuideDetailScreen} />
    </Stack.Navigator>
  );
};

export default GuidesStackNavigator;
