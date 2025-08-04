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
  Pressable, // JULES: Added Pressable for the new selector
} from 'react-native';
import firestore, {
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';
import {useBaby, Baby} from '../context/BabyContext'; // JULES: Import Baby type
import {useIsFocused, useRoute, RouteProp} from '@react-navigation/native'; // JULES: Added useRoute
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {MainTabParamList} from '../types/navigation'; // JULES: To type the route

// Type definitions
type DevelopmentLog = {id: string; category: 'development'; type: 'weight' | 'height'; value: number; createdAt: FirebaseFirestoreTypes.Timestamp;};
type RoutineLog = {id:string; category: 'routine'; type: 'sleep' | 'feeding' | 'diaper'; startTime?: FirebaseFirestoreTypes.Timestamp; endTime?: FirebaseFirestoreTypes.Timestamp; durationInMinutes?: number; notes?: string; createdAt: FirebaseFirestoreTypes.Timestamp;};
type HealthLog = {id: string; category: 'health'; type: 'vaccination' | 'doctor_visit'; eventName: string; eventDate: FirebaseFirestoreTypes.Timestamp; notes?: string; createdAt: FirebaseFirestoreTypes.Timestamp;};
type AnyLog = DevelopmentLog | RoutineLog | HealthLog;
type Category = 'development' | 'routine' | 'health';

const typeTranslations: {[key: string]: string} = {
  weight: 'Kilo', height: 'Boy', sleep: 'Uyku', feeding: 'Beslenme',
  diaper: 'Bez', vaccination: 'Aşı', doctor_visit: 'Doktor Ziyareti',
};

// JULES: START - Created a new modal component for baby selection
const BabySelectorModal = ({
  visible,
  onClose,
  babies,
  onSelectBaby,
}: {
  visible: boolean;
  onClose: () => void;
  babies: Baby[];
  onSelectBaby: (baby: Baby) => void;
}) => (
  <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onClose}>
    <Pressable style={styles.modalOverlay} onPress={onClose}>
      <View style={styles.selectorModalContainer}>
        <Text style={styles.selectorTitle}>Bebek Seç</Text>
        <FlatList
          data={babies}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity style={styles.selectorItem} onPress={() => onSelectBaby(item)}>
              <Text style={styles.selectorItemText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </Pressable>
  </Modal>
);
// JULES: END - BabySelectorModal

const AddLogModal = ({visible, onClose, babyId}: {visible: boolean; onClose: () => void; babyId: string;}) => {
  const [logCategory, setLogCategory] = useState<Category>('development');
  const [logType, setLogType] = useState('weight');
  const [logValue, setLogValue] = useState('');
  const [logEventName, setLogEventName] = useState('');
  const [logDate, setLogDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCategoryChange = (newCategory: Category) => {
    setLogCategory(newCategory);
    if (newCategory === 'development') setLogType('weight');
    else if (newCategory === 'health') setLogType('vaccination');
    else if (newCategory === 'routine') setLogType('sleep');
  };

  const handleSave = async () => {
    if (!babyId) {
      Alert.alert('Hata', 'Lütfen önce bir bebek seçin.');
      return;
    }
    setLoading(true);
    let data: any = {type: logType, createdAt: firestore.FieldValue.serverTimestamp(), notes: notes};
    let collectionName = `${logCategory}Logs`;

    if (logCategory === 'development') {
      if (!logValue) { Alert.alert('Hata', 'Lütfen bir değer girin (kg veya cm).'); setLoading(false); return; }
      data.value = parseFloat(logValue);
    } else if (logCategory === 'health') {
      if (!logEventName) { Alert.alert('Hata', 'Lütfen olay adını girin (örn: KPA Aşısı).'); setLoading(false); return; }
      data.eventName = logEventName;
      data.eventDate = firestore.Timestamp.fromDate(logDate);
    }

    try {
      await firestore().collection('babies').doc(babyId).collection(collectionName).add(data);
      Alert.alert('Başarılı', 'Kayıt başarıyla eklendi.');
      onClose();
    } catch (error) {
      console.error('📈❌ TrackingScreen: Error saving log:', error);
      Alert.alert('Hata', 'Kayıt eklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => (
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
          {showDatePicker && <DateTimePicker value={logDate} mode="date" display="default" onChange={(event: DateTimePickerEvent, date?: Date) => { setShowDatePicker(Platform.OS === 'ios'); setLogDate(date || logDate); }} />}
        </>
      )}
      {logCategory === 'routine' && <Text style={{textAlign: 'center', margin: 20}}>Rutin takibi yakında eklenecektir.</Text>}
      <TextInput style={styles.input} placeholder="Notlar (isteğe bağlı)" value={notes} onChangeText={setNotes} />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <ScrollView style={styles.modalContainer}><Text style={styles.modalTitle}>Yeni Kayıt Ekle</Text>{renderForm()}
        <View style={styles.modalButtonContainer}>
          {loading ? <ActivityIndicator /> : <Button title="Kaydet" onPress={handleSave} />}
          <Button title="İptal" onPress={onClose} color="red" />
        </View>
      </ScrollView>
    </Modal>
  );
};

const TrackingScreen = () => {
  // JULES: START - State Management and Initialization
  const {babies, selectedBaby: globalSelectedBaby, loading: babiesLoading} = useBaby();
  const route = useRoute<RouteProp<MainTabParamList, 'Tracking'>>();
  const [currentBaby, setCurrentBaby] = useState<Baby | null>(null);
  const [logs, setLogs] = useState<AnyLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>('development');
  const [addLogModalVisible, setAddLogModalVisible] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (babies.length > 0) {
      const babyIdFromParams = route.params?.babyId;
      let babyToSelect: Baby | null = null;
      if (babyIdFromParams) {
        babyToSelect = babies.find(b => b.id === babyIdFromParams) || null;
      }
      if (!babyToSelect) {
        babyToSelect = globalSelectedBaby || babies[0];
      }
      setCurrentBaby(babyToSelect);
    } else {
      setCurrentBaby(null);
    }
  }, [babies, globalSelectedBaby, route.params?.babyId]);
  // JULES: END - State Management and Initialization

  // JULES: Modified to depend on local `currentBaby` instead of global `selectedBaby`
  useEffect(() => {
    if (!currentBaby || !isFocused) {
      if (!currentBaby) setLogsLoading(false);
      setLogs([]);
      return;
    }
    setLogsLoading(true);
    const collections = ['developmentLogs', 'routineLogs', 'healthLogs'];
    const unsubscribers = collections.map(collectionName => {
      return firestore().collection('babies').doc(currentBaby.id).collection(collectionName).orderBy('createdAt', 'desc')
        .onSnapshot(snapshot => {
          const fetchedLogs: AnyLog[] = snapshot.docs.map(doc => ({id: doc.id, category: collectionName.replace('Logs', '') as Category, ...doc.data()} as AnyLog));
          setLogs(prevLogs => {
            const otherLogs = prevLogs.filter(log => log.category !== collectionName.replace('Logs', ''));
            return [...otherLogs, ...fetchedLogs].sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0));
          });
          setLogsLoading(false);
        }, error => {
          console.error(`📈❌ TrackingScreen: Error fetching ${collectionName}:`, error);
          setLogsLoading(false);
        });
    });
    return () => unsubscribers.forEach(unsub => unsub());
  }, [currentBaby, isFocused]);

  const filteredLogs = useMemo(() => logs.filter(log => log.category === activeCategory), [logs, activeCategory]);

  const handleSelectBaby = (baby: Baby) => {
    setCurrentBaby(baby);
    setPickerVisible(false);
  };

  const renderLogItem = ({item}: {item: AnyLog}) => {
    const renderContent = () => {
      switch (item.category) {
        case 'development': return <Text style={styles.logValue}>{`${item.value} ${item.type === 'weight' ? 'kg' : 'cm'}`}</Text>;
        case 'routine': return typeof item.durationInMinutes === 'number' ? <Text style={styles.logValue}>{`Süre: ${item.durationInMinutes} dk`}</Text> : null;
        case 'health': return <Text style={styles.logValue}>{item.eventName}</Text>;
        default: return null;
      }
    };
    return (
      <View style={styles.logItem}>
        <View style={{flex: 1}}><Text style={styles.logType}>{typeTranslations[item.type] || item.type}</Text>{item.notes ? <Text style={styles.logNotes}>{item.notes}</Text> : null}</View>
        <View style={{flex: 1.5, alignItems: 'center'}}>{renderContent()}</View>
        <Text style={styles.logDate}>{item.createdAt?.toDate().toLocaleDateString()}</Text>
      </View>
    );
  };

  const CategoryTabs = () => (
    <View style={styles.tabContainer}>
      {(['development', 'routine', 'health'] as Category[]).map(cat => (
        <TouchableOpacity key={cat} style={[styles.tab, activeCategory === cat && styles.tabActive]} onPress={() => setActiveCategory(cat)}>
          <Text style={styles.tabText}>{cat === 'development' ? 'Gelişim' : (cat === 'routine' ? 'Rutin' : 'Sağlık')}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (babiesLoading) return <View style={styles.centered}><ActivityIndicator size="large" color="#e5d4f1" /><Text>Bebekler yükleniyor...</Text></View>;
  if (!currentBaby) return <View style={styles.centered}><Text>Lütfen bir bebek seçin veya ekleyin.</Text></View>;

  return (
    <View style={styles.container}>
      <BabySelectorModal visible={pickerVisible} onClose={() => setPickerVisible(false)} babies={babies} onSelectBaby={handleSelectBaby} />
      <AddLogModal visible={addLogModalVisible} onClose={() => setAddLogModalVisible(false)} babyId={currentBaby.id} />

      {/* JULES: Replaced static header with pressable selector */}
      <Pressable style={styles.headerContainer} onPress={() => setPickerVisible(true)}>
        <Text style={styles.header}>{currentBaby.name}'s Tracking Data</Text>
        <Text style={styles.headerCaret}>▼</Text>
      </Pressable>

      <CategoryTabs />
      {logsLoading && logs.length === 0 ? (
         <View style={styles.centered}><ActivityIndicator size="large" color="#e5d4f1" /><Text>Kayıtlar yükleniyor...</Text></View>
      ) : filteredLogs.length > 0 ? (
        <FlatList data={filteredLogs} renderItem={renderLogItem} keyExtractor={item => item.id} />
      ) : (
        <View style={styles.centered}><Text>Bu kategori için henüz kayıt yok.</Text></View>
      )}
      <TouchableOpacity style={styles.fab} onPress={() => setAddLogModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  headerContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }, // JULES: Style for selector
  header: { fontSize: 22, fontWeight: 'bold', textAlign: 'center' },
  headerCaret: { fontSize: 16, marginLeft: 10 }, // JULES: Style for selector caret
  tabContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
  tab: { padding: 10, borderRadius: 5 },
  tabActive: { backgroundColor: '#e5d4f1' },
  tabText: { fontWeight: 'bold' },
  logItem: { backgroundColor: '#fff', padding: 15, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  logType: { fontSize: 16, fontWeight: 'bold' },
  logNotes: { fontSize: 12, color: 'gray', fontStyle: 'italic', marginTop: 4 },
  logValue: { fontSize: 14, color: '#333', flex: 1.5, textAlign: 'center' },
  logDate: { fontSize: 12, color: 'gray', flex: 1, textAlign: 'right' },
  fab: { position: 'absolute', width: 56, height: 56, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#6b9ac4', borderRadius: 28, elevation: 8 },
  fabIcon: { fontSize: 24, color: 'white' },
  modalContainer: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  modalTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5},
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15, fontSize: 16 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginBottom: 50 },
  // JULES: START - Styles for Baby Selector Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  selectorModalContainer: { backgroundColor: 'white', borderRadius: 10, padding: 20, width: '80%', maxHeight: '60%' },
  selectorTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  selectorItem: { paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#eee' },
  selectorItemText: { fontSize: 18, textAlign: 'center' },
  // JULES: END - Styles for Baby Selector Modal
});

export default TrackingScreen;
