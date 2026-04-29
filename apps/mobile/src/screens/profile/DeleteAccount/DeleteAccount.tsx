import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { styles } from './DeleteAccount.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@lib/supabase';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { useSession } from '@context/SessionContext';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../../lib/queryKeys';
import { useCurrentUserId } from '../../../hooks/useCurrentUserId';

const defaultAvatar = require('@assets/default-avatar.png');

interface Props {
  onBack?: () => void;
}

const CONSEQUENCES = [
  '• No podrás iniciar sesión una vez borrada tu cuenta.',
  '• Tus enlaces guardados se perderán.',
  '• De acuerdo al marco legal, tus datos serán eliminados en un plazo de 30 días.',
];

export default function DeleteAccountScreen({ onBack }: Props) {
  const router = useRouter();
  const { height: navBarHeight } = useNavBarHeight();
  const { session } = useSession();
  const userId = useCurrentUserId();

  const { data: profileData } = useQuery({
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
    queryKey: queryKeys.avatarUrl(userId ?? ''),
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

  const userName = profileData?.display_name?.trim() || session?.user?.email || 'Usuario';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backChevron}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Eliminar cuenta</Text>
        <View style={styles.headerRight} />
      </View>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: navBarHeight + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.avatarContainer}>
          <View style={styles.avatarWrapper}>
            <Image
              source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
              style={styles.avatar}
              resizeMode="cover"
            />
            <View style={styles.warningBadge}>
              <Text style={styles.warningBadgeText}>!</Text>
            </View>
          </View>
        </View>
        <Text style={styles.title}>
          No queremos verte{'\n'}marchar {userName}
        </Text>
        <Text style={styles.subtitle}>
          Lamentamos mucho que te quieras ir,{'\n'}¿quieres borrar todos tus datos?
        </Text>
        <View style={styles.consequencesContainer}>
          <Text style={styles.consequencesTitle}>
            Cosas que pasarán cuando{'\n'}elimines tu cuenta:
          </Text>
          {CONSEQUENCES.map((item, index) => (
            <Text key={index} style={styles.bulletText}>
              {item}
            </Text>
          ))}
        </View>
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: '/(app)/(profile)/confirm-modal',
              params: {
                title: '¿Quieres eliminar tu cuenta?',
                subtitle:
                  'Esta acción es irreversible, perderás todos tus datos y contenido guardado.',
                confirmLabel: 'Eliminar cuenta',
                action: 'deleteAccount',
                danger: 'true',
                successTitle: '¡Listo!',
                successSubtitle:
                  'Tu cuenta ha sido eliminada correctamente, ¡esperamos verte pronto!',
                successLabel: 'Cerrar',
              },
            })
          }
          style={styles.deleteLinkContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteLink}>Eliminar mi cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
