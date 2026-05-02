import { useRef, useState } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './FolderCard.styles';
import FolderBrownIcon from '../../assets/folder-brown-icon.svg';
import { FolderOptionsMenu } from '@/screens/FolderScreen/components/FolderOptionsMenu/FolderOptionsMenu';

type FolderCardProps = {
  name: string;
  description?: string;
  iconSource?: number;
  isDeleting?: boolean;
  onPress: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export function FolderCard({ name, description, iconSource, isDeleting, onPress, onRename, onDelete }: FolderCardProps) {
  const menuButtonRef = useRef<View>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0 });

  const handleMenuPress = () => {
    menuButtonRef.current?.measure((_x, _y, width, height, pageX, pageY) => {
      const screenWidth = Dimensions.get('window').width;
      setMenuPos({
        top: pageY + height + 4,
        right: screenWidth - pageX - width,
      });
      setMenuVisible(true);
    });
  };

  return (
    <TouchableOpacity style={[styles.card, isDeleting && { opacity: 0.4 }]} activeOpacity={0.85} onPress={onPress} onLongPress={onRename} disabled={isDeleting}>
      {iconSource ? (
        <Image source={iconSource} style={styles.folderIcon} resizeMode="contain" />
      ) : (
        <View style={styles.folderIcon}>
          <FolderBrownIcon width="100%" height="100%" />
        </View>
      )}
      <View style={styles.textBlock}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {description ? (
          <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>
        ) : null}
      </View>
      <View ref={menuButtonRef}>
        <TouchableOpacity
          style={styles.menuButton}
          activeOpacity={0.7}
          onPress={handleMenuPress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.menuIcon}>⋮</Text>
        </TouchableOpacity>
      </View>

      <FolderOptionsMenu
        visible={menuVisible}
        top={menuPos.top}
        right={menuPos.right}
        onRename={() => {
          setMenuVisible(false);
          onRename();
        }}
        onDelete={() => {
          setMenuVisible(false);
          onDelete();
        }}
        onDismiss={() => setMenuVisible(false)}
      />
    </TouchableOpacity>
  );
}
