import React from 'react';
import { ActivityIndicator, Animated, FlatList, ImageBackground, Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilterPanel } from './components/FilterPanel/FilterPanel';
import { QuickFilters } from './components/QuickFilters/QuickFilters';
import { styles } from './Search.styles';
import { useSearch } from './hooks/useSearch';
import type { SearchResult, SearchScreenProps } from './types';

export interface SearchScreenExtendedProps extends SearchScreenProps {
  navBarHeight?: number;
}
import { Input as SearchInput } from '../../components/Input/Input';
import SearchIcon from '../../../assets/icons/search-icon.svg';
import { colors } from '../../theme/colors';
import { ContentCard } from '../../components/ContentCard/ContentCard';
import { SkeletonContentCard } from '../../components/SkeletonContentCard/SkeletonContentCard';

export function SearchScreen({ onBack, onOpenDetail, navBarHeight = 0 }: SearchScreenExtendedProps) {
  const {
    query,
    setQuery,
    loading,
    loadingMore,
    loadMore,
    error,
    filteredResults,
    results,
    totalCount,
    domainOptions,
    allUserTags,
    selectedDomain,
    setSelectedDomain,
    selectedTag,
    setSelectedTag,
    selectedDate,
    setSelectedDate,
    selectedRead,
    setSelectedRead,
    hasActiveFilters,
    tagFromQuery,
    clearFilters,
  } = useSearch();

  const insets = useSafeAreaInsets();
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);
  const filterPanelAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(filterPanelAnim, {
      toValue: showFilterPanel ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [showFilterPanel]);

  const activeData = filteredResults;

  const handleQuickFilter = (id: string) => {
    if (id === 'all') {
      // Si ya estamos en 'all', no hacemos nada (o limpiamos todo)
      setSelectedRead('all');
      setSelectedDate('all');
    } else if (id === 'unread') {
      // Toggle: si ya está activo, volver a 'all'; si no, activar 'unread'
      if (activeQuickFilter === 'unread') {
        setSelectedRead('all');
        setSelectedDate('all');
      } else {
        setSelectedRead('unread');
        setSelectedDate('all');
      }
    } else if (id === 'new') {
      // Toggle: si ya está activo, volver a 'all'; si no, activar 'new'
      if (activeQuickFilter === 'new') {
        setSelectedRead('all');
        setSelectedDate('all');
      } else {
        setSelectedRead('all');
        setSelectedDate('7d');
      }
    }
  };

  const activeQuickFilter = React.useMemo(() => {
    if (selectedRead === 'unread' && selectedDate === 'all') return 'unread';
    if (selectedRead === 'all' && selectedDate === '7d') return 'new';
    if (selectedRead === 'all' && selectedDate === 'all' && !selectedDomain && !selectedTag) return 'all';
    return null;
  }, [selectedRead, selectedDate, selectedDomain, selectedTag]);

  // Solo filtros manuales (panel), no quick filters
  const hasManualFilters = hasActiveFilters && !activeQuickFilter;

  const renderEmpty = () => {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Aquí no hay nada ... {'\n'}todavía</Text>
        <Text style={styles.emptySubtitle}>
          {hasActiveFilters
            ? 'Prueba a limpiar o combinar otros filtros.'
            : 'Guarda tu primer enlace para verlo aquí.'}
        </Text>
        <View style={styles.emptyImageContainer}>
          <Image
            source={require('../../../assets/search-empty-drawing.png')}
            style={styles.emptyImage}
          />
        </View>
      </View>
    );
  };

  const renderSkeleton = () => <SkeletonContentCard />;

  const renderItem = ({ item }: { item: SearchResult }) => (
    <ContentCard
      id={item.id}
      title={item.title}
      source={item.domain}
      tags={item.tags}
      savedDate={new Date(item.createdAt).toLocaleDateString()}
      status={item.isRead ? 'Visto' : 'No visto'}
      url={item.url}
      thumbnailUri={item.thumbnailUri}
      faviconUri={item.faviconUri}
      onOpenDetail={onOpenDetail}
    />
  );

  return (
    <View style={styles.panel}>
      <ImageBackground
        source={require('../../../assets/search-top-drop-gradient.webp')}
        style={{
          position: 'absolute',
          top: -insets.top,
          left: 0,
          right: 0,
          height: 300 + insets.top,
        }}
        resizeMode="cover"
      />

      <View style={styles.inner}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>De vuelta {'\n'}a lo que importa</Text>
        </View>
        <SearchInput
          value={query}
          onChangeText={setQuery}
          placeholder="Busca en tus recursos..."
          icon={
            <SearchIcon
              width={20}
              height={20}
              fill="none"
              stroke={colors.brownMid}
              strokeWidth={2}
            />
          }
        />
      </View>

       <View style={{ marginTop: 16 }}>
        <QuickFilters
          activeQuickFilter={activeQuickFilter}
          hasActiveFilters={hasManualFilters}
          showFilterPanel={showFilterPanel}
          onQuickFilter={handleQuickFilter}
          onToggleFilterPanel={() => setShowFilterPanel((v) => !v)}
          onLayout={() => {}}
        />
      </View>

      <Animated.View
        style={{
          maxHeight: filterPanelAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1000],
          }),
          opacity: filterPanelAnim,
          overflow: 'hidden',
        }}
      >
        <View style={styles.filterPanelContainer}>
          <FilterPanel
            domains={domainOptions}
            tags={allUserTags}
            selectedDomain={selectedDomain}
            selectedTag={selectedTag}
            selectedDate={selectedDate}
            selectedRead={selectedRead}
            onSelectDomain={setSelectedDomain}
            onSelectTag={(tag) => {
              if (query.trim().startsWith('#')) {
                setQuery('');
              }
              setSelectedTag(selectedTag === tag ? null : tag);
            }}
            onSelectDate={setSelectedDate}
            onSelectRead={setSelectedRead}
            onClear={clearFilters}
          />
        </View>
      </Animated.View>

      <View style={styles.inner}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.resultsCounter}>
          {hasActiveFilters
            ? filteredResults.length === 1
              ? `${filteredResults.length} resultado`
              : `${filteredResults.length} resultados`
            : totalCount == 1
              ? `${totalCount} resultado`
              : `${totalCount} resultados`}
        </Text>
      </View>
      {tagFromQuery && (
        <View style={styles.inner}>
          <Text style={styles.tagQueryHint}>
            Buscando por etiqueta: <Text style={styles.tagQueryBadge}>#{tagFromQuery}</Text>
          </Text>
        </View>
      )}

       <FlatList
        data={activeData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={!loading ? renderEmpty() : null}
        ListHeaderComponent={loading && activeData.length === 0 ? (
          <View style={styles.skeletonContainer}>
            <SkeletonContentCard />
            <SkeletonContentCard />
            <SkeletonContentCard />
          </View>
        ) : null}
        contentContainerStyle={[
          activeData.length === 0 && !loading
            ? styles.listEmptyContent
            : styles.listContent,
          { paddingBottom: navBarHeight + 20 },
        ]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore && activeData.length > 0 ? (
            <ActivityIndicator style={{ padding: 16 }} color={colors.salmon} />
          ) : null
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}
