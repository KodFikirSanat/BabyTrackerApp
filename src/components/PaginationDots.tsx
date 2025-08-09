// src/components/PaginationDots.tsx

import React from 'react';
import {View, StyleSheet} from 'react-native';

interface PaginationDotsProps {
  count: number;
  activeIndex: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = ({count, activeIndex}) => {
  if (count <= 1) return null;

  return (
    <View style={styles.container}>
      {Array.from({length: count}).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === activeIndex && styles.activeDot]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
});

export default PaginationDots;

