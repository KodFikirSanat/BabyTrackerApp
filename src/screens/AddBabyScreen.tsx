// src/screens/AddBabyScreen.tsx

/**
 * @file AddBabyScreen.tsx
 * @description This screen provides a form for the user to add a new baby profile.
 *              It handles user input, form validation, and saving the new profile
 *              to Firestore.
 *
 * @format
 */

import React, {useState} from 'react';
import {
  View, Text, TextInput, Button, StyleSheet,
  TouchableOpacity, Alert, Platform, ActivityIndicator
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker, {DateTimePickerEvent} from '@react-native-community/datetimepicker';
import {useAuth} from '../context/AuthContext';
import {useNavigation, NavigationProp} from '@react-navigation/native';
import {RootStackParamList} from '../types/navigation';

/**
 * @name AddBabyScreen
 * @description The main component for the "Add Baby" screen.
 */
const AddBabyScreen = (): React.JSX.Element => {
  console.log('👶➕ AddBabyScreen: Component has mounted.');
  
  // --- Hooks ---
  const {user} = useAuth(); // Get the currently authenticated user.
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  // --- State for the form inputs ---
  const [name, setName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState<'male' | 'female' | 'other' | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  /**
   * @function handleAddBaby
   * @description Validates the form inputs and, if valid, creates a new baby
   *              document in the 'babies' collection in Firestore.
   */
  const handleAddBaby = async () => {
    console.log("👶💾 AddBabyScreen.handleAddBaby: Attempting to add baby...");
    
    // --- Input Validation ---
    if (!name.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen bebeğinizin adını girin.');
      return;
    }
    if (!gender) {
      Alert.alert('Eksik Bilgi', 'Lütfen bebeğinizin cinsiyetini seçin.');
      return;
    }
    if (!user) {
      Alert.alert('Hata', 'Kullanıcı oturumu bulunamadı. Lütfen tekrar giriş yapın.');
      console.error('🔥👶 AddBabyScreen.handleAddBaby: Cannot add baby, user is not authenticated.');
      return;
    }
    
    setLoading(true);

    try {
      // Prepare the data object to be saved to Firestore.
      const babyData = {
        userId: user.uid,
        name: name.trim(),
        dateOfBirth: firestore.Timestamp.fromDate(dateOfBirth),
        gender: gender,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      
      console.log('👶 Firestore: Saving new baby data...', babyData);
      // Add the new document to the 'babies' collection.
      await firestore().collection('babies').add(babyData);
      
      Alert.alert('Başarılı!', 'Bebeğinizin profili başarıyla oluşturuldu.');
      console.log('👶✅ AddBabyScreen.handleAddBaby: Baby profile created successfully.');
      
      // Navigate back to the main tabs, which will now show the new baby.
      navigation.navigate('MainTabs', { screen: 'Home' });

    } catch (error) {
      console.error('🔥👶 AddBabyScreen.handleAddBaby: Error creating baby profile:', error);
      Alert.alert('Hata', 'Profil oluşturulurken bir sorun oluştu.');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yeni Bebek Profili</Text>

      {/* Input for baby's name */}
      <TextInput
        style={styles.input}
        placeholder="Bebeğin Adı"
        value={name}
        onChangeText={setName}
      />
      
      {/* Date of Birth Picker */}
      <Text style={styles.label}>Doğum Tarihi</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
        <Text>{dateOfBirth.toLocaleDateString('tr-TR')}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={dateOfBirth}
          mode="date"
          display="spinner"
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowDatePicker(Platform.OS === 'ios');
            if (selectedDate) {
              setDateOfBirth(selectedDate);
            }
          }}
        />
      )}
      
      {/* Gender Selection */}
      <Text style={styles.label}>Cinsiyet</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'female' && styles.genderButtonSelected]}
          onPress={() => setGender('female')}>
          <Text style={styles.genderText}>Kız</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'male' && styles.genderButtonSelected]}
          onPress={() => setGender('male')}>
          <Text style={styles.genderText}>Erkek</Text>
        </TouchableOpacity>
      </View>
      
      {/* Submit Button */}
      {loading ? (
        <ActivityIndicator size="large" color="#6b9ac4" style={{marginTop: 20}} />
      ) : (
        <Button title="Profili Oluştur" onPress={handleAddBaby} />
      )}
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    justifyContent: 'center',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  genderButtonSelected: {
    backgroundColor: '#6b9ac4',
    borderColor: '#6b9ac4',
  },
  genderText: {
    fontSize: 16,
  },
});

export default AddBabyScreen;
