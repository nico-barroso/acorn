import React from 'react';
import { ActivityIndicator, FlatList, ImageBackground, Image, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FilterPanel } from './components/FilterPanel/FilterPanel';
import { QuickFilters } from './components/QuickFilters/QuickFilters';
import { styles } from './Search.styles';
import { useSearch } from './hooks/useSearch';
import type { SearchResult, SearchScreenProps } from './types';
import { Input as SearchInput } from '../../components/Input/Input';
import SearchIcon from '../../../assets/icons/search-icon.svg';
import { colors } from '../../theme/colors';
import { ContentCard } from '../../components/ContentCard/ContentCard';

export function SearchScreen({ onBack, onOpenDetail }: SearchScreenProps) {
  const {
    query,
    setQuery,
    loading,
    loadingMore,
    loadMore,
    error,
    filteredResults,
    results,
    domainOptions,
    tagOptions,
    selectedDomain,
    setSelectedDomain,
    selectedTag,
    setSelectedTag,
    selectedDate,
    setSelectedDate,
    selectedRead,
    setSelectedRead,
    hasActiveFilters,
    clearFilters,
  } = useSearch();

  const insets = useSafeAreaInsets();
  const [showFilterPanel, setShowFilterPanel] = React.useState(false);

  const activeData = query.trim() ? filteredResults : results;

  const handleQuickFilter = (id: string) => {
    if (id === 'all') {
      setSelectedRead('all');
      setSelectedDate('all');
    } else if (id === 'unread') {
      setSelectedRead('unread');
      setSelectedDate('all');
    } else if (id === 'new') {
      setSelectedRead('all');
      setSelectedDate('7d');
    }
  };

  const activeQuickFilter =
    selectedRead === 'unread' ? 'unread' : selectedDate === '7d' ? 'new' : 'all';

  const renderEmpty = () => {
    if (loading)
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator />
          <Text style={styles.emptyTitle}>Buscando...</Text>
        </View>
      );

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

  const renderItem = ({ item }: { item: SearchResult }) => (
    <ContentCard
      id={item.id}
      title={item.title}
      source={item.domain}
      tag={item.tags && item.tags.length > 0 ? item.tags[0] : 'General'}
      savedDate={new Date(item.createdAt).toLocaleDateString()}
      status={item.isRead ? 'Visto' : 'No visto'}
      url={item.url}
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
          hasActiveFilters={hasActiveFilters}
          showFilterPanel={showFilterPanel}
          onQuickFilter={handleQuickFilter}
          onToggleFilterPanel={() => setShowFilterPanel((v) => !v)}
          onLayout={() => {}}
        />
      </View>
      <View style={styles.inner}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.resultsCounter}>
          {activeData.length == 1
            ? `${activeData.length} resultado`
            : `${activeData.length} resultados`}
          {hasActiveFilters ? ` · Hay filtros activos` : ''}
        </Text>
      </View>
      {showFilterPanel && (
        <View style={styles.filterPanel}>
          <FilterPanel
            domains={domainOptions}
            tags={tagOptions}
            selectedDomain={selectedDomain}
            selectedTag={selectedTag}
            selectedDate={selectedDate}
            selectedRead={selectedRead}
            onSelectDomain={setSelectedDomain}
            onSelectTag={setSelectedTag}
            onSelectDate={setSelectedDate}
            onSelectRead={setSelectedRead}
            onClear={clearFilters}
          />
        </View>
      )}

      <FlatList
        data={activeData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          activeData.length === 0 ? styles.listEmptyContent : styles.listContent
        }
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
