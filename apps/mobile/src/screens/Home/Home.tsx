import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { ContentCard } from '../../components/ContentCard/ContentCard';
import { styles } from './Home.styles';
import { colors } from '../../theme/colors';

interface ContentCardData {
  id: string;
  title: string;
  source: string;
  tag: string;
  savedDate?: string;
  status?: 'No visto' | 'Visto';
  url?: string;
  thumbnailUri?: string;
}

interface HomeScreenProps {
  userName?: string;
  greeting?: string;
  recentCards?: ContentCardData[];
}

const MOCK_CARDS: ContentCardData[] = [
  {
    id: '1',
    title: '¿Cómo construir una Api Rest con Supabase?',
    source: 'Artículo / medium.com',
    tag: '#dev',
    savedDate: 'Hace dos días',
    status: 'No visto',
    url: 'https://medium.com',
  },
  {
    id: '2',
    title: '¿Cómo construir una Api Rest con Supabase?',
    source: 'Artículo / medium.com',
    tag: '#dev',
    savedDate: 'Hace tres días',
    status: 'No visto',
    url: 'https://medium.com',
  },
  {
    id: '3',
    title: '¿Cómo construir una Api Rest con Supabase?',
    source: 'Artículo / medium.com',
    tag: '#dev',
    savedDate: 'Hace una semana',
    status: 'Visto',
    url: 'https://medium.com',
  },
];

// ─── NavBar ───────────────────────────────────────────────────────────────────
function NavBar() {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Text style={styles.navIconPlaceholder}>⌂</Text>
        <Text style={[styles.navLabel, styles.navLabelActive]}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Text style={styles.navIconPlaceholder}>⌕</Text>
        <Text style={styles.navLabel}>Buscar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navFab} activeOpacity={0.8}>
        <Text style={styles.navFabIcon}>＋</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Text style={styles.navIconPlaceholder}>⊟</Text>
        <Text style={styles.navLabel}>Carpetas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Text style={styles.navIconPlaceholder}>◯</Text>
        <Text style={styles.navLabel}>Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Pantalla principal ───────────────────────────────────────────────────────
export default function HomeScreen({
  userName = 'Laura M.',
  greeting = 'Buenos días',
  recentCards = MOCK_CARDS,
}: HomeScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ImageBackground
          source={require('../../../assets/noise-home-bg.png')}
          style={styles.heroContainer}
          imageStyle={{
            resizeMode: 'cover',
            borderRadius: 20,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        >
          <View style={styles.heroInner}>

            {/* Header: logo + avatar */}
            <View style={styles.header}>
              <View style={styles.headerLogo}>
                <Image
                  source={require('../../../assets/icon.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>
              <TouchableOpacity style={styles.headerAvatar} activeOpacity={0.8}>
                <View style={styles.avatarCircle} />
              </TouchableOpacity>
            </View>
            <View style={styles.heroInner}>
            {/* Saludo */}
            <View style={styles.greetingSection}>
              <Text style={styles.greetingSubtitle}>Hola {userName}</Text>
              <Text style={styles.greetingTitle}>{greeting}</Text>
            </View>

            {/* Card destacada */}
            {recentCards.length > 0 && (
              <View style={styles.featuredCard}>
                <ContentCard {...recentCards[0]} />
              </View>
            )}
            </View>
          </View>
        </ImageBackground>

        {/* Sección "Ponte al día" */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ponte al día</Text>
          <Text style={styles.sectionSubtitle}>
            Lo último que has guardado y no has visto
          </Text>
        </View>

        {/* Lista de cards */}
        <View style={styles.cardList}>
          {recentCards.slice(1).map((card) => (
            <ContentCard key={card.id} {...card} />
          ))}
        </View>
      </ScrollView>

      <NavBar />
    </SafeAreaView>
  );
}
