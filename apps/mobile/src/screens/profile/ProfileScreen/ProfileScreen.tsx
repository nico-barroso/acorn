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
  const [userData, setUserData] = React.useState<{ name: string; email: string; avatarUrl: string | null } | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', user.id)
        .single();

      let avatarUrl: string | null = null;
      if (profile?.avatar_url) {
        const { data: signed } = await supabase.storage
          .from('user-files')
          .createSignedUrl(profile.avatar_url, 3600);
        avatarUrl = signed?.signedUrl ?? null;
      }
      setUserData({
        name: profile?.display_name?.trim() || (user.email ?? 'Usuario'),
        email: user.email ?? '',
        avatarUrl,
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
            {userData?.avatarUrl ?? avatarUrl ? (
              <Image
                source={{ uri: (userData?.avatarUrl ?? avatarUrl)! }}
                style={styles.avatar}
                resizeMode="cover"
                onError={(e) => console.log('[ProfileScreen] image error:', e.nativeEvent.error)}
                onLoad={() => console.log('[ProfileScreen] image loaded ok')}
              />
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
              <SectionButton
                label="Mi perfil"
                icon="user"
                onPress={() => router.push('/(app)/(profile)/edit-profile')}
              />
              <SectionButton
                label="Cambiar contraseña"
                icon="lock"
                onPress={() => router.push('/(app)/(profile)/reset-password')}
              />
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
                  pathname: '/(app)/(profile)/delete-account',
                })
              }
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
