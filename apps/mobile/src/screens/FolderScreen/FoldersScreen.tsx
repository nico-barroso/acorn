import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Image,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { styles } from './FoldersScreen.styles';
import { FolderCard } from './components/FolderCard/FolderCard';
import { NewFolderModal } from './components/NewFolderModal/NewFolderModal';
import { EditFolderModal } from './components/EditFolderModal/EditFolderModal';
import { useNavBarHeight } from '@/context/NavBarHeightContext';
import { SkeletonFolder } from '@/components/SkeletonFolder/SkeletonFolder';
import type { FolderData } from './FoldersScreen.types';
import FolderDecoration from '@/assets/svg/folder-decoration.svg';

type FoldersScreenProps = {
  folders: FolderData[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  builderOpen: boolean;
  editingFolder: FolderData | null;
  deletingFolderId: string | null;
  onNewFolder: () => void;
  onBuilderClose: () => void;
  onBuilderCreated: () => void;
  onFolderPress: (id: string) => void;
  onRefresh: () => void;
  onEditFolder: (id: string) => void;
  onEditClose: () => void;
  onEditSaved: () => void;
  onDeleteFolder: (id: string) => void;
};

export function FoldersScreen({
  folders,
  loading,
  refreshing,
  error,
  builderOpen,
  editingFolder,
  deletingFolderId,
  onNewFolder,
  onBuilderClose,
  onBuilderCreated,
  onFolderPress,
  onRefresh,
  onEditFolder,
  onEditClose,
  onEditSaved,
  onDeleteFolder,
}: FoldersScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();
  const { height: navBarHeight } = useNavBarHeight();

  const renderContent = () => {
    if (loading && !deletingFolderId) {
      return (
        <>
          <SkeletonFolder />
          <View style={styles.separator} />
          <SkeletonFolder />
          <View style={styles.separator} />
          <SkeletonFolder />
        </>
      );
    }

    if (folders.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>Todavía no tienes carpetas</Text>
          <Text style={styles.emptySubtitle}>
            Crea tu primera carpeta para organizar tus recursos.
          </Text>
        </View>
      );
    }

    return folders.map((item, index) => (
      <View key={item.id}>
        <FolderCard
          {...item}
          isDeleting={deletingFolderId === item.id}
          onPress={() => onFolderPress(item.id)}
          onRename={() => onEditFolder(item.id)}
          onDelete={() => onDeleteFolder(item.id)}
        />
        {index < folders.length - 1 && <View style={styles.separator} />}
      </View>
    ));
  };

  return (
    <View style={styles.panel}>

      <View style={styles.inner}>
        <View style={styles.headerRow}>
          <Text style={styles.heroTitle}>{'Orden\nsin esfuerzo'}</Text>
          <TouchableOpacity onPress={onNewFolder} activeOpacity={0.7}>
            <Text style={styles.newFolderLink}>+ Nueva carpeta</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.decorationShadowWrapper}>
        <FolderDecoration width={screenWidth} height={screenWidth * (193 / 375)} />
      </View>

      <View style={styles.cardWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, { paddingBottom: navBarHeight + 32 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <Text style={styles.sectionTitle}>Mis carpetas</Text>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          {renderContent()}
        </ScrollView>
      </View>

      <NewFolderModal visible={builderOpen} onClose={onBuilderClose} onCreated={onBuilderCreated} />
      <EditFolderModal
        visible={editingFolder !== null}
        folder={editingFolder}
        onClose={onEditClose}
        onSaved={onEditSaved}
      />
    </View>
  );
}
