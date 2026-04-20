import React, { useEffect } from 'react';
import { View, Text, Image, ScrollView, ImageBackground } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from './ProfileScreen.styles';
import SectionButton from '../components/SectionButton/SectionButton';
import { supabase } from '@lib/supabase';

type ProfileScreenProps = {
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
  onEditProfile?: () => void;
  onChangePassword?: () => void;
};

export default function ProfileScreen({
  userName = '',
  userEmail = '',
  avatarUrl,
  onEditProfile = () => {},
  onChangePassword = () => {},
}: ProfileScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [userData, setUserData] = React.useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const fullName = user.user_metadata?.full_name;
      setUserData({
        name:
          typeof fullName === 'string' && fullName.trim()
            ? fullName.trim()
            : (user.email ?? 'Usuario'),
        email: user.email ?? '',
      });
    };

    void loadUser();
  }, []);

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 30 }]}>
          <ImageBackground
            source={require('../assets/profile-header-top.webp')}
            style={styles.headerBackgroundTop}
          />
          <ImageBackground
            source={require('../assets/profile-header-bottom.webp')}
            style={styles.headerBackgroundBottom}
            resizeMode="stretch"
          />

          <View style={styles.avatarContainer}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={styles.avatar} />
            ) : (
              <Image source={require('@assets/default-avatar.png')} style={styles.avatar} />
            )}
          </View>
          <Text style={styles.userName}>{userData?.name ?? userName}</Text>
          <Text style={styles.userEmail}>{userData?.email ?? userEmail}</Text>
        </View>

        {/* Secciones */}
        <View style={styles.sections}>
          <ImageBackground
            source={require('../assets/profile-section-bg.webp')}
            style={styles.sectionsBackground}
            resizeMode="stretch"
          />

          {/* Cuenta */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cuenta</Text>
            <View style={styles.sectionCard}>
              <SectionButton label="Mi perfil" icon="user" onPress={onEditProfile} />
              <SectionButton label="Cambiar contraseña" icon="lock" onPress={onChangePassword} />
            </View>
          </View>

          {/* Sesión */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sesión</Text>
            <View style={styles.sectionCard}>
              <SectionButton
                label="Cerrar sesión"
                icon="logOut"
                onPress={() =>
                  router.push({
                    pathname: '/(app)/(profile)/confirm-modal',
                    params: {
                      title: '¿Quieres cerrar sesión?',
                      subtitle: '¿Estás seguro de querer cerrar tu sesión activa?',
                      confirmLabel: 'Cerrar sesión',
                      action: 'signOut',
                    },
                  })
                }
              />
            </View>
          </View>

          {/* Eliminar cuenta */}
          <View style={styles.sectionCard}>
            <SectionButton
              label="Eliminar cuenta"
              icon="warning"
              onPress={() =>
                router.push({
                  pathname: '/(app)/(profile)/confirm-modal',
                  params: {
                    title: '¿Eliminar cuenta?',
                    subtitle: 'Esta acción es irreversible y perderás todos tus datos.',
                    confirmLabel: 'Eliminar cuenta',
                    action: 'deleteAccount',
                    danger: 'true',
                  },
                })
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
