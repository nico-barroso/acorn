import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Image, ScrollView, ImageBackground, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { styles } from './ProfileScreen.styles';
import SectionButton from '@/screens/profile/components/SectionButton/SectionButton';
import { useSession } from '@/context/SessionContext';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@mobile/lib/supabase';
import { queryKeys } from '@/lib/queryKeys';
import { useCurrentUserId } from '@/hooks/useCurrentUserId';

type ProfileScreenProps = {
  avatarUrl?: string | null;
  onEditProfile?: () => void;
  onChangePassword?: () => void;
};

export default function ProfileScreen({
  avatarUrl: externalAvatarUrl,
  onEditProfile = () => {},
  onChangePassword = () => {},
}: ProfileScreenProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const userId = useCurrentUserId();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });

  const { data: profileData, isLoading: profileLoading } = useQuery({
    queryKey: queryKeys.profile(userId ?? ''),
    queryFn: async () => {
      if (!userId) return null;
      const { data } = await supabase
        .from('profiles')
        .select('display_name, avatar_url')
        .eq('id', userId)
        .single();
      return data;
    },
    enabled: Boolean(userId),
    staleTime: 10 * 60 * 1000,
  });

  const { data: avatarUrl } = useQuery({
    queryKey: [...queryKeys.avatarUrl(userId ?? ''), profileData?.avatar_url ?? ''],
    queryFn: async () => {
      if (!profileData?.avatar_url) return null;
      const { data: signed } = await supabase.storage
        .from('user-files')
        .createSignedUrl(profileData.avatar_url, 3600);
      return signed?.signedUrl ?? null;
    },
    enabled: Boolean(profileData?.avatar_url),
    staleTime: 50 * 60 * 1000,
  });

  const metadataName =
    typeof session?.user?.user_metadata?.display_name === 'string'
      ? session.user.user_metadata.display_name.trim()
      : '';
  const displayName =
    profileData?.display_name?.trim() || metadataName || session?.user?.email || 'Usuario';
  const email = session?.user?.email ?? '';

  return (
    <View style={styles.safeArea}>
      {/* Header fijo */}
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
            <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
          ) : (
            <Image source={require('@/assets/default-avatar.png')} style={styles.avatar} />
          )}
        </View>
        {profileLoading ? (
          <>
            <Animated.View style={[styles.skeletonName, { opacity: shimmerOpacity }]} />
            <Animated.View style={[styles.skeletonEmail, { opacity: shimmerOpacity }]} />
          </>
        ) : (
          <>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </>
        )}
      </View>

      {/* Secciones scrolleables */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.sections, { paddingBottom: insets.bottom + 40 }]}
      >
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
      </ScrollView>
    </View>
  );
}
