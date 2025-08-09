// src/screens/TrackingScreen.tsx

/**
 * @file Defines the TrackingScreen, for logging and viewing a baby's activities.
 * It includes a baby selector to switch between different baby profiles.
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
  Pressable, // NEW: For the baby selector modal
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useBaby, Baby} from '../context/BabyContext';
import {useIsFocused, useRoute, RouteProp} from '@react-navigation/native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {AnyLog, Category} from '../types/log';
import {MainTabParamList} from '../types/navigation';
import {Svg, Path} from 'react-native-svg'; // NEW: For the dropdown icon

// --- Helper Components & Constants ---

// NEW: A simple chevron down icon for the baby selector
const DropdownIcon = () => (
  <Svg width="20" height="20" viewBox="0 0 24 24">
    <Path d="M7 10l5 5 5-5z" fill="#6b9ac4" />
  </Svg>
);

const typeTranslations: {[key: string]: string} = {
  weight: 'Kilo',
  height: 'Boy',
  sleep: 'Uyku',
  feeding: 'Beslenme',
  diaper: 'Bez',
  vaccination: 'Aşı',
  doctor_visit: 'Doktor Ziyareti',
};

// --- Main Components ---

const AddLogModal = ({
  visible,
  onClose,
  babyId,
}: {
  visible: boolean;
  onClose: () => void;
  babyId: string;
}) => {
  // ... (This component's code remains unchanged from the original file)
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
    setLoading(true);
    let data: any = {
      type: logType,
      createdAt: firestore.FieldValue.serverTimestamp(),
      notes: notes,
    };
    let collectionName = `${logCategory}Logs`;

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

    try {
      console.log(`📈➡️ Saving log to babies/${babyId}/${collectionName}...`);
      await firestore().collection('babies').doc(babyId).collection(collectionName).add(data);
      Alert.alert('Başarılı', 'Kayıt başarıyla eklendi.');
      onClose();
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

type TrackingScreenRouteProp = RouteProp<MainTabParamList, 'Tracking'>;

const TrackingScreen = () => {
  const {babies, selectedBaby: globalSelectedBaby} = useBaby();
  const route = useRoute<TrackingScreenRouteProp>();
  const isFocused = useIsFocused();

  // NEW: Local state to manage the baby currently being viewed on this screen
  const [currentBaby, setCurrentBaby] = useState<Baby | null>(null);
  const [isBabySelectorVisible, setBabySelectorVisible] = useState(false);

  const [logs, setLogs] = useState<AnyLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<Category>(
    route.params?.initialCategory || 'development',
  );
  const [modalVisible, setModalVisible] = useState(false);

  // NEW: Effect to set the initial baby for the screen.
  // It prioritizes the navigation parameter, then the global context, then the first baby in the list.
  useEffect(() => {
    const babyIdFromParams = route.params?.babyId;
    if (babyIdFromParams) {
      const foundBaby = babies.find(b => b.id === babyIdFromParams);
      setCurrentBaby(foundBaby || null);
    } else if (globalSelectedBaby) {
      setCurrentBaby(globalSelectedBaby);
    } else if (babies.length > 0) {
      setCurrentBaby(babies[0]);
    } else {
      setCurrentBaby(null);
    }
  }, [route.params, babies, globalSelectedBaby]);

  // NEW: Effect to fetch logs when the locally selected baby changes.
  useEffect(() => {
    if (!currentBaby || !isFocused) {
      if (!currentBaby) setLoading(false);
      setLogs([]);
      return;
    }
    setLoading(true);
    console.log(`📈⏳ Subscribing to logs for local baby ID: ${currentBaby.id}`);
    const collections = ['developmentLogs', 'routineLogs', 'healthLogs'];
    const unsubscribers = collections.map(collectionName => {
      return firestore()
        .collection('babies')
        .doc(currentBaby.id)
        .collection(collectionName)
        .orderBy('createdAt', 'desc')
        .onSnapshot(
          snapshot => {
            console.log(`📈✅ Received update from ${collectionName}.`);
            const fetchedLogs: AnyLog[] = snapshot.docs.map(doc => ({
              id: doc.id,
              category: collectionName.replace('Logs', '') as Category,
              ...doc.data(),
            } as AnyLog));
            setLogs(prevLogs => {
              const otherLogs = prevLogs.filter(
                log => log.category !== collectionName.replace('Logs', ''),
              );
              return [...otherLogs, ...fetchedLogs].sort((a, b) => {
                const timeA = a.createdAt?.toMillis() || 0;
                const timeB = b.createdAt?.toMillis() || 0;
                return timeB - timeA;
              });
            });
            setLoading(false);
          },
          error => {
            console.error(`📈❌ Error fetching ${collectionName}:`, error);
            setLoading(false);
          },
        );
    });
    return () => {
      console.log(`📈🧹 Unsubscribing from Firestore listeners.`);
      unsubscribers.forEach(unsub => unsub());
    };
  }, [currentBaby, isFocused]);

  const filteredLogs = useMemo(
    () => logs.filter(log => log.category === activeCategory),
    [logs, activeCategory],
  );

  const showLogDetails = (item: AnyLog) => {
    const title = typeTranslations[item.type] || item.type;
    const createdAtStr = item.createdAt?.toDate().toLocaleString() || '';
    let message = '';
    if (item.category === 'development') {
      message += `Değer: ${item.value} ${item.type === 'weight' ? 'kg' : 'cm'}`;
    } else if (item.category === 'routine') {
      if (typeof item.durationInMinutes === 'number') {
        message += `Süre: ${item.durationInMinutes} dk`;
      }
    } else if (item.category === 'health') {
      message += `Olay: ${item.eventName}`;
    }
    if (item.notes) {
      message += `\nNot: ${item.notes}`;
    }
    if (createdAtStr) {
      message += `\nKayıt Tarihi: ${createdAtStr}`;
    }
    Alert.alert(title, message || 'Detay bulunamadı');
  };

  const renderLogItem = ({item}: {item: AnyLog}) => {
    const middleCell = (() => {
      switch (item.category) {
        case 'development':
          return `${item.value} ${item.type === 'weight' ? 'kg' : 'cm'}`;
        case 'routine':
          return typeof item.durationInMinutes === 'number'
            ? `${item.durationInMinutes} dk`
            : '';
        case 'health':
          return item.eventName;
        default:
          return '';
      }
    })();

    return (
      <Pressable style={styles.tableRow} onPress={() => showLogDetails(item)}>
        <Text style={[styles.cellType]} numberOfLines={1}>
          {typeTranslations[item.type] || item.type}
        </Text>
        <Text style={[styles.cellValue]} numberOfLines={1}>{middleCell}</Text>
        <Text style={[styles.cellDate]} numberOfLines={1}>
          {item.createdAt?.toDate().toLocaleDateString()}
        </Text>
      </Pressable>
    );
  };

  const CategoryTabs = () => (
    <View style={styles.tabContainer}>
      {(['development', 'routine', 'health'] as Category[]).map(cat => (
        <TouchableOpacity
          key={cat}
          style={[styles.tab, activeCategory === cat && styles.tabActive]}
          onPress={() => setActiveCategory(cat)}>
          <Text style={styles.tabText}>
            {cat === 'development' ? 'Gelişim' : cat === 'routine' ? 'Rutin' : 'Sağlık'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  // NEW: Baby Selector Modal
  const BabySelectorModal = () => (
    <Modal
      transparent={true}
      visible={isBabySelectorVisible}
      onRequestClose={() => setBabySelectorVisible(false)}
      animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={() => setBabySelectorVisible(false)}>
        <View style={styles.selectorMenu}>
          {babies.map(baby => (
            <TouchableOpacity
              key={baby.id}
              style={styles.selectorItem}
              onPress={() => {
                setCurrentBaby(baby);
                setBabySelectorVisible(false);
              }}>
              <Text style={styles.selectorText}>{baby.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );

  if (!currentBaby) {
    return (
      <View style={styles.centered}>
        <Text>Lütfen bir bebek seçin veya ekleyin.</Text>
      </View>
    );
  }

  if (loading && logs.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e5d4f1" />
        <Text>Kayıtlar yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {currentBaby && (
        <AddLogModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          babyId={currentBaby.id}
        />
      )}
      <BabySelectorModal />

      {/* NEW: Pressable Header to open baby selector */}
      <TouchableOpacity
        style={styles.headerContainer}
        onPress={() => setBabySelectorVisible(true)}>
        <Text style={styles.header}>{currentBaby.name} Bilgileri: </Text>
        <DropdownIcon />
      </TouchableOpacity>
      
      <CategoryTabs />
      {filteredLogs.length > 0 ? (
        <FlatList
          data={filteredLogs}
          renderItem={renderLogItem}
          keyExtractor={item => item.id}
          ListHeaderComponent={() => (
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCellType]}>Tür</Text>
              <Text style={[styles.headerCellValue]}>
                {activeCategory === 'development'
                  ? 'Değer'
                  : activeCategory === 'routine'
                  ? 'Süre'
                  : 'Olay'}
              </Text>
              <Text style={[styles.headerCellDate]}>Tarih</Text>
            </View>
          )}
          stickyHeaderIndices={[0]}
        />
      ) : (
        <View style={styles.centered}>
          <Text>Bu kategori için henüz kayıt yok.</Text>
        </View>
      )}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  // --- Existing styles are preserved ---
  container: {flex: 1, backgroundColor: '#f8f9fa'},
  centered: {flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20},
  header: {fontSize: 22, fontWeight: 'bold', paddingVertical: 20, paddingHorizontal: 10},
  tabContainer: {flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee'},
  tab: {padding: 10, borderRadius: 5},
  tabActive: {backgroundColor: '#e5d4f1'},
  tabText: {fontWeight: 'bold'},
    // Old card styles (kept for reference, not used by table)
    logItem: {backgroundColor: '#fff', padding: 15, marginVertical: 8, marginHorizontal: 16, borderRadius: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 1.41},
    logType: {fontSize: 16, fontWeight: 'bold'},
    logNotes: {fontSize: 12, color: 'gray', fontStyle: 'italic', marginTop: 4},
    logValue: {fontSize: 14, color: '#333', flex: 1.5, textAlign: 'center'},
    logDate: {fontSize: 12, color: 'gray', flex: 1, textAlign: 'right'},

    // Table styles
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
      paddingVertical: 10,
      paddingHorizontal: 16,
    },
    headerCellType: {flex: 1, fontWeight: 'bold'},
    headerCellValue: {flex: 1.5, textAlign: 'center', fontWeight: 'bold'},
    headerCellDate: {flex: 1, textAlign: 'right', fontWeight: 'bold'},
    tableRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#fff',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
    },
    cellType: {flex: 1, fontSize: 14, color: '#333'},
    cellValue: {flex: 1.5, fontSize: 14, color: '#333', textAlign: 'center'},
    cellDate: {flex: 1, fontSize: 12, color: 'gray', textAlign: 'right'},
  fab: {position: 'absolute', width: 56, height: 56, alignItems: 'center', justifyContent: 'center', right: 20, bottom: 20, backgroundColor: '#6b9ac4', borderRadius: 28, elevation: 8},
  fabIcon: {fontSize: 24, color: 'white'},
  modalContainer: {flex: 1, paddingTop: 40, paddingHorizontal: 20},
  modalTitle: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'},
  modalLabel: {fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5},
  input: {borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginBottom: 15, fontSize: 16},
  modalButtonContainer: {flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginBottom: 50},
  
  // --- NEW styles for Baby Selector ---
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10, // Adjusted padding
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  selectorMenu: {
    marginTop: 100, // Position it below the header area
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    elevation: 5,
  },
  selectorItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectorText: {
    textAlign: 'center',
    fontSize: 18,
  },
});

export default TrackingScreen;
