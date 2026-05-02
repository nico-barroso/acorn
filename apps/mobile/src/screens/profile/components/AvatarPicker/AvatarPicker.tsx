import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from './AvatarPicker.styles';
import EditAvatarIcon from '@/assets/icons/change-avatar.svg';

const defaultAvatar = require('@/assets/default-avatar.png');

type AvatarPickerProps = {
  uri: string | null;
  onPress: () => void;
};

export function AvatarPicker({ uri, onPress }: AvatarPickerProps) {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity style={styles.avatarContainer} onPress={onPress} activeOpacity={0.8}>
        <Image
          source={uri ? { uri } : defaultAvatar}
          style={styles.avatar}
          resizeMode="cover"
        />
      </TouchableOpacity>
      <View style={styles.editButton} pointerEvents="none">
        <EditAvatarIcon width={28} height={28} />
      </View>
    </View>
  );
}
