// src/screens/GuidesScreen.tsx

/**
 * @file GuidesScreen.tsx
 * @description This screen displays a list of informational guides for the user.
 *              Each item in the list is tappable and navigates to the
 *              GuideDetailScreen to show the full content.
 *
 * @format
 */

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {GuidesStackParamList} from '../navigation/GuidesStackNavigator';

/**
 * @interface Guide
 * @description Defines the data structure for a single guide item.
 */
interface Guide {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl?: string;
}

// --- Static Data ---
// In a real application, this data would likely be fetched from a CMS or Firestore.
// For now, it is defined statically within the component.
const GUIDES_DATA: Guide[] = [
  {
    id: '1',
    title: 'İlk 6 Ayda Uyku Düzeni',
    summary: 'Bebeğinizin uyku alışkanlıklarını anlamak ve yönetmek için ipuçları.',
    content: 'Detaylı içerik burada yer alacak... Bebeğinizin ilk aylarında uyku düzeni sık sık değişir. Gündüz ve gece ayrımını öğrenmesine yardımcı olmak önemlidir. Yatmadan önce sakinleştirici bir rutin oluşturmak, örneğin ılık bir banyo veya hafif bir masaj, bebeğinizin daha kolay uykuya dalmasını sağlayabilir.',
    imageUrl: 'https://via.placeholder.com/400x200.png/6b9ac4/ffffff?text=Uyku',
  },
  {
    id: '2',
    title: 'Ek Gıdaya Geçiş',
    summary: 'Bebeğinizi katı gıdalarla tanıştırmanın doğru zamanı ve yolu.',
    content: 'Detaylı içerik burada yer alacak... Ek gıdaya genellikle 6. ay civarında başlanır. Bebeğinizin başını dik tutabilmesi ve yiyeceklere ilgi göstermesi gibi işaretleri gözlemleyin. Püre haline getirilmiş tek bileşenli sebze ve meyvelerle başlamak en iyisidir.',
    imageUrl: 'https://via.placeholder.com/400x200.png/a3c46b/ffffff?text=Beslenme',
  },
  // Add more guides as needed
];


/**
 * @type GuidesScreenProps
 * @description Defines the navigation properties available to the GuidesScreen.
 */
type GuidesScreenProps = NativeStackScreenProps<GuidesStackParamList, 'GuidesList'>;

/**
 * @name GuidesScreen
 * @description The main component for displaying the list of guides.
 * @param {GuidesScreenProps} props - The navigation props.
 */
const GuidesScreen = ({navigation}: GuidesScreenProps): React.JSX.Element => {
  console.log('📚✅ GuidesScreen: Component has mounted.');

  /**
   * @function renderGuideItem
   * @description Renders a single item in the guides list.
   * @param {object} params - The parameters passed by FlatList's renderItem.
   * @param {Guide} params.item - The guide data for the current item.
   * @returns {React.JSX.Element} A touchable list item component.
   */
  const renderGuideItem = ({item}: {item: Guide}): React.JSX.Element => (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        console.log(`📚➡️ GuidesScreen: Navigating to GuideDetail for "${item.title}"`);
        // Navigate to the detail screen, passing the entire guide object as a parameter.
        navigation.navigate('GuideDetail', {guide: item});
      }}>
      {item.imageUrl && (
        <Image source={{uri: item.imageUrl}} style={styles.itemImage} />
      )}
      <View style={styles.itemTextContainer}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemSummary}>{item.summary}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Faydalı Bilgiler</Text>
      <FlatList
        data={GUIDES_DATA}
        renderItem={renderGuideItem}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden', // Ensures the image corners are also rounded.
  },
  itemImage: {
    width: '100%',
    height: 150,
  },
  itemTextContainer: {
    padding: 15,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemSummary: {
    fontSize: 14,
    color: 'gray',
  },
});

export default GuidesScreen;
