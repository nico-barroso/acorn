import React from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  RefreshControl,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '../../../lib/supabase';
import { Button } from '../../components/Button/Button';
import { ContentCard } from '../../components/ContentCard/ContentCard';
import { SaveFileFlow } from '../../components/SaveFileFlow/SaveFileFlow';
import { SaveLinkFlow } from '../../components/SaveLinkFlow/SaveLinkFlow';
import { ItemDetail } from '../ItemDetail/ItemDetail';
import { SearchScreen } from '../Search/Search';
import { SmartFolders } from '../SmartFolders/SmartFolders';
import { TagManagement } from '../TagManagement/TagManagement';
import { colors } from '../../theme/colors';
import { styles } from './Home.styles';

type ContentCardData = {
  id: string;
  title: string;
  source: string;
  tag: string;
  savedDate: string;
  status: 'No visto' | 'Visto';
  url?: string;
  thumbnailUri?: string;
};

type ResourceRow = {
  id: string;
  title: string | null;
  is_read: boolean;
  created_at: string;
  url: string | null;
  domain: string | null;
  preview_image_url: string | null;
  og_image_url: string | null;
  tags: string[] | null;
};

type HomeScreenProps = {
  userName?: string;
  greeting?: string;
  sharedUrl?: string | null;
  onSharedUrlHandled?: () => void;
};

type NavBarProps = {
  onAddPress: () => void;
  onSearchPress: () => void;
  onTagsPress: () => void;
  onSmartFoldersPress: () => void;
  searchActive: boolean;
  tagsActive: boolean;
  smartFoldersActive: boolean;
};

const PAGE_SIZE = 12;

function formatSavedDate(isoDate: string) {
  const created = new Date(isoDate).getTime();
  const now = Date.now();
  const diffMs = Math.max(now - created, 0);
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return 'Hace unos segundos';
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Hace ${diffDays} dias`;

  return new Date(isoDate).toLocaleDateString();
}

function mapResource(row: ResourceRow): ContentCardData {
  return {
    id: row.id,
    title: row.title?.trim() || row.domain || row.url || 'Recurso sin titulo',
    source: row.domain ? `Enlace / ${row.domain}` : 'Enlace',
    tag: row.tags && row.tags.length > 0 ? `#${row.tags[0]}` : '#recurso',
    savedDate: formatSavedDate(row.created_at),
    status: row.is_read ? 'Visto' : 'No visto',
    url: row.url ?? undefined,
    thumbnailUri: row.og_image_url ?? row.preview_image_url ?? undefined,
  };
}

function NavBar({
  onAddPress,
  onSearchPress,
  onTagsPress,
  onSmartFoldersPress,
  searchActive,
  tagsActive,
  smartFoldersActive,
}: NavBarProps) {
  return (
    <View style={styles.navbar}>
      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Text style={styles.navIconPlaceholder}>⌂</Text>
        <Text style={[styles.navLabel, styles.navLabelActive]}>Inicio</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onSearchPress}>
        <Text style={styles.navIconPlaceholder}>⌕</Text>
        <Text style={[styles.navLabel, searchActive ? styles.navLabelActive : null]}>Buscar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navFab} activeOpacity={0.8} onPress={onAddPress}>
        <Text style={styles.navFabIcon}>＋</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onTagsPress}>
        <Text style={styles.navIconPlaceholder}>⊟</Text>
        <Text style={[styles.navLabel, tagsActive ? styles.navLabelActive : null]}>Etiquetas</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={onSmartFoldersPress}>
        <Text style={styles.navIconPlaceholder}>◯</Text>
        <Text style={[styles.navLabel, smartFoldersActive ? styles.navLabelActive : null]}>Carpetas IA</Text>
      </TouchableOpacity>
    </View>
  );
}

