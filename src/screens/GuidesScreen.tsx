import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';

// Her bir rehber kartını temsil eden component
// Bu component'i ayrı bir dosyada oluşturmak en iyi pratiktir.
const GuideCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardExcerpt}>{item.excerpt}</Text>
    </View>
  </TouchableOpacity>
);

const GuidesScreen = ({ navigation }) => {
  // Yükleme durumunu yönetmek için state
  const [loading, setLoading] = useState(true);
  
  // Firestore'dan gelen rehberleri saklamak için state
  const [guides, setGuides] = useState([]);

  useEffect(() => {
    // Firestore'daki 'guides' koleksiyonuna sorgu atıyoruz
    const subscriber = firestore()
      .collection('guides')
      .onSnapshot(querySnapshot => {
        const guidesList = [];

        querySnapshot.forEach(documentSnapshot => {
          // Her bir dokümanı listeye ekliyoruz.
          // Dokümanın ID'sini de veriye eklemek önemlidir,
          // çünkü FlatList'te 'key' olarak ve navigasyon için kullanacağız.
          guidesList.push({
            ...documentSnapshot.data(),
            id: documentSnapshot.id,
          });
        });

        setGuides(guidesList);
        setLoading(false);
      });

    // Component ekrandan kaldırıldığında Firestore dinleyicisini kapat
    return () => subscriber();
  }, []);

  // Veriler yüklenirken bir yükleme göstergesi göster
  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Kart tıklandığında detay sayfasına yönlendirme fonksiyonu
  const handleCardPress = (item) => {
    navigation.navigate('GuideDetail', { guide: item });
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={guides}
        renderItem={({ item }) => (
          <GuideCard 
            item={item} 
            onPress={() => handleCardPress(item)} 
          />
        )}
        keyExtractor={item => item.id}
        numColumns={2} // Dökümanda belirtildiği gibi iki sütunlu yapı
      />
    </SafeAreaView>
  );
};

// Sayfanın ve kartların stilleri
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardExcerpt: {
    fontSize: 12,
    color: '#666',
  },
});

export default GuidesScreen;
