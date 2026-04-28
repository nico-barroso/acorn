import React from 'react';
import {
  Alert,
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
import { useQuery, useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

import { supabase } from '../../../lib/supabase';
import { ContentCard } from '../../components/ContentCard/ContentCard';
import { ContentCardSkeleton } from '../../components/ContentCardSkeleton/ContentCardSkeleton';
import { TagPickerModal } from '../../components/TagPickerModal/TagPickerModal';
import { SaveFileFlow } from '../../components/SaveFileFlow/SaveFileFlow';
import { SaveLinkFlow } from '../../components/SaveLinkFlow/SaveLinkFlow';
import { ItemDetail } from '../ItemDetail/ItemDetail';
import { useRouter } from 'expo-router';
import { colors } from '../../theme/colors';
import { styles } from './Home.styles';
import AcornEmpty from '../../../assets/svg/acorn-empty-state.svg';
import { ContentCardData } from './Home.types';
import { HomeHeader } from './components/HomeHeader/HomeHeader';
import { useNavBarHeight } from '@context/NavBarHeightContext';
import { useSession } from '@context/SessionContext';
import { queryClient } from '../../lib/queryClient';
import { queryKeys } from '../../lib/queryKeys';
import { useCurrentUserId } from '../../hooks/useCurrentUserId';

type ResourceRow = {
  id: string;
  type: string | null;
  title: string | null;
  is_read: boolean;
  created_at: string;
  url: string | null;
  domain: string | null;
  favicon_url: string | null;
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

const FILE_ICON = require('../../../assets/favicon.png');

function isImageUrl(url: string): boolean {
  return /\.(jpe?g|png|gif|webp|heic|bmp|tiff?)(\?|$)/i.test(url);
}

function mapResource(row: ResourceRow, tagColorMap: Map<string, string | null>): ContentCardData {
  const isFile = row.type === 'file';
  const fileUrl = row.url ?? undefined;
  const fileThumbnail = isFile && fileUrl && isImageUrl(fileUrl) ? fileUrl : undefined;

  return {
    id: row.id,
    title: row.title?.trim() || row.domain || row.url || 'Recurso sin titulo',
    source: isFile ? 'Archivo' : row.domain ? `Enlace / ${row.domain}` : 'Enlace',
    tags: (row.tags ?? []).map((name) => ({ name, color_hex: tagColorMap.get(name) ?? null })),
    savedDate: formatSavedDate(row.created_at),
    status: row.is_read ? 'Visto' : 'No visto',
    isRead: Boolean(row.is_read),
    url: fileUrl,
    thumbnailUri: fileThumbnail ?? (row.og_image_url ?? row.preview_image_url ?? undefined),
    faviconUri: row.favicon_url ?? undefined,
    iconSource: isFile ? FILE_ICON : undefined,
    isFile,
  };
}

type ItemsPage = {
  items: ContentCardData[];
  nextCursor: string | null;
  rawRows: ResourceRow[];
};

async function fetchItemsPage(
  userId: string,
  tagColorMap: Map<string, string | null>,
  cursor: string | null,
): Promise<ItemsPage> {
  let q = supabase
    .from('items_with_links')
    .select('id,type,title,is_read,created_at,url,domain,favicon_url,preview_image_url,og_image_url,tags')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  if (cursor) q = q.lt('created_at', cursor);

  const { data, error } = await q;
  if (error) throw new Error('No se pudieron cargar los recursos.');

  const rows = (data ?? []) as ResourceRow[];
  const items = rows.map((row) => mapResource(row, tagColorMap));
  const nextCursor = rows.length === PAGE_SIZE ? rows[rows.length - 1].created_at : null;
  return { items, nextCursor, rawRows: rows };
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
  const { session } = useSession();
  const userId = session?.user?.id;

  const [saveLinkOpen, setSaveLinkOpen] = React.useState(false);
  const [saveFileOpen, setSaveFileOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
  const [tagPickerItemId, setTagPickerItemId] = React.useState<string | null>(null);

  // Tags query — shared cache with other screens
  const { data: tagData } = useQuery({
    queryKey: queryKeys.tags(userId ?? ''),
    queryFn: async () => {
      const { data } = await supabase
        .from('tags')
        .select('name,color_hex')
        .eq('user_id', userId!);
      return (data ?? []) as { name: string; color_hex: string | null }[];
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  const tagColorMap = React.useMemo(
    () => new Map((tagData ?? []).map((t) => [t.name, t.color_hex])),
    [tagData],
  );

  // Avatar query — shared cache with profile screen
  const { data: avatarUrl = null } = useQuery({
    queryKey: queryKeys.avatarUrl(userId ?? ''),
    queryFn: async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userId!)
        .single();

      if (!profile?.avatar_url) return null;

      const { data: signed } = await supabase.storage
        .from('user-files')
        .createSignedUrl(profile.avatar_url, 3600);

      return signed?.signedUrl ?? null;
    },
    enabled: Boolean(userId),
    staleTime: 50 * 60 * 1000,
  });

  // Infinite items query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage: loadingMore,
    isLoading: loadingInitial,
    isRefetching: refreshing,
    refetch,
    error: queryError,
  } = useInfiniteQuery({
    queryKey: queryKeys.items(userId ?? ''),
    queryFn: ({ pageParam }) =>
      fetchItemsPage(userId!, tagColorMap, (pageParam as string | null) ?? null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(userId),
    staleTime: 1 * 60 * 1000,
  });

  const resources = React.useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data],
  );

  const listError = queryError ? 'No se pudieron cargar los recursos. Intenta refrescar.' : '';

  React.useEffect(() => {
    if (sharedUrl) setSaveLinkOpen(true);
  }, [sharedUrl]);

  const handleToggleRead = async (itemId: string, nextRead: boolean) => {
    // Optimistic update across all infinite pages
    queryClient.setQueryData(
      queryKeys.items(userId!),
      (old: InfiniteData<ItemsPage> | undefined) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((item) =>
              item.id === itemId
                ? { ...item, isRead: nextRead, status: nextRead ? 'Visto' : 'No visto' }
                : item,
            ),
          })),
        };
      },
    );

    const { error } = await supabase
      .from('items')
      .update({ is_read: nextRead, updated_at: new Date().toISOString() })
      .eq('id', itemId);

    if (error) {
      // Roll back
      queryClient.setQueryData(
        queryKeys.items(userId!),
        (old: InfiniteData<ItemsPage> | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === itemId
                  ? { ...item, isRead: !nextRead, status: !nextRead ? 'Visto' : 'No visto' }
                  : item,
              ),
            })),
          };
        },
      );
    }
  };

  const featured = resources.length >= 2 ? resources[0] : null;
  const listData = resources.length >= 2 ? resources.slice(1) : resources;
  const showOnboarding = !loadingInitial && resources.length <= 1;

  const handleFabPress = () => {
    Alert.alert('Guardar recurso', 'Elige el tipo de contenido que quieres guardar', [
      { text: 'Enlace', onPress: () => setSaveLinkOpen(true) },
      { text: 'Archivo', onPress: () => setSaveFileOpen(true) },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  };

  const renderEmpty = () => {
    if (loadingInitial && resources.length === 0) {
      return (
        <View style={styles.emptyState}>
          <ContentCardSkeleton />
          <ContentCardSkeleton />
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

   const invalidateItems = () =>
    void queryClient.invalidateQueries({ queryKey: queryKeys.items(userId!) });

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
            isLoading={loadingInitial}
            avatarUrl={avatarUrl}
            onProfilePress={() => router.push('/(app)/(profile)/')}
            onOpenDetail={setSelectedItemId}
            onToggleRead={handleToggleRead}
            onTagsPress={setTagPickerItemId}
          />
        }
        ListEmptyComponent={renderEmpty}
        renderItem={({ item }) => (
          <ContentCard
            {...item}
            onOpenDetail={setSelectedItemId}
            onToggleRead={handleToggleRead}
            onTagsPress={setTagPickerItemId}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => void refetch()}
          />
        }
        onEndReachedThreshold={0.4}
        onEndReached={() => {
          if (hasNextPage && !loadingMore) void fetchNextPage();
        }}
        ListFooterComponent={loadingMore ? <ContentCardSkeleton /> : null}
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
          invalidateItems();
        }}
      />

      <SaveFileFlow
        visible={saveFileOpen}
        onClose={() => setSaveFileOpen(false)}
        onSaved={() => {
          setSaveFileOpen(false);
          invalidateItems();
        }}
      />

      <ItemDetail
        visible={Boolean(selectedItemId)}
        itemId={selectedItemId}
        onClose={() => setSelectedItemId(null)}
        onUpdated={invalidateItems}
      />

      <TagPickerModal
        visible={Boolean(tagPickerItemId)}
        itemId={tagPickerItemId}
        onClose={() => setTagPickerItemId(null)}
        onSaved={() => {
          setTagPickerItemId(null);
          invalidateItems();
        }}
      />
    </SafeAreaView>
  );
}
