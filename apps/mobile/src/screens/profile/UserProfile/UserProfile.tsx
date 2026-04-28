import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

import { Button } from '@components/Button/Button';
import { Input } from '@components/Input/Input';
import { ProfileHeader } from '@components/ProfileHeader/ProfileHeader';
import { AvatarPicker } from '../components/AvatarPicker/AvatarPicker';
import { useEditProfile } from '../hooks/useEditProfile';
import { styles } from './UserProfile.styles';

type EditProfileScreenProps = {
  onGoBack: () => void;
};

export default function EditProfileScreen({ onGoBack }: EditProfileScreenProps) {
  const {
    name,
    handleNameChange,
    handleNameBlur,
    email,
    setEmail,
    avatarUri,
    setAvatarUri,
    errors,
    loading,
    handleSave,
  } = useEditProfile();

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    console.log('[Avatar] ImagePicker result:', JSON.stringify(result));
    if (!result.canceled) {
      console.log('[Avatar] Selected URI:', result.assets[0].uri);
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoid}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ProfileHeader title="Mi perfil" onBack={onGoBack} />

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <AvatarPicker uri={avatarUri} onPress={handlePickAvatar} />

          <View style={styles.form}>
            <Input
              label="Nombre"
              value={name}
              onChangeText={handleNameChange}
              onBlur={handleNameBlur}
              error={errors.name}
              placeholder="Tu nombre"
            />

            <Input
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              error={errors.email}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <Button
            label={loading ? 'Guardando...' : 'Guardar cambios'}
            onPress={handleSave}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
