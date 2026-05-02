import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './Tag.styles';
import { colors } from '@/theme/colors';

interface TagProps {
  label: string;
  color?: string | null;
}

export function Tag({ label, color }: TagProps) {
  return (
    <View style={[styles.tag, { backgroundColor: color ?? colors.brownMid }]}>
      <Text style={styles.tagText}>{label}</Text>
    </View>
  );
}
