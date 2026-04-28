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
import { ContentCard } from '../../components/ContentCard/ContentCard';
import { SaveFileFlow } from '../../components/SaveFileFlow/SaveFileFlow';
import { SaveLinkFlow } from '../../components/SaveLinkFlow/SaveLinkFlow';
import { ItemDetail } from '../ItemDetail/ItemDetail';
import { useRouter } from 'expo-router';
import { SmartFolders } from '../SmartFolders/SmartFolders';
import { TagManagement } from '../TagManagement/TagManagement';
import { colors } from '../../theme/colors';
import { styles } from './Home.styles';
import AcornEmpty from '../../../assets/svg/acorn-empty-state.svg';
import { ContentCardData } from './Home.types';
import { HomeHeader } from './components/HomeHeader/HomeHeader';
import { useNavBarHeight } from '@context/NavBarHeightContext';

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
  onSearchPress?: () => void;
};

const PAGE_SIZE = 5;

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
    isRead: Boolean(row.is_read),
    url: row.url ?? undefined,
    thumbnailUri: row.og_image_url ?? row.preview_image_url ?? undefined,
  };
}

export default function HomeScreen({
  userName = 'Usuario',
  greeting = 'Buenos dias',
  sharedUrl,
  onSharedUrlHandled,
  onSearchPress,
}: HomeScreenProps) {
  const router = useRouter();
  const { height: navBarHeight } = useNavBarHeight();
  const [saveLinkOpen, setSaveLinkOpen] = React.useState(false);
  const [saveFileOpen, setSaveFileOpen] = React.useState(false);
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
  const [avatarUrl, setAvatarUrl] = React.useState<string | null>(null);

  const hasMoreRef = React.useRef(hasMore);
  const nextCursorRef = React.useRef(nextCursor);
  const loadingMoreRef = React.useRef(loadingMore);
  const loadingInitialRef = React.useRef(loadingInitial);
  const refreshingRef = React.useRef(refreshing);

  React.useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  React.useEffect(() => {
    nextCursorRef.current = nextCursor;
  }, [nextCursor]);
  React.useEffect(() => {
    loadingMoreRef.current = loadingMore;
  }, [loadingMore]);
  React.useEffect(() => {
    loadingInitialRef.current = loadingInitial;
  }, [loadingInitial]);
  React.useEffect(() => {
    refreshingRef.current = refreshing;
  }, [refreshing]);

  React.useEffect(() => {
    const loadAvatar = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user.id)
        .single();

      if (profile?.avatar_url) {
        const { data: signed } = await supabase.storage
          .from('user-files')
          .createSignedUrl(profile.avatar_url, 3600);
        if (signed?.signedUrl) setAvatarUrl(signed.signedUrl);
      }
    };
    loadAvatar();
  }, []);

  const fetchResources = React.useCallback(async (mode: 'initial' | 'refresh' | 'loadMore') => {
    if (
      mode === 'loadMore' &&
      (!hasMoreRef.current ||
        loadingMoreRef.current ||
        loadingInitialRef.current ||
        refreshingRef.current)
    )
      return;

    if (mode === 'initial') setLoadingInitial(true);
    if (mode === 'refresh') setRefreshing(true);
    if (mode === 'loadMore') setLoadingMore(true);

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

    if (mode === 'loadMore' && nextCursorRef.current) {
      query = query.lt('created_at', nextCursorRef.current);
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
    setNextCursor(
      mapped.length > 0 ? ((data ?? []) as ResourceRow[])[mapped.length - 1].created_at : null,
    );
  }, []);

  React.useEffect(() => {
    void fetchResources('initial');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  React.useEffect(() => {
    if (sharedUrl) setSaveLinkOpen(true);
  }, [sharedUrl]);

  const handleFabPress = () => {
    Alert.alert('Guardar recurso', 'Elige el tipo de contenido que quieres guardar', [
      { text: 'Enlace', onPress: () => setSaveLinkOpen(true) },
      { text: 'Archivo', onPress: () => setSaveFileOpen(true) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const featured = resources.length >= 2 ? resources[0] : null;
  const listData = resources.length >= 2 ? resources.slice(1) : resources;
  const showOnboarding = !loadingInitial && resources.length <= 1;

  const handleToggleRead = async (itemId: string, nextRead: boolean) => {
    setResources((current) =>
      current.map((item) =>
        item.id === itemId
          ? { ...item, isRead: nextRead, status: nextRead ? 'Visto' : 'No visto' }
          : item,
      ),
    );

    const { error } = await supabase
      .from('items')
      .update({ is_read: nextRead, updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (error) {
      setResources((current) =>
        current.map((item) =>
          item.id === itemId
            ? { ...item, isRead: !nextRead, status: !nextRead ? 'Visto' : 'No visto' }
            : item,
        ),
      );
      setListError('No se pudo actualizar el estado de lectura.');
    }
  };

  const renderEmpty = () => {
    if (loadingInitial && resources.length === 0) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.salmon} />
          <Text style={styles.emptyTitle}>Cargando recursos...</Text>
        </View>
      );
    }

    if (!loadingInitial && resources.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>¡Es hora de empezar a explorar!</Text>
          <Text style={styles.sectionSubtitle}>
            Guarda tu primer enlace o contenido desde tu aplicación o web favorita.
          </Text>
        </View>
      );
    }

    return null;
  };

  return (
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <FlatList
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: navBarHeight + 20 }]}
        data={listData}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <HomeHeader
            userName={userName}
            greeting={greeting}
            featured={featured}
            showOnboarding={showOnboarding}
            listError={listError}
            resources={resources}
            avatarUrl={avatarUrl}
            onProfilePress={() => router.push('/(app)/(profile)/')}
            onOpenDetail={setSelectedItemId}
            onToggleRead={handleToggleRead}
          />
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <ContentCard {...item} onOpenDetail={setSelectedItemId} onToggleRead={handleToggleRead} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void fetchResources('refresh')}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => void fetchResources('loadMore')}
        ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.salmon} /> : null}
      />
      <ImageBackground
        source={require('../../../assets/bottom-home-noise-gradient.webp')}
        style={styles.bottomGradient}
        imageStyle={styles.bottomGradientImage}
      />
      {!loadingInitial && resources.length === 0 && (
        <View style={styles.emptyImageContainer}>
          <AcornEmpty style={styles.emptyImage} />
        </View>
      )}

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
