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
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

// Type definitions with corrected Timestamp type
type DevelopmentLog = { id: string; category: 'development'; type: 'weight' | 'height'; value: number; createdAt: FirebaseFirestoreTypes.Timestamp; };
type RoutineLog = { id: string; category: 'routine'; type: 'sleep' | 'feeding' | 'diaper'; startTime?: FirebaseFirestoreTypes.Timestamp; endTime?: FirebaseFirestoreTypes.Timestamp; durationInMinutes?: number; notes?: string; createdAt: FirebaseFirestoreTypes.Timestamp; };
type HealthLog = { id: string; category: 'health'; type: 'vaccination' | 'doctor_visit'; eventName: string; eventDate: FirebaseFirestoreTypes.Timestamp; notes?: string; createdAt: FirebaseFirestoreTypes.Timestamp; };
type AnyLog = DevelopmentLog | RoutineLog | HealthLog;
type Category = 'development' | 'routine' | 'health';

// Helper for translating log types
const typeTranslations: {[key: string]: string} = {
  weight: 'Kilo',
  height: 'Boy',
  sleep: 'Uyku',
  feeding: 'Beslenme',
  diaper: 'Bez',
  vaccination: 'Aşı',
  doctor_visit: 'Doktor Ziyareti',
};

/**
 * A modal component for adding or editing a log entry for a baby.
 * It contains a form that changes dynamically based on the selected log category.
 * @param {object} props - The component props.
 * @param {boolean} props.visible - Whether the modal is currently visible.
 * @param {() => void} props.onClose - Function to call when the modal should be closed.
 * @param {string} props.babyId - The ID of the baby to which the log will be added.
 * @returns {React.JSX.Element} The rendered modal component.
 */
const AddLogModal = ({ visible, onClose, babyId }: { visible: boolean; onClose: () => void; babyId: string; }) => {
  const [logCategory, setLogCategory] = useState<Category>('development');
  const [logType, setLogType] = useState('weight');
  const [logValue, setLogValue] = useState('');
  const [logEventName, setLogEventName] = useState('');
  const [logDate, setLogDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // JULES: Resets the log type when the category changes to prevent stale data.
  const handleCategoryChange = (newCategory: Category) => {
    setLogCategory(newCategory);
    if (newCategory === 'development') setLogType('weight');
    else if (newCategory === 'health') setLogType('vaccination');
    else if (newCategory === 'routine') setLogType('sleep'); // Default for routine
  };

  /**
   * Handles the validation and saving of the new log entry to Firestore.
   * It constructs the data object based on the form state and sends it
   * to the appropriate subcollection.
   */
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
      console.log(`📈➡️ TrackingScreen: Saving log to babies/${babyId}/${collectionName}...`);
      await firestore().collection('babies').doc(babyId).collection(collectionName).add(data);
      Alert.alert('Başarılı', 'Kayıt başarıyla eklendi.');
      onClose(); // Close modal on success
    } catch (error) {
      console.error('📈❌ TrackingScreen: Error saving log:', error);
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
            <TouchableOpacity key={cat} style={[styles.tab, logCategory === cat && styles.tabActive]} onPress={() => handleCategoryChange(cat)}>
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
             {showDatePicker && <DateTimePicker value={logDate} mode="date" display="default" onChange={(event: DateTimePickerEvent, date?: Date) => {setShowDatePicker(Platform.OS === 'ios'); setLogDate(date||logDate);}} />}
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


/**
 * The main screen for tracking a baby's activities and development.
 * It displays logs categorized by type (Development, Routine, Health)
 * and allows users to add new entries via a modal.
 * @returns {React.JSX.Element} The rendered tracking screen component.
 */
const TrackingScreen = () => {
  useEffect(() => {
    console.log('📈✅ TrackingScreen: Component has mounted.');
  }, []);

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
    console.log(`📈⏳ TrackingScreen: Subscribing to Firestore logs for baby ID: ${selectedBaby.id}`);
    // Corrected: Removed the incorrect Category[] type assertion
    const collections = ['developmentLogs', 'routineLogs', 'healthLogs'];
    const unsubscribers = collections.map(collectionName => {
      return firestore().collection('babies').doc(selectedBaby.id).collection(collectionName).orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          console.log(`📈✅ TrackingScreen: Received update from ${collectionName}.`);
          const fetchedLogs: AnyLog[] = snapshot.docs.map(doc => ({ id: doc.id, category: collectionName.replace('Logs', '') as Category, ...doc.data() } as AnyLog));
          setLogs(prevLogs => {
            const otherLogs = prevLogs.filter(log => log.category !== collectionName.replace('Logs', ''));
            // JULES: Added null-safe sorting to prevent crashes from pending server timestamps.
            // When a new log is created, `createdAt` can be temporarily null in the local snapshot.
            return [...otherLogs, ...fetchedLogs].sort((a, b) => {
              const timeA = a.createdAt?.toMillis() || 0;
              const timeB = b.createdAt?.toMillis() || 0;
              return timeB - timeA;
            });
          });
          setLoading(false);
        }, error => {
          console.error(`📈❌ TrackingScreen: Error fetching ${collectionName}:`, error);
          setLoading(false);
        });
    });
    return () => {
      console.log(`📈🧹 TrackingScreen: Unsubscribing from Firestore listeners.`);
      unsubscribers.forEach(unsub => unsub());
    };
  }, [selectedBaby, isFocused]);

  const filteredLogs = useMemo(() => logs.filter(log => log.category === activeCategory), [logs, activeCategory]);

  /**
   * Renders a single log item in the FlatList.
   * It formats the log data based on its category and type.
   * @param {object} props - The props object from FlatList.
   * @param {AnyLog} props.item - The log item to render.
   * @returns {React.JSX.Element} The rendered list item.
   */
  const renderLogItem = ({item}: {item: AnyLog}) => {
    const renderContent = () => {
      switch (item.category) {
        case 'development':
          return <Text style={styles.logValue}>{`${item.value} ${item.type === 'weight' ? 'kg' : 'cm'}`}</Text>;
        case 'routine':
          // JULES: Added check for durationInMinutes to prevent "undefined dk"
          if (typeof item.durationInMinutes === 'number') {
            return <Text style={styles.logValue}>{`Süre: ${item.durationInMinutes} dk`}</Text>;
          }
          return null; // Don't render anything if duration is not available
        case 'health':
          return <Text style={styles.logValue}>{item.eventName}</Text>;
        default:
          return null;
      }
    };

    return (
      <View style={styles.logItem}>
        <View style={{flex: 1}}>
          <Text style={styles.logType}>{typeTranslations[item.type] || item.type}</Text>
          {item.notes ? <Text style={styles.logNotes}>{item.notes}</Text> : null}
        </View>
        <View style={{flex: 1.5, alignItems: 'center'}}>{renderContent()}</View>
        <Text style={styles.logDate}>{item.createdAt?.toDate().toLocaleDateString()}</Text>
      </View>
    );
  };

  /**
   * Renders the category selection tabs (Development, Routine, Health).
   * @returns {React.JSX.Element} The rendered tab container.
   */
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
  logType: { fontSize: 16, fontWeight: 'bold' },
  logNotes: { fontSize: 12, color: 'gray', fontStyle: 'italic', marginTop: 4 },
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
