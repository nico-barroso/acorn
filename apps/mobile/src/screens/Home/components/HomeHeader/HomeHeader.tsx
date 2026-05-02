import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import AcornLogo from '@/assets/svg/acorn-logo.svg';
import { ContentCard } from '@/components/ContentCard/ContentCard';
import { ContentCardSkeleton } from '@/components/ContentCardSkeleton/ContentCardSkeleton';
import { styles } from '@/screens/Home/Home.styles';
import type { ContentCardData } from '@/screens/Home/Home.types';

type HomeHeaderProps = {
  userName: string;
  isUserNameLoading?: boolean;
  greeting: string;
  featured: ContentCardData | null;
  showOnboarding: boolean;
  listError: string;
  resources: ContentCardData[];
  isLoading?: boolean;
  avatarUrl?: string | null;
  onProfilePress: () => void;
  onOpenDetail: (id: string) => void;
  onToggleRead: (id: string, nextRead: boolean) => void;
  onTagsPress?: (id: string) => void;
};

export function HomeHeader({
  userName,
  isUserNameLoading,
  greeting,
  featured,
  showOnboarding,
  listError,
  resources,
  isLoading,
  avatarUrl,
  onProfilePress,
  onOpenDetail,
  onToggleRead,
  onTagsPress,
}: HomeHeaderProps) {
  const { height } = useWindowDimensions();
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isUserNameLoading) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 900, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isUserNameLoading, shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({ inputRange: [0, 1], outputRange: [0.25, 0.55] });

  return (
    <>
      <View style={styles.heroContainer}>
        <Image
          source={require('@/assets/noise-home-bg.webp')}
          style={[styles.heroImage, { height: height * 0.8 }]}
        />
        <View style={styles.header}>
          <View style={styles.headerLogo}>
            <AcornLogo width={112} height={28} />
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
                source={require('@/assets/default-avatar.png')}
                style={styles.avatarImage}
                resizeMode="cover"
              />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.greetingSection}>
          {isUserNameLoading ? (
            <Animated.View style={[styles.greetingSkeleton, { opacity: shimmerOpacity }]} />
          ) : (
            <Text style={styles.greetingSubtitle}>Hola {userName}</Text>
          )}
          <Text style={styles.greetingTitle}>{greeting}</Text>
        </View>
        {showOnboarding ? (
          <View style={styles.featuredCard}>
            <ContentCard
              id="onboarding-how-to"
              title="Cómo usar Acorn"
              source="Guía"
              tags={[{ name: 'ayuda', color_hex: null }]}
              savedDate="Hoy"
              status="No visto"
              iconSource={require('@/assets/acorn-empty-guide.webp')}
              onOpenDetail={() => {}}
              onToggleRead={() => {}}
            />
          </View>
        ) : null}
        {featured ? (
          <View style={styles.featuredCard}>
            <ContentCard {...featured} onOpenDetail={onOpenDetail} onToggleRead={onToggleRead} onTagsPress={onTagsPress} />
          </View>
        ) : isLoading ? (
          <View style={styles.featuredCard}>
            <ContentCardSkeleton />
          </View>
        ) : null}
      </View>
      <View style={styles.sectionHeader}>
        {(resources.length > 0 || isLoading) && (
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
