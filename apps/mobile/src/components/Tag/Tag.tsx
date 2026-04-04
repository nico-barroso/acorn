import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Tag.styles';

interface TagProps {
  label: string;
}

export function Tag({ label }: TagProps) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}
