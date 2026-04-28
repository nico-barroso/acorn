import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './FolderOptionsMenu.styles';

type FolderOptionsMenuProps = {
  visible: boolean;
  top: number;
  right: number;
  onRename: () => void;
  onDelete: () => void;
  onDismiss: () => void;
};

export function FolderOptionsMenu({
  visible,
  top,
  right,
  onRename,
  onDelete,
  onDismiss,
}: FolderOptionsMenuProps) {
  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss}>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onDismiss}>
        <View style={[styles.menu, { top, right }]}>
          <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={onRename}>
            <Text style={styles.optionIcon}>✏️</Text>
            <Text style={styles.optionLabel}>Cambiar nombre</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.option} activeOpacity={0.7} onPress={onDelete}>
            <Text style={styles.optionIcon}>🗑️</Text>
            <Text style={styles.optionLabelDestructive}>Eliminar carpeta</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