export default function HomeScreen({
  userName = 'Usuario',
  greeting = 'Buenos dias',
  sharedUrl,
  onSharedUrlHandled,
}: HomeScreenProps) {
  const [saveLinkOpen, setSaveLinkOpen] = React.useState(false);
  const [saveFileOpen, setSaveFileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [tagsOpen, setTagsOpen] = React.useState(false);
  const [smartFoldersOpen, setSmartFoldersOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);

  const [resources, setResources] = React.useState<ContentCardData[]>([]);
  const [nextCursor, setNextCursor] = React.useState<string | null>(null);
  const [hasMore, setHasMore] = React.useState(true);
  const [loadingInitial, setLoadingInitial] = React.useState(true);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [listError, setListError] = React.useState('');

  const fetchResources = React.useCallback(
    async (mode: 'initial' | 'refresh' | 'loadMore') => {
      if (mode === 'loadMore' && (!hasMore || loadingMore || loadingInitial || refreshing)) {
        return;
      }

      if (mode === 'initial') {
        setLoadingInitial(true);
      }
      if (mode === 'refresh') {
        setRefreshing(true);
      }
      if (mode === 'loadMore') {
        setLoadingMore(true);
      }

      setListError('');

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setListError('Debes iniciar sesion para ver tus recursos.');
        setLoadingInitial(false);
        setRefreshing(false);
        setLoadingMore(false);
        return;
      }

      let query = supabase
        .from('items_with_links')
        .select('id,title,is_read,created_at,url,domain,preview_image_url,og_image_url,tags')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(PAGE_SIZE);

      if (mode === 'loadMore' && nextCursor) {
        query = query.lt('created_at', nextCursor);
      }

      const { data, error } = await query;

      setLoadingInitial(false);
      setRefreshing(false);
      setLoadingMore(false);

      if (error) {
        setListError('No se pudieron cargar los recursos. Intenta refrescar.');
        return;
      }

      const mapped = ((data ?? []) as ResourceRow[]).map(mapResource);

      if (mode === 'loadMore') {
        setResources((previous) => {
          const merged = [...previous, ...mapped];
          const seen = new Set<string>();
          return merged.filter((item) => {
            if (seen.has(item.id)) return false;
            seen.add(item.id);
            return true;
          });
        });
      } else {
        setResources(mapped);
      }

      setHasMore(mapped.length === PAGE_SIZE);
      setNextCursor(mapped.length > 0 ? ((data ?? []) as ResourceRow[])[mapped.length - 1].created_at : null);
    },
    [hasMore, loadingMore, loadingInitial, refreshing, nextCursor],
  );

  React.useEffect(() => {
    void fetchResources('initial');
  }, [fetchResources]);

  React.useEffect(() => {
    if (sharedUrl) {
      setSaveLinkOpen(true);
    }
  }, [sharedUrl]);

  const handleFabPress = () => {
    Alert.alert('Guardar recurso', 'Elige el tipo de contenido que quieres guardar', [
      {
        text: 'Enlace',
        onPress: () => setSaveLinkOpen(true),
      },
      {
        text: 'Archivo',
        onPress: () => setSaveFileOpen(true),
      },
      {
        text: 'Cancelar',
        style: 'cancel',
      },
    ]);
  };

  const featured = resources.length > 0 ? resources[0] : null;
  const listData = resources.length > 1 ? resources.slice(1) : [];

  const renderHeader = () => (
    <>
      <ImageBackground
        source={require('../../../assets/noise-home-bg.png')}
        style={styles.heroContainer}
        imageStyle={styles.heroImage}
      >
        <View style={styles.heroInner}>
          <View style={styles.header}>
            <View style={styles.headerLogo}>
              <Image source={require('../../../assets/icon.png')} style={styles.logoImage} resizeMode='contain' />
            </View>
            <TouchableOpacity style={styles.headerAvatar} activeOpacity={0.8}>
              <View style={styles.avatarCircle} />
            </TouchableOpacity>
          </View>

          <View style={styles.greetingSection}>
            <Text style={styles.greetingSubtitle}>Hola {userName}</Text>
            <Text style={styles.greetingTitle}>{greeting}</Text>
          </View>

          {featured ? (
            <View style={styles.featuredCard}>
              <ContentCard {...featured} onOpenDetail={setSelectedItemId} />
            </View>
          ) : null}
        </View>
      </ImageBackground>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Tus recursos</Text>
        <Text style={styles.sectionSubtitle}>Ordenados por fecha de guardado</Text>
      </View>

      {listError ? <Text style={styles.listError}>{listError}</Text> : null}
    </>
  );

  const renderEmpty = () => {
    if (loadingInitial) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.salmon} />
          <Text style={styles.emptyTitle}>Cargando recursos...</Text>
        </View>
      );
    }

    if (resources.length > 0) {
      return null;
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Todavia no has guardado recursos</Text>
        <Text style={styles.emptySubtitle}>Empieza guardando tu primer enlace o archivo.</Text>
        <Button label='Guardar primer recurso' onPress={() => setSaveLinkOpen(true)} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle='dark-content' backgroundColor={colors.background} />

      <FlatList
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        data={listData}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => <ContentCard {...item} onOpenDetail={setSelectedItemId} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={() => void fetchResources('refresh')} />
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => void fetchResources('loadMore')}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.salmon} /> : null}
      />

      <NavBar
        onAddPress={handleFabPress}
        onSearchPress={() => setSearchOpen(true)}
        onTagsPress={() => setTagsOpen(true)}
        onSmartFoldersPress={() => setSmartFoldersOpen(true)}
        searchActive={searchOpen}
        tagsActive={tagsOpen}
        smartFoldersActive={smartFoldersOpen}
      />

      <SaveLinkFlow
        visible={saveLinkOpen}
        onClose={() => setSaveLinkOpen(false)}
        initialUrl={sharedUrl ?? undefined}
        onInitialUrlConsumed={onSharedUrlHandled}
        onSaved={() => {
          setSaveLinkOpen(false);
          void fetchResources('refresh');
        }}
      />

      <SaveFileFlow
        visible={saveFileOpen}
        onClose={() => setSaveFileOpen(false)}
        onSaved={() => {
          setSaveFileOpen(false);
          void fetchResources('refresh');
        }}
      />

      <ItemDetail
        visible={Boolean(selectedItemId)}
        itemId={selectedItemId}
        onClose={() => setSelectedItemId(null)}
        onUpdated={() => void fetchResources('refresh')}
      />

      <SearchScreen
        visible={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenDetail={(itemId) => setSelectedItemId(itemId)}
      />

      <TagManagement
        visible={tagsOpen}
        onClose={() => setTagsOpen(false)}
        onUpdated={() => void fetchResources('refresh')}
      />

      <SmartFolders
        visible={smartFoldersOpen}
        onClose={() => setSmartFoldersOpen(false)}
        onOpenDetail={(itemId) => {
          setSmartFoldersOpen(false);
          setSelectedItemId(itemId);
        }}
      />
    </SafeAreaView>
  );
}
