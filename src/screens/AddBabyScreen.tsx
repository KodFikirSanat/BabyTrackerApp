// src/screens/AddBabyScreen.tsx

/**
 * @file Defines the AddBabyScreen, allowing authenticated users to add a new baby profile.
 * It captures the baby's name, date of birth, and gender, and saves it to Firestore.
 *
 * @format
 */

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useAuth} from '../context/AuthContext'; // To get the logged-in user
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../types/navigation';

type AddBabyScreenProps = NativeStackScreenProps<RootStackParamList, 'MainTabs'>;

const AddBabyScreen = ({navigation}: AddBabyScreenProps) => {
  const {user} = useAuth(); // Get the authenticated user from our context
  const [babyName, setBabyName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [gender, setGender] = useState<'female' | 'male'>('female'); // Default to female
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios'); // On iOS, the picker is a modal
    setDateOfBirth(currentDate);
  };

  const handleSaveBaby = async () => {
    if (!babyName.trim()) {
      Alert.alert('Eksik Bilgi', 'Lütfen bebeğin ismini girin.');
      return;
    }

    if (!user) {
      Alert.alert('Hata', 'Bu işlemi yapmak için giriş yapmış olmalısınız.');
      return;
    }

    setLoading(true);
    try {
      await firestore().collection('babies').add({
        userId: user.uid, // Link the baby to the logged-in user
        name: babyName.trim(),
        dateOfBirth: firestore.Timestamp.fromDate(dateOfBirth), // Store as Firestore Timestamp
        gender: gender,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      console.log('👶✅ AddBabyScreen: Baby profile saved successfully!');
      Alert.alert('Başarılı', 'Bebek profili başarıyla kaydedildi.');
      
      // Navigate to the home screen after successful save
      navigation.navigate('Home');

    } catch (error) {
      console.error('👶❌ AddBabyScreen: Error saving baby profile:', error);
      Alert.alert(
        'Hata',
        'Bebek profili kaydedilirken bir sorun oluştu. Lütfen tekrar deneyin.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Yeni Bebek Ekle</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Bebeğin İsmi"
        value={babyName}
        onChangeText={setBabyName}
        editable={!loading}
      />

      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
        <Text style={styles.datePickerText}>Doğum Tarihi: {dateOfBirth.toLocaleDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateOfBirth}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()} // Can't select a future date
        />
      )}

      <Text style={styles.label}>Cinsiyet</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'female' && styles.genderButtonSelected]}
          onPress={() => setGender('female')}
          disabled={loading}>
          <Text style={styles.genderButtonText}>Kız</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.genderButton, gender === 'male' && styles.genderButtonSelected]}
          onPress={() => setGender('male')}
          disabled={loading}>
          <Text style={styles.genderButtonText}>Erkek</Text>
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color="#e5d4f1" style={{marginTop: 20}} />
      ) : (
        <Button title="Kaydet" onPress={handleSaveBaby} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontSize: 16,
  },
  datePickerButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  datePickerText: {
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  genderButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  genderButtonSelected: {
    backgroundColor: '#e5d4f1',
    borderColor: '#cba4e8',
  },
  genderButtonText: {
    fontSize: 16,
  },
});

export default AddBabyScreen;
