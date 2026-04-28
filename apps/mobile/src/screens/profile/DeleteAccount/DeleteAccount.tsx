import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { styles } from './DeleteAccount.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@lib/supabase';
import { useNavBarHeight } from '@context/NavBarHeightContext';

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
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const fullName = user.user_metadata?.full_name;
      setUserName(
        typeof fullName === 'string' && fullName.trim()
          ? fullName.trim()
          : (user.email ?? 'Usuario'),
      );
      setUserAvatar(user.user_metadata?.avatar_url ?? null);
    };
    void loadUser();
  }, []);

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
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>{userName.charAt(0)}</Text>
              </View>
            )}
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
