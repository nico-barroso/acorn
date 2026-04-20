import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { styles } from './SectionButton.styles';
import UserIcon from '@assets/icons/profile-user-icon.svg';
import LockIcon from '@assets/icons/profile-password-icon.svg';
import LogOut from '@assets/icons/profile-logout-icon.svg';
import WarningIcon from '@assets/icons/profile-exclamation-triangle.svg';
import ChevronIcon from '@assets/icons/chevron-right.svg';

type IconVariant = 'user' | 'lock' | 'logOut' | 'warning';

const ICON_MAP: Record<IconVariant, React.FC<{ width?: number; height?: number }>> = {
  user: UserIcon,
  lock: LockIcon,
  logOut: LogOut,
  warning: WarningIcon,
};

interface SectionButtonProps {
  label: string;
  icon: IconVariant;
  onPress: () => void;
}

export default function SectionButton({ label, icon, onPress }: SectionButtonProps) {
  const Icon = ICON_MAP[icon];

  return (
    <TouchableOpacity style={styles.sectionButton} onPress={onPress}>
      <View style={styles.iconWrapper}>
        <Icon width={20} height={20} />
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.chevronWrapper}>
        <ChevronIcon width={20} height={20} />
      </View>
    </TouchableOpacity>
  );
}
