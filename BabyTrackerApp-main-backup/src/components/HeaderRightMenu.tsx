// src/components/HeaderRightMenu.tsx

/**
 * @file A component that renders a three-dot menu icon in the header.
 * When pressed, it opens a small modal menu with options.
 *
 * @format
 */

import React, {useState} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Modal,
  Linking,
  StyleSheet,
  Pressable,
} from 'react-native';
import {Svg, Path} from 'react-native-svg';

// Simple three-dot icon
const ThreeDotsIcon = () => (
  <Svg width="24" height="24" viewBox="0 0 24 24">
    <Path
      d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
      fill="black"
    />
  </Svg>
);

const HeaderRightMenu = () => {
  const [menuVisible, setMenuVisible] = useState(false);

  const handleAboutPress = () => {
    setMenuVisible(false);
    Linking.openURL('https://github.com/KodFikirSanat/BabyTrackerApp').catch(
      err => console.error('An error occurred opening the link:', err),
    );
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        style={styles.iconContainer}>
        <ThreeDotsIcon />
      </TouchableOpacity>

      <Modal
        transparent={true}
        visible={menuVisible}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleAboutPress}>
              <Text style={styles.menuText}>About</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    marginRight: 15,
  },
  modalOverlay: {
    flex: 1,
  },
  menuContainer: {
    position: 'absolute',
    top: 50, // Adjust this based on header height
    right: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  menuText: {
    fontSize: 16,
    color: 'black',
  },
});

export default HeaderRightMenu;
