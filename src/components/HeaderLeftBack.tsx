// src/components/HeaderLeftBack.tsx

/**
 * @file A component that renders a back arrow icon for the header.
 * When pressed, it navigates the user to the previous screen in the stack.
 *
 * @format
 */

import React from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Svg, Path} from 'react-native-svg';

// Simple chevron-left icon for 'Back'
const BackArrowIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"
      fill="black"
    />
  </Svg>
);

const HeaderLeftBack = () => {
  const navigation = useNavigation();

  // Do not render the back button if there's nowhere to go back to.
  if (!navigation.canGoBack()) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.iconContainer}>
      <BackArrowIcon />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginLeft: 15,
  },
});

export default HeaderLeftBack;
