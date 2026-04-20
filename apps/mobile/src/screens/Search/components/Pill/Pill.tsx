import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { colors } from '../../../../theme/colors';
import { styles } from './Pill.styles';

type IconProps = {
  width?: number;
  height?: number;
  fill?: string;
  color?: string;
};

type PillProps = {
  label?: string;
  icon?: React.ComponentType<IconProps>;
  active: boolean;
  onPress: () => void;
  variant?: 'default' | 'filter';
};

export function Pill({ label, icon: Icon, active, onPress, variant = 'default' }: PillProps) {
  const isFilter = variant === 'filter';
  return (
    <TouchableOpacity
      style={[
        isFilter ? styles.pillFilter : styles.pill,
        active && (isFilter ? styles.pillFilterActive : styles.pillActive),
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {Icon && (
        <Icon width={14} height={14} fill="none" color={active ? colors.white : colors.brownMid} />
      )}
      {label ? (
        <Text
          style={[
            isFilter ? styles.pillFilterLabel : styles.pillLabel,
            active && (isFilter ? styles.pillFilterLabelActive : styles.pillLabelActive),
          ]}
        >
          {label}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}
