// src/screens/ProfileScreen.tsx

/**
 * @file ProfileScreen.tsx
 * @description This screen displays the user's profile information and provides
 *              actions such as logging out.
 *
 * @format
 */

import React, {useEffect, useMemo, useState} from 'react';
import {View, Text, Button, StyleSheet, Alert, ActivityIndicator, ScrollView} from 'react-native';
import {Svg, Path} from 'react-native-svg';
import {getAuth, signOut} from '@react-native-firebase/auth';
import {useAuth} from '../context/AuthContext';
import {ProfileScreenNavigationProps} from '../types/navigation';
import {useBaby} from '../context/BabyContext';
import {
  getFirestore,
  doc,
  collection,
  query,
  orderBy,
  limit as fsLimit,
  onSnapshot,
  FirebaseFirestoreTypes,
} from '@react-native-firebase/firestore';

/**
 * @name ProfileScreen
 * @description The main component for the user profile screen.
 * @param {ProfileScreenNavigationProps} props - The navigation props, correctly typed for nested navigation.
 * @returns {React.JSX.Element} A React Element representing the profile screen.
 */
const ProfileScreen = ({navigation}: ProfileScreenNavigationProps): React.JSX.Element => {
  console.log('👤✅ ProfileScreen: Component has mounted.');

  // --- Hooks ---
  const {user} = useAuth();
  const [loading, setLoading] = useState(false); // State to manage logout loading
  const {babies} = useBaby();

  // --- Recent Actions State ---
  type RecentAction = {
    id: string;
    babyId: string;
    babyName: string;
    category: 'development' | 'health' | 'routine';
    type?: string;
    createdAt?: FirebaseFirestoreTypes.Timestamp;
  };
  const [recentActions, setRecentActions] = useState<RecentAction[]>([]);
  const [recentLoading, setRecentLoading] = useState<boolean>(false);

  /**
   * @function handleAddBaby
   * @description Navigates the user to the AddBaby screen.
   */
  const handleAddBaby = () => {
    console.log('👤➡️ ProfileScreen.handleAddBaby: Navigating to AddBaby screen.');
    navigation.navigate('AddBaby');
  };
  
  /**
   * @function handleLogout
   * @description Handles the user logout process by calling Firebase Auth's signOut method.
   *              A loading state is used to prevent user interaction during the process.
   */
  const handleLogout = async () => {
    console.log(`👤➡️ ProfileScreen.handleLogout: Attempting to log out user: ${user?.email}`);
    setLoading(true); // Disable button
    try {
      const authInstance = getAuth();
      await signOut(authInstance);
      console.log('👤✅ ProfileScreen.handleLogout: User signed out successfully.');
      // Navigation is handled automatically by the AuthContext listener.
    } catch (error) {
      console.error('👤❌ ProfileScreen.handleLogout: Error signing out:', error);
      Alert.alert('Hata', 'Çıkış yapılırken bir sorun oluştu.');
    } finally {
      // This part will not be reached if logout is successful, as the component will unmount.
      // However, it is good practice for safety in case of errors.
      setLoading(false);
    }
  };

  /**
   * @function confirmLogout
   * @description Shows a confirmation dialog before signing out.
   */
  const confirmLogout = () => {
    Alert.alert(
      'Oturumdan çıkılacaktır',
      undefined,
      [
        {text: 'İptal', style: 'cancel'},
        {text: 'Onayla', style: 'destructive', onPress: handleLogout},
      ],
      {cancelable: true},
    );
  };

  // --- Effect: Subscribe to recent actions across user's babies ---
  useEffect(() => {
    // If there are no babies, clear and skip
    if (!babies || babies.length === 0) {
      setRecentActions([]);
      return;
    }

    setRecentLoading(true);
    const db = getFirestore();
    const categories: RecentAction['category'][] = ['development', 'health', 'routine'];

    // Create listeners per baby per category (keeps scope to user's data; avoids collectionGroup across all users)
    const unsubscribers: Array<() => void> = [];
    const latestPerBabyCategory: Record<string, RecentAction[]> = {};

    const attachListener = (babyId: string, babyName: string, category: RecentAction['category']) => {
      const q = query(
        collection(doc(db, 'babies', babyId), `${category}Logs`),
        orderBy('createdAt', 'desc'),
        fsLimit(5),
      );
      const unsub = onSnapshot(q, snapshot => {
        const actions: RecentAction[] = snapshot.docs.map(d => {
          const data = d.data() as any;
          return {
            id: d.id,
            babyId,
            babyName,
            category,
            type: data?.type ?? data?.eventName,
            createdAt: data?.createdAt,
          } as RecentAction;
        });
        latestPerBabyCategory[`${babyId}_${category}`] = actions;

        // Merge all buckets and sort by createdAt desc
        const merged = Object.values(latestPerBabyCategory).flat();
        merged.sort((a, b) => {
          const ta = a.createdAt?.toMillis?.() ?? 0;
          const tb = b.createdAt?.toMillis?.() ?? 0;
          return tb - ta;
        });
        // Keep only the latest 10 overall for UI brevity
        setRecentActions(merged.slice(0, 10));
        setRecentLoading(false);
      });
      unsubscribers.push(unsub);
    };

    for (const baby of babies) {
      for (const c of categories) {
        attachListener(baby.id, baby.name, c);
      }
    }

    return () => {
      unsubscribers.forEach(u => {
        try { u(); } catch {}
      });
    };
  }, [babies]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.profilePicCircle}>
          <Svg width="80" height="80" viewBox="0 0 24 24">
            <Path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="#a9a9a9"
            />
          </Svg>
        </View>
        <View style={styles.headerTextColumn}>
          <Text style={styles.title}>Profil</Text>
          {user ? (
            <Text style={styles.emailText}>{user.email}</Text>
          ) : (
            <Text style={styles.emailText}>Kullanıcı bilgisi bulunamadı.</Text>
          )}
        </View>
      </View>

      {/* Babies Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bebekler</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeaderRow]}>
            <Text style={[styles.tableCell, styles.tableHeaderCell, {flex: 2}]}>Bebek</Text>
            <Text style={[styles.tableCell, styles.tableHeaderCell, {flex: 2}]}>Kaydedilme Zamanı</Text>
          </View>
          {babies && babies.length > 0 ? (
            babies.map(b => {
              const createdAt = (b as any)?.createdAt as FirebaseFirestoreTypes.Timestamp | undefined;
              const createdAtText = createdAt?.toDate?.().toLocaleString?.('tr-TR') ?? '-';
              return (
                <View key={b.id} style={styles.tableRow}>
                  <Text style={[styles.tableCell, {flex: 2}]}>{b.name}</Text>
                  <Text style={[styles.tableCell, {flex: 2}]}>{createdAtText}</Text>
                </View>
              );
            })
          ) : (
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell, {flex: 1}]}>Henüz bebek yok</Text>
            </View>
          )}
        </View>
      </View>

      {/* Recent Actions Table */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Son İşlemler</Text>
        {recentLoading ? (
          <ActivityIndicator size="small" color="#6b9ac4" />
        ) : (
          <View style={styles.table}>
            <View style={[styles.tableRow, styles.tableHeaderRow]}>
              <Text style={[styles.tableCell, styles.tableHeaderCell, {flex: 2}]}>Bebek</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, {flex: 2}]}>İşlem</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, {flex: 1}]}>Kategori</Text>
              <Text style={[styles.tableCell, styles.tableHeaderCell, {flex: 2}]}>Tarih</Text>
            </View>
            {recentActions.length > 0 ? (
              recentActions.map(a => {
                const dateText = a.createdAt?.toDate?.().toLocaleString?.('tr-TR') ?? '-';
                return (
                  <View key={`${a.category}_${a.id}`} style={styles.tableRow}>
                    <Text style={[styles.tableCell, {flex: 2}]}>{a.babyName}</Text>
                    <Text style={[styles.tableCell, {flex: 2}]}>{a.type ?? '-'}</Text>
                    <Text style={[styles.tableCell, {flex: 1}]}>{a.category}</Text>
                    <Text style={[styles.tableCell, {flex: 2}]}>{dateText}</Text>
                  </View>
                );
              })
            ) : (
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, {flex: 1}]}>Kayıt yok</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <View style={styles.buttonWrapper}>
          <Button
            title="Bebek Ekle"
            onPress={handleAddBaby}
            disabled={loading}
          />
        </View>
        <View style={styles.buttonWrapper}>
          {loading ? (
            <ActivityIndicator size="large" color="#e74c3c" />
          ) : (
            <Button
              title="Çıkış Yap"
              onPress={confirmLogout}
              disabled={loading}
              color="#e74c3c"
            />
          )}
        </View>
      </View>
    </ScrollView>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profilePicCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#6b9ac4',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  headerTextColumn: {
    marginLeft: 16,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  emailText: {
    fontSize: 16,
    color: 'gray',
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  table: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tableHeaderRow: {
    backgroundColor: '#f1f5f9',
  },
  tableCell: {
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 24,
  },
  buttonWrapper: {
    marginBottom: 15, // Add space between buttons
  }
});

export default ProfileScreen;
