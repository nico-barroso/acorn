import { Image, Text, TouchableOpacity, View, StyleSheet, useWindowDimensions } from 'react-native';
import { ContentCard } from '@components/ContentCard/ContentCard';
import { styles } from '../../Home.styles';
import type { ContentCardData } from '../../Home.types';

type HomeHeaderProps = {
  userName: string;
  greeting: string;
  featured: ContentCardData | null;
  showOnboarding: boolean;
  listError: string;
  resources: ContentCardData[];
  avatarUrl?: string | null;
  onProfilePress: () => void;
  onOpenDetail: (id: string) => void;
  onToggleRead: (id: string, nextRead: boolean) => void;
};

export function HomeHeader({
  userName,
  greeting,
  featured,
  showOnboarding,
  listError,
  resources,
  avatarUrl,
  onProfilePress,
  onOpenDetail,
  onToggleRead,
}: HomeHeaderProps) {
  const { height } = useWindowDimensions();

  return (
    <>
      <View style={styles.heroContainer}>
        <Image
          source={require('@assets/noise-home-bg.webp')}
          style={[styles.heroImage, { height: height * 0.8 }]}
        />
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <Image
              source={require('@assets/icon.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            style={styles.headerAvatar}
            activeOpacity={0.8}
            onPress={onProfilePress}
          >
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            ) : (
              <Image
                source={require('@assets/default-avatar.png')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.greetingSection}>
          <Text style={styles.greetingSubtitle}>Hola {userName}</Text>
          <Text style={styles.greetingTitle}>{greeting}</Text>
        </View>
        {showOnboarding ? (
          <View style={styles.featuredCard}>
            <ContentCard
              id="onboarding-how-to"
              title="Cómo usar Acorn"
              source="Guía"
              tag="#ayuda"
              savedDate="Hoy"
              status="No visto"
              iconSource={require('@assets/acorn-empty-guide.webp')}
              onOpenDetail={() => {}}
              onToggleRead={() => {}}
            />
          </View>
        ) : null}
        {featured ? (
          <View style={styles.featuredCard}>
            <ContentCard {...featured} onOpenDetail={onOpenDetail} onToggleRead={onToggleRead} />
          </View>
        ) : null}
      </View>
      <View style={styles.sectionHeader}>
        {resources.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Tus recursos</Text>
            <Text style={styles.sectionSubtitle}>Ordenados por fecha de guardado</Text>
          </>
        )}
      </View>
      {listError ? <Text style={styles.listError}>{listError}</Text> : null}
    </>
  );
}
