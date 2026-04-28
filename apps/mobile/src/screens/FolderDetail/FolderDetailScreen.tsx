import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileHeader } from '../../components/ProfileHeader/ProfileHeader';
import { styles } from './FolderDetail.styles';
import { useFolderDetail } from './hooks/useFolderDetail';
import { QuickFilters } from '../Search/components/QuickFilters/QuickFilters';
import { ContentCard } from '../../components/ContentCard/ContentCard';
import { colors } from '../../theme/colors';
import type { FolderDetailScreenProps, FolderResource } from './FolderDetail.types';

export function FolderDetailScreen({
  folderId,
  onBack,
  onOpenDetail,
}: FolderDetailScreenProps) {
  const {
    folderName,
    loading,
    resources,
    activeQuickFilter,
    hasActiveFilters,
    onQuickFilter,
    error,
  } = useFolderDetail(folderId);

  const insets = useSafeAreaInsets();

  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.salmon} />
          <Text style={styles.emptyTitle}>Cargando recursos...</Text>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Esta carpeta está vacía</Text>
        <Text style={styles.emptySubtitle}>
          Los recursos que guardes aparecerán aquí.
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: FolderResource }) => (
    <ContentCard
      id={item.id}
      title={item.title}
      source={item.source}
      tag={item.tag}
      savedDate={item.savedDate}
      status={item.status}
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

      <ProfileHeader title={folderName || 'Carpeta'} onBack={onBack} />

      <View style={{ marginTop: 16 }}>
        <QuickFilters
          activeQuickFilter={activeQuickFilter}
          hasActiveFilters={hasActiveFilters}
          showFilterPanel={false}
          onQuickFilter={onQuickFilter}
          onToggleFilterPanel={() => {}}
          onLayout={() => {}}
        />
      </View>

      <View style={styles.inner}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Text style={styles.resultsCounter}>
          {resources.length === 1
            ? `${resources.length} recurso`
            : `${resources.length} recursos`}
        </Text>
      </View>

      <FlatList
        data={resources}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={
          resources.length === 0 ? styles.listEmptyContent : styles.listContent
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}