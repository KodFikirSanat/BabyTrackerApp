// src/screens/HomeScreen.tsx

/**
 * @file HomeScreen.tsx
 * @description This is the primary dashboard screen for the user after they are
 *              logged in and have a baby profile selected. It provides a summary
 *              and acts as a central hub. If no baby profile exists, it prompts
 *              the user to create one.
 *
 * @format
 */

import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Button,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, CompositeScreenProps} from '@react-navigation/native';
import type {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import {MainTabParamList, RootStackParamList} from '../types/navigation';
import {useBaby} from '../context/BabyContext';
import firestore from '@react-native-firebase/firestore';
import {AnyLog, DevelopmentLog, HealthLog, RoutineLog} from '../types/log';

/**
 * @type HomeScreenProps
 * @description Defines the navigation properties available to the HomeScreen.
 *              It's a composite type because this screen is part of a BottomTabNavigator
 *              which is nested inside a NativeStackNavigator. This gives it access to both
 *              `jumpTo` (from tabs) and `navigate` (from stack) functions.
 */
type HomeScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

/**
 * @name HomeScreen
 * @description The main component for the home screen.
 * @param {HomeScreenProps} props - The navigation props passed down from the navigator.
 * @returns {React.JSX.Element} A React Element representing the home screen.
 */
const HomeScreen = ({navigation}: HomeScreenProps): React.JSX.Element => {
  console.log('🏠✅ HomeScreen: Component has mounted.');

  // --- Hooks ---
  const {babies, selectedBaby, setSelectedBaby, loading} = useBaby();
  const [latestLogs, setLatestLogs] = useState<{[key: string]: AnyLog | null}>(
    {},
  );
  const [logLoading, setLogLoading] = useState(true);

  useEffect(() => {
    if (!selectedBaby) {
      return;
    }

    const fetchLatestLogs = async () => {
      console.log(
        `🏠⏳ HomeScreen: Fetching latest logs for baby: ${selectedBaby.id}`,
      );
      setLogLoading(true);
      try {
        const logPromises = [
          firestore()
            .collection('babies')
            .doc(selectedBaby.id)
            .collection('developmentLogs')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get(),
          firestore()
            .collection('babies')
            .doc(selectedBaby.id)
            .collection('routineLogs')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get(),
          firestore()
            .collection('babies')
            .doc(selectedBaby.id)
            .collection('healthLogs')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get(),
        ];

        const [devSnapshot, routineSnapshot, healthSnapshot] =
          await Promise.all(logPromises);

        const logs: {[key: string]: AnyLog | null} = {
          development: devSnapshot.empty
            ? null
            : ({
                id: devSnapshot.docs[0].id,
                ...devSnapshot.docs[0].data(),
              } as AnyLog),
          routine: routineSnapshot.empty
            ? null
            : ({
                id: routineSnapshot.docs[0].id,
                ...routineSnapshot.docs[0].data(),
              } as AnyLog),
          health: healthSnapshot.empty
            ? null
            : ({
                id: healthSnapshot.docs[0].id,
                ...healthSnapshot.docs[0].data(),
              } as AnyLog),
        };
        setLatestLogs(logs);
        console.log('🏠✅ HomeScreen: Successfully fetched latest logs.');
      } catch (error) {
        console.error('🏠❌ HomeScreen: Error fetching latest logs:', error);
      } finally {
        setLogLoading(false);
      }
    };

    fetchLatestLogs();
  }, [selectedBaby]);

  console.log(
    `🏠🎨 HomeScreen: State update. Loading: ${loading}, Selected Baby: ${
      selectedBaby?.name || 'none'
    }, Total Babies: ${babies.length}`,
  );

  // --- Components ---

  /**
   * Renders a horizontal list of babies that the user can switch between.
   */
  const BabySelector = () => {
    // Don't render the selector if there's only one baby or none.
    if (babies.length <= 1) {
      return null;
    }

    return (
      <View style={styles.selectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {babies.map(baby => (
            <TouchableOpacity
              key={baby.id}
              style={[
                styles.selectorItem,
                selectedBaby?.id === baby.id && styles.selectorItemActive,
              ]}
              onPress={() => {
                console.log(
                  `🏠➡️ HomeScreen: Baby '${baby.name}' selected from selector.`,
                );
                setSelectedBaby(baby);
              }}>
              <Text style={styles.selectorText}>{baby.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  // --- Conditional Rendering ---
  // While the baby data is being fetched, display a loading indicator.
  if (loading) {
    console.log('🏠⏳ HomeScreen: Baby data is loading...');
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#e5d4f1" />
        <Text>Bebek bilgileri yükleniyor...</Text>
      </View>
    );
  }

  // If there is no selected baby (which also implies no babies exist for the user),
  // render a welcome message and a button to add a new baby.
  if (!selectedBaby) {
    console.log('🏠🎨 HomeScreen: Rendering prompt for user to add a baby.');
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Hoş Geldiniz!</Text>
        <Text style={styles.subtitle}>
          Başlamak için lütfen bir bebek profili ekleyin.
        </Text>
        <Button
          title="Bebek Ekle"
          onPress={() => {
            console.log(
              "🏠➡️ HomeScreen: 'Bebek Ekle' button pressed. Navigating to AddBaby screen.",
            );
            // Navigate to the 'AddBaby' screen, which is part of the root stack.
            navigation.navigate('AddBaby');
          }}
        />
      </View>
    );
  }

  // If a baby is selected, render the main dashboard view.
  console.log(
    `🏠✅ HomeScreen: Displaying dashboard for baby: ${selectedBaby.name}.`,
  );

  /**
   * Formats a log item for display on a summary card.
   * @param {AnyLog | null} log - The log item to format.
   * @returns {{title: string, value: string, date: string}}
   */
  const formatLogForDisplay = (
    log: AnyLog | null,
    category: 'development' | 'routine' | 'health',
  ): {title: string; value: string; date: string} => {
    if (!log) {
      const titles = {
        development: 'Son Gelişim Kaydı',
        routine: 'Son Rutin Kaydı',
        health: 'Son Sağlık Kaydı',
      };
      return {
        title: titles[category],
        value: 'Henüz veri yok',
        date: '',
      };
    }

    const date = log.createdAt?.toDate().toLocaleDateString() || 'Bilinmiyor';
    let title = '';
    let value = '';

    switch (log.category) {
      case 'development':
        const devLog = log as DevelopmentLog;
        title = devLog.type === 'weight' ? 'Son Kilo' : 'Son Boy';
        value = `${devLog.value} ${devLog.type === 'weight' ? 'kg' : 'cm'}`;
        break;
      case 'routine':
        const routineLog = log as RoutineLog;
        const typeMap: {[key: string]: string} = {
          sleep: 'Son Uyku',
          feeding: 'Son Beslenme',
          diaper: 'Son Bez',
        };
        title = typeMap[routineLog.type] || 'Son Rutin';
        value = routineLog.notes || 'Detay yok';
        break;
      case 'health':
        const healthLog = log as HealthLog;
        title =
          healthLog.type === 'vaccination' ? 'Son Aşı' : 'Son Doktor Ziyareti';
        value = healthLog.eventName;
        break;
    }

    return {title, value, date};
  };

  const QuickAccessCard = ({
    title,
    value,
    date,
    onPress,
  }: {
    title: string;
    value: string;
    date: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardDate}>{date}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <BabySelector />
      <Text style={styles.title}>Hızlı Erişim</Text>
      <Text style={styles.subtitle}>
        {selectedBaby.name} için son aktiviteler
      </Text>

      {/* This is the main content area for the dashboard. */}
      {logLoading ? (
        <ActivityIndicator color="#e5d4f1" style={{marginTop: 20}} />
      ) : (
        <View style={styles.cardContainer}>
          <QuickAccessCard
            {...formatLogForDisplay(latestLogs.development, 'development')}
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'Tracking',
                params: {initialCategory: 'development'},
              })
            }
          />
          <QuickAccessCard
            {...formatLogForDisplay(latestLogs.routine, 'routine')}
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'Tracking',
                params: {initialCategory: 'routine'},
              })
            }
          />
          <QuickAccessCard
            {...formatLogForDisplay(latestLogs.health, 'health')}
            onPress={() =>
              navigation.navigate('MainTabs', {
                screen: 'Tracking',
                params: {initialCategory: 'health'},
              })
            }
          />
        </View>
      )}
    </View>
  );
};

// --- Styles ---
// Using StyleSheet.create for performance optimizations.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20, // Add margin to separate from selector
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
  // Baby Selector Styles
  selectorContainer: {
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  selectorItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectorItemActive: {
    backgroundColor: '#e5d4f1',
    borderColor: '#c3a1e1',
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  // Quick Access Card Styles
  cardContainer: {
    width: '100%',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: '#6b9ac4',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 8,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  cardDate: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'right',
  },
});

export default HomeScreen;
