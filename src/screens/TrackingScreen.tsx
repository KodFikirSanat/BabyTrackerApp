// src/screens/TrackingScreen.tsx

/**
 * @file Defines the TrackingScreen, for logging and viewing a baby's activities.
 *
 * @format
 */

import React, {useEffect, useState, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TextInput,
  Button,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import {useBaby} from '../context/BabyContext';
import {useIsFocused} from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

// Type definitions with corrected Timestamp type
type DevelopmentLog = { id: string; category: 'development'; type: 'weight' | 'height'; value: number; createdAt: FirebaseFirestoreTypes.Timestamp; };
type RoutineLog = { id: string; category: 'routine'; type: 'sleep' | 'feeding' | 'diaper'; startTime?: FirebaseFirestoreTypes.Timestamp; endTime?: FirebaseFirestoreTypes.Timestamp; durationInMinutes?: number; notes?: string; createdAt: FirebaseFirestoreTypes.Timestamp; };
type HealthLog = { id: string; category: 'health'; type: 'vaccination' | 'doctor_visit'; eventName: string; eventDate: FirebaseFirestoreTypes.Timestamp; notes?: string; createdAt: FirebaseFirestoreTypes.Timestamp; };
type AnyLog = DevelopmentLog | RoutineLog | HealthLog;
type Category = 'development' | 'routine' | 'health';

// Component for the Add/Edit Log Modal
const AddLogModal = ({ visible, onClose, babyId }: { visible: boolean; onClose: () => void; babyId: string; }) => {
  const [logCategory, setLogCategory] = useState<Category>('development');
  const [logType, setLogType] = useState('weight');
  const [logValue, setLogValue] = useState('');
  const [logEventName, setLogEventName] = useState('');
  const [logDate, setLogDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    let data: any = {
      type: logType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      notes: notes,
    };
    let collectionName = `${logCategory}Logs`;

    // --- Data Validation and Preparation ---
    if (logCategory === 'development') {
      if (!logValue) {
        Alert.alert('Hata', 'Lütfen bir değer girin (kg veya cm).');
        setLoading(false);
        return;
      }
      data.value = parseFloat(logValue);
    } else if (logCategory === 'health') {
      if (!logEventName) {
        Alert.alert('Hata', 'Lütfen olay adını girin (örn: KPA Aşısı).');
        setLoading(false);
        return;
      }
      data.eventName = logEventName;
      data.eventDate = firestore.Timestamp.fromDate(logDate);
    }
    // Add validation for 'routine' if needed

    try {
      console.log(`📈💾 Saving to babies/${babyId}/${collectionName}:`, data);
      await firestore().collection('babies').doc(babyId).collection(collectionName).add(data);
      Alert.alert('Başarılı', 'Kayıt başarıyla eklendi.');
      onClose(); // Close modal on success
    } catch (error) {
      console.error('📈❌ Error saving log:', error);
      Alert.alert('Hata', 'Kayıt eklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };
  
  const renderForm = () => {
    return (
      <View>
        <Text style={styles.modalLabel}>Kategori</Text>
        <View style={styles.tabContainer}>
         {(['development', 'routine', 'health'] as Category[]).map(cat => (
            <TouchableOpacity key={cat} style={[styles.tab, logCategory === cat && styles.tabActive]} onPress={() => setLogCategory(cat)}>
              <Text>{cat.charAt(0).toUpperCase() + cat.slice(1)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {logCategory === 'development' && (
          <>
            <Text style={styles.modalLabel}>Tür</Text>
            <View style={styles.tabContainer}>
              <TouchableOpacity style={[styles.tab, logType === 'weight' && styles.tabActive]} onPress={() => setLogType('weight')}><Text>Kilo</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.tab, logType === 'height' && styles.tabActive]} onPress={() => setLogType('height')}><Text>Boy</Text></TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder={logType === 'weight' ? "Kilo (kg)" : "Boy (cm)"} value={logValue} onChangeText={setLogValue} keyboardType="numeric" />
          </>
        )}
        
        {logCategory === 'health' && (
          <>
            <Text style={styles.modalLabel}>Tür</Text>
            <View style={styles.tabContainer}>
               <TouchableOpacity style={[styles.tab, logType === 'vaccination' && styles.tabActive]} onPress={() => setLogType('vaccination')}><Text>Aşı</Text></TouchableOpacity>
               <TouchableOpacity style={[styles.tab, logType === 'doctor_visit' && styles.tabActive]} onPress={() => setLogType('doctor_visit')}><Text>Doktor</Text></TouchableOpacity>
            </View>
            <TextInput style={styles.input} placeholder="Olay Adı (örn: 1. Ay Aşısı)" value={logEventName} onChangeText={setLogEventName} />
            <TouchableOpacity onPress={() => setShowDatePicker(true)}><Text style={styles.input}>Tarih: {logDate.toLocaleDateString()}</Text></TouchableOpacity>
             {showDatePicker && <DateTimePicker value={logDate} mode="date" display="default" onChange={(e,d) => {setShowDatePicker(Platform.OS === 'ios'); setLogDate(d||logDate);}} />}
          </>
        )}
        
        {logCategory === 'routine' && <Text style={{textAlign: 'center', margin: 20}}>Rutin takibi yakında eklenecektir.</Text>}

        <TextInput style={styles.input} placeholder="Notlar (isteğe bağlı)" value={notes} onChangeText={setNotes} />
      </View>
    );
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.modalContainer}>
        <Text style={styles.modalTitle}>Yeni Kayıt Ekle</Text>
        {renderForm()}
        <View style={styles.modalButtonContainer}>
          {loading ? <ActivityIndicator/> : <Button title="Kaydet" onPress={handleSave} />}
          <Button title="İptal" onPress={onClose} color="red" />
        </View>
      </ScrollView>
    </Modal>
  );
};


const TrackingScreen = () => {
  const {selectedBaby} = useBaby();
  const [logs, setLogs] = useState<AnyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('development');
  const [modalVisible, setModalVisible] = useState(false); // State for modal
  const isFocused = useIsFocused();

  useEffect(() => {
    // Firestore listener logic (from previous step)
    if (!selectedBaby || !isFocused) {
      if (!selectedBaby) setLoading(false);
      setLogs([]);
      return;
    }
    setLoading(true);
    // Corrected: Removed the incorrect Category[] type assertion
    const collections = ['developmentLogs', 'routineLogs', 'healthLogs'];
    const unsubscribers = collections.map(collectionName => {
      return firestore().collection('babies').doc(selectedBaby.id).collection(collectionName).orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const fetchedLogs: AnyLog[] = snapshot.docs.map(doc => ({ id: doc.id, category: collectionName.replace('Logs', '') as Category, ...doc.data() } as AnyLog));
          setLogs(prevLogs => {
            const otherLogs = prevLogs.filter(log => log.category !== collectionName.replace('Logs', ''));
            return [...otherLogs, ...fetchedLogs].sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis());
          });
          setLoading(false);
        }, error => {
          console.error(`Error fetching ${collectionName}:`, error);
          setLoading(false);
        });
    });
    return () => unsubscribers.forEach(unsub => unsub());
  }, [selectedBaby, isFocused]);

  const filteredLogs = useMemo(() => logs.filter(log => log.category === activeCategory), [logs, activeCategory]);

  const renderLogItem = ({item}: {item: AnyLog}) => (
    <View style={styles.logItem}>
      <Text style={styles.logType}>{item.type === 'doctor_visit' ? 'Doktor Ziyareti' : item.type.charAt(0).toUpperCase() + item.type.slice(1)}</Text>
      <Text style={styles.logValue}>
        {item.category === 'development' && `${item.value} ${item.type === 'weight' ? 'kg' : 'cm'}`}
        {item.category === 'routine' && `Süre: ${item.durationInMinutes} dk`}
        {item.category === 'health' && item.eventName}
      </Text>
      <Text style={styles.logDate}>{item.createdAt.toDate().toLocaleDateString()}</Text>
    </View>
  );

  const CategoryTabs = () => (
    <View style={styles.tabContainer}>
      {(['development', 'routine', 'health'] as Category[]).map(cat => (
        <TouchableOpacity key={cat} style={[styles.tab, activeCategory === cat && styles.tabActive]} onPress={() => setActiveCategory(cat)}>
          <Text style={styles.tabText}>{cat === 'development' ? 'Gelişim' : (cat === 'routine' ? 'Rutin' : 'Sağlık')}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (!selectedBaby) return <View style={styles.centered}><Text>Lütfen bir bebek seçin veya ekleyin.</Text></View>;
  if (loading && logs.length === 0) return <View style={styles.centered}><ActivityIndicator size="large" color="#e5d4f1" /><Text>Kayıtlar yükleniyor...</Text></View>;

  return (
    <View style={styles.container}>
      {selectedBaby && <AddLogModal visible={modalVisible} onClose={() => setModalVisible(false)} babyId={selectedBaby.id} />}
      <Text style={styles.header}>Takip Kayıtları: {selectedBaby.name}</Text>
      <CategoryTabs />
      {filteredLogs.length > 0 ? (
        <FlatList data={filteredLogs} renderItem={renderLogItem} keyExtractor={item => item.id} />
      ) : (
        <View style={styles.centered}><Text>Bu kategori için henüz kayıt yok.</Text></View>
      )}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container, Centered, Header, Tabs...
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', padding: 20, textAlign: 'center' },
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { padding: 10, borderRadius: 5 },
  tabActive: { backgroundColor: '#e5d4f1' },
  tabText: { fontWeight: 'bold' },
  logItem: { backgroundColor: '#fff', padding: 15, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  logType: { fontSize: 16, fontWeight: 'bold', flex: 1 },
  logValue: { fontSize: 14, color: '#333', flex: 1.5, textAlign: 'center' },
  logDate: { fontSize: 12, color: 'gray', flex: 1, textAlign: 'right' },
  // FAB styles
  fab: { position: 'absolute', width: 56, height: 56, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#6b9ac4', borderRadius: 28, elevation: 8 },
  fabIcon: { fontSize: 24, color: 'white' },
  // Modal styles
  modalContainer: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5},
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15, fontSize: 16 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginBottom: 50 },
});

export default TrackingScreen;
