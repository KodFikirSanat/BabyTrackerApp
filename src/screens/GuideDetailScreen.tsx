// src/screens/GuideDetailScreen.tsx

/**
 * @file GuideDetailScreen.tsx
 * @description This screen displays the full content of a single guide,
 *              which is selected from the GuidesScreen. It receives the guide's
 *              data via navigation parameters.
 *
 * @format
 */

import React from 'react';
import {View, Text, StyleSheet, Image, ScrollView} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GuidesStackParamList} from '../navigation/GuidesStackNavigator';

/**
 * @type GuideDetailScreenProps
 * @description Defines the navigation properties for this screen, specifying that
 *              it expects a 'guide' object in its route parameters.
 */
type GuideDetailScreenProps = NativeStackScreenProps<GuidesStackParamList, 'GuideDetail'>;

/**
 * @name GuideDetailScreen
 * @description The main component for displaying a single guide.
 * @param {GuideDetailScreenProps} props - The navigation props, containing the route.
 */
const GuideDetailScreen = ({route}: GuideDetailScreenProps): React.JSX.Element => {
  console.log('📚✅ GuideDetailScreen: Component has mounted.');
  
  // --- Extracting data from navigation ---
  // The 'guide' object is passed as a parameter when navigating to this screen.
  const {guide} = route.params;
  console.log(`📚🔍 GuideDetailScreen: Displaying details for guide: "${guide.title}"`);

  return (
    <ScrollView style={styles.container}>
      {/* Optional Image Header */}
      {guide.imageUrl && (
        <Image source={{uri: guide.imageUrl}} style={styles.image} />
      )}
      
      {/* Guide Title */}
      <Text style={styles.title}>{guide.title}</Text>
      
      {/* Guide Content */}
      <Text style={styles.content}>{guide.content}</Text>
    </ScrollView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 20,
    color: '#333',
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 20,
    paddingBottom: 40,
    color: '#555',
  },
});

export default GuideDetailScreen;
