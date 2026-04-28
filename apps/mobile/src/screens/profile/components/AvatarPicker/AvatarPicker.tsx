import React from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from './AvatarPicker.styles';
import EditAvatarIcon from '@assets/icons/profile-exclamation-triangle.svg';

type AvatarPickerProps = {
  uri: string | null;
  onPress: () => void;
};

export function AvatarPicker({ uri, onPress }: AvatarPickerProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.avatarContainer}>
        {uri ? (
          <Image source={{ uri }} style={styles.avatar} resizeMode="cover" />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
      </View>
      <TouchableOpacity style={styles.editButton} onPress={onPress} activeOpacity={0.8}>
        <EditAvatarIcon width={24} height={24} />
      </TouchableOpacity>
    </View>
  );
}
