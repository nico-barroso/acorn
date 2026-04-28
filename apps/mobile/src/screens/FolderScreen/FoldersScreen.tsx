import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
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
import { RenameFolderModal } from './components/RenameFolderModal/RenameFolderModal';
import { colors } from '../../theme/colors';
import type { FolderData } from './FoldersScreen.types';
import FolderDecoration from '@assets/svg/folder-decoration.svg';

type FoldersScreenProps = {
  folders: FolderData[];
  loading: boolean;
  refreshing: boolean;
  error: string;
  builderOpen: boolean;
  renamingFolder: FolderData | null;
  deletingFolderId: string | null;
  onNewFolder: () => void;
  onBuilderClose: () => void;
  onBuilderCreated: () => void;
  onFolderPress: (id: string) => void;
  onRefresh: () => void;
  onRenameFolder: (id: string) => void;
  onRenameClose: () => void;
  onRenameConfirmed: (newName: string) => void;
  onDeleteFolder: (id: string) => void;
};

export function FoldersScreen({
  folders,
  loading,
  refreshing,
  error,
  builderOpen,
  renamingFolder,
  deletingFolderId,
  onNewFolder,
  onBuilderClose,
  onBuilderCreated,
  onFolderPress,
  onRefresh,
  onRenameFolder,
  onRenameClose,
  onRenameConfirmed,
  onDeleteFolder,
}: FoldersScreenProps) {
  const insets = useSafeAreaInsets();
  const { width: screenWidth } = useWindowDimensions();

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.emptyState}>
          <ActivityIndicator color={colors.salmon} />
          <Text style={styles.emptyTitle}>Cargando carpetas...</Text>
        </View>
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

    return (
      <>
        <View style={[styles.decorationShadowWrapper, { marginHorizontal: -25 }]}>
          <FolderDecoration width={screenWidth} height={screenWidth * (193 / 375)} />
        </View>
        <View style={styles.cardWrapper}>
          <Text style={styles.sectionTitle}>Mis carpetas</Text>
          {folders.map((item, index) => (
            <View key={item.id}>
              <FolderCard
                {...item}
                isDeleting={deletingFolderId === item.id}
                onPress={() => onFolderPress(item.id)}
                onRename={() => onRenameFolder(item.id)}
                onDelete={() => onDeleteFolder(item.id)}
              />
              {index < folders.length - 1 && <View style={styles.separator} />}
            </View>
          ))}
        </View>
      </>
    );
  };

  return (
    <View style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Image
          source={require('@assets/search-top-drop-gradient.webp')}
          style={[styles.topGradient, { height: 220 + insets.top }]}
          resizeMode="stretch"
        />
        <View style={[styles.heroContainer, { paddingTop: insets.top + 16 }]}>
          <Text style={styles.heroTitle}>{'Orden\nsin esfuerzo'}</Text>
          <TouchableOpacity onPress={onNewFolder} activeOpacity={0.7}>
            <Text style={styles.newFolderLink}>+ Nueva carpeta</Text>
          </TouchableOpacity>
        </View>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        {renderContent()}
      </ScrollView>
      <NewFolderModal visible={builderOpen} onClose={onBuilderClose} onCreated={onBuilderCreated} />
      <RenameFolderModal
        visible={renamingFolder !== null}
        currentName={renamingFolder?.name ?? ''}
        onClose={onRenameClose}
        onRenamed={onRenameConfirmed}
      />
    </View>
  );
}
