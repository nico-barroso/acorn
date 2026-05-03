import React from 'react';
import {
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

import { supabase } from '@mobile/lib/supabase';
import { ContentCard } from '@/components/ContentCard/ContentCard';
import { ContentCardSkeleton } from '@/components/ContentCardSkeleton/ContentCardSkeleton';
import { TagPickerModal } from '@/components/TagPickerModal/TagPickerModal';
import { SaveFileFlow } from '@/components/SaveFileFlow/SaveFileFlow';
import { ItemDetail } from '@/screens/ItemDetail/ItemDetail';
import { useRouter } from 'expo-router';
import { colors } from '@/theme/colors';
import { styles } from './Home.styles';
import AcornEmpty from './assets/acorn-empty-state.svg';
import { ContentCardData } from './Home.types';
import { HomeHeader } from './components/HomeHeader/HomeHeader';
import { useNavBarHeight } from '@/context/NavBarHeightContext';
import { useSession } from '@/context/SessionContext';
import { queryClient } from '@/lib/queryClient';
import { queryKeys } from '@/lib/queryKeys';
import { useCurrentUserId } from '@/hooks/useCurrentUserId';
import { createTagColorMap, mapResource, type ResourceRow } from '@/lib/mappers';


type HomeScreenProps = {
  userName?: string;
  isUserNameLoading?: boolean;
  greeting?: string;
  onSearchPress?: () => void;
};

const PAGE_SIZE = 5;

type ItemsPage = {
  items: ContentCardData[];
  nextCursor: string | null;
  rawRows: ResourceRow[];
};

async function fetchItemsPage(
  userId: string,
  cursor: string | null,
): Promise<ItemsPage> {
  const cachedTags = queryClient.getQueryData<{ name: string; slug: string | null; color_hex: string | null }[]>(
    queryKeys.tags(userId),
  );

  let q = supabase
    .from('items_with_links')
    .select('id,type,title,is_read,created_at,url,domain,favicon_url,preview_image_url,og_image_url,tags,metadata(og_title)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(PAGE_SIZE);

  if (cursor) q = q.lt('created_at', cursor);

  const [{ data, error }, tagFetchResult] = await Promise.all([
    q,
    cachedTags
      ? Promise.resolve({ data: cachedTags })
      : supabase.from('tags').select('name,slug,color_hex').eq('user_id', userId),
  ]);

  if (error) throw new Error('No se pudieron cargar los recursos.');

  const tagRows = (tagFetchResult.data ?? []) as { name: string; slug: string | null; color_hex: string | null }[];
  const tagColorMap = createTagColorMap(tagRows);

  const rows = (data ?? []) as ResourceRow[];
  const items = rows.map((row) => mapResource(row, tagColorMap));
  const nextCursor = rows.length === PAGE_SIZE ? rows[rows.length - 1].created_at : null;
  return { items, nextCursor, rawRows: rows };
}

export default function HomeScreen({
  userName = 'Usuario',
  isUserNameLoading = false,
  greeting = 'Buenos dias',
  onSearchPress,
}: HomeScreenProps) {
  const router = useRouter();
  const { height: navBarHeight } = useNavBarHeight();
  const { session } = useSession();
  const userId = session?.user?.id;

  const [saveFileOpen, setSaveFileOpen] = React.useState(false);
  const [selectedItemId, setSelectedItemId] = React.useState<string | null>(null);
  const [tagPickerItemId, setTagPickerItemId] = React.useState<string | null>(null);

  // Tags query — staleTime: 0 ensures fresh colors are picked up across devices on every mount.
  const { data: tagData } = useQuery({
    queryKey: queryKeys.tags(userId ?? ''),
    queryFn: async () => {
      const { data } = await supabase
        .from('tags')
        .select('name,slug,color_hex')
        .eq('user_id', userId!);
      return (data ?? []) as { name: string; slug: string | null; color_hex: string | null }[];
    },
    enabled: Boolean(userId),
    staleTime: 0,
  });

  const tagColorMap = React.useMemo(() => {
    const map = new Map<string, string | null>();
    (tagData ?? []).forEach((t) => {
      map.set(t.name, t.color_hex);
      if (t.slug) map.set(t.slug, t.color_hex);
      map.set(t.name.toLowerCase(), t.color_hex);
    });
    return map;
  }, [tagData]);

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
      fetchItemsPage(userId!, (pageParam as string | null) ?? null),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: Boolean(userId),
    staleTime: 1 * 60 * 1000,
  });

  const resources = React.useMemo(
    () =>
      (data?.pages.flatMap((p) => p.items) ?? []).map((item) => ({
        ...item,
        tags: item.tags.map((t) => ({
          name: t.name,
          color_hex: tagColorMap.get(t.name) ?? tagColorMap.get(t.name.toLowerCase()) ?? t.color_hex,
        })),
      })),
    [data, tagColorMap],
  );

  const listError = queryError ? 'No se pudieron cargar los recursos. Intenta refrescar.' : '';

  React.useEffect(() => {
    resources.forEach((item) => {
      if (item.faviconUri) void Image.prefetch(item.faviconUri).catch(() => undefined);
      if (item.thumbnailUri) void Image.prefetch(item.thumbnailUri).catch(() => undefined);
    });
  }, [resources]);


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

  const showOnboarding = !loadingInitial && resources.length <= 1;
  const featured = showOnboarding ? null : resources[0] ?? null;
  const listData = showOnboarding ? resources : resources.slice(1, 5);
  const hasMoreThanFive = resources.length > 5;

  const renderEmpty = () => {
    if (loadingInitial && resources.length === 0) {
      return (
        <View style={{ gap: 12 }}>
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
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <FlatList
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: navBarHeight + 20 }]}
        data={listData}
        keyExtractor={(item) => item.id}
        removeClippedSubviews
        maxToRenderPerBatch={5}
        updateCellsBatchingPeriod={50}
        windowSize={7}
        ListHeaderComponent={
          <HomeHeader
            userName={userName}
            isUserNameLoading={isUserNameLoading}
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
        ListFooterComponent={
          loadingMore ? (
            <ContentCardSkeleton />
          ) : hasMoreThanFive ? (
            <TouchableOpacity style={styles.seeMoreButton} onPress={onSearchPress ?? (() => router.push('/(app)/search'))}>
              <Text style={styles.seeMoreText}>Ver más recursos</Text>
              <Text style={styles.seeMoreSubtext}>Acceder a todos mis enlaces</Text>
            </TouchableOpacity>
          ) : null
        }
      />
      <ImageBackground
        source={require('./assets/bottom-home-noise-gradient.webp')}
        style={styles.bottomGradient}
        imageStyle={styles.bottomGradientImage}
      />
      {!loadingInitial && resources.length === 0 && (
        <View style={styles.emptyImageContainer}>
          <AcornEmpty style={styles.emptyImage} />
        </View>
      )}

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
        onClose={() => {
          setTagPickerItemId(null);
          invalidateItems();
        }}
        onSaved={() => {
          setTagPickerItemId(null);
          invalidateItems();
        }}
      />
    </SafeAreaView>
  );
}
