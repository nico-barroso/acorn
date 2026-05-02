import React, { useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  LayoutAnimation,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}
import { supabase } from '../../../lib/supabase';
import { styles } from './ContentCard.styles';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';
import FileIcon from '../../../assets/icons/file-icon.svg';

type TagItem = { name: string; color_hex: string | null };

export interface ContentCardProps {
  id: string;
  title: string;
  source: string;
  tags?: TagItem[];
  savedDate?: string;
  status?: 'No visto' | 'Visto';
  url?: string;
  thumbnailUri?: string;
  faviconUri?: string;
  iconSource?: ImageSourcePropType;
  isFile?: boolean;
  onOpenDetail?: (id: string) => void;
  onToggleRead?: (id: string, nextRead: boolean) => void;
  onTagsPress?: (id: string) => void;
}

export function ContentCard({
  id,
  title,
  source,
  tags = [],
  savedDate = 'Hace dos días',
  status = 'No visto',
  url,
  thumbnailUri,
  faviconUri,
  iconSource,
  isFile = false,
  onOpenDetail,
  onToggleRead,
  onTagsPress,
}: ContentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [tagsVisible, setTagsVisible] = useState(true);
  const [contentHeight, setContentHeight] = useState(0);
  const animHeight = useRef(new Animated.Value(0)).current;
  const isRead = status === 'Visto';

  const toggle = () => {
    const toExpand = !expanded;
    setExpanded(toExpand);

    LayoutAnimation.configureNext({
      duration: 220,
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
    setTagsVisible(!toExpand);

    if (toExpand) {
      Animated.spring(animHeight, {
        toValue: contentHeight,
        speed: 14,
        bounciness: 2,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(animHeight, {
        toValue: 0,
        duration: 220,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: false,
      }).start();
    }
  };

  const handleCopyUrl = () => {
    console.log('Copiar URL:', url);
  };

  const handleOpenUrl = async () => {
    if (!url) return;

    const storageMarker = '/object/public/user-files/';
    const markerIndex = url.indexOf(storageMarker);

    if (markerIndex !== -1) {
      const storagePath = decodeURIComponent(url.slice(markerIndex + storageMarker.length));
      const { data: signed } = await supabase.storage
        .from('user-files')
        .createSignedUrl(storagePath, 3600);

      if (signed?.signedUrl) {
        void Linking.openURL(signed.signedUrl);
        return;
      }
    }

    void Linking.openURL(url);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={toggle}
      onLongPress={() => onOpenDetail?.(id)}
    >
      <View style={styles.row}>
        <View style={styles.thumbnail}>
          {thumbnailUri ? (
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnailImage} resizeMode="cover" />
          ) : isFile ? (
            <FileIcon width={62} height={62} />
          ) : faviconUri ? (
            <Image source={{ uri: faviconUri }} style={styles.thumbnailIcon} resizeMode="contain" />
          ) : iconSource ? (
            <Image source={iconSource} style={styles.thumbnailIcon} resizeMode="contain" />
          ) : null}
        </View>
        <View style={styles.textLayout}>
          <Text style={styles.title} numberOfLines={expanded ? undefined : 2}>{title}</Text>
          <View style={styles.sourceRow}>
            <Text style={styles.sourceEmoji}>{isFile ? '📄' : '🔗'}</Text>
            <Text style={styles.source}>{source}</Text>
          </View>
          {tags.length > 0 && tagsVisible ? (
            <View style={styles.tagsRowCollapsed}>
              {tags.map((t) => <Tag key={t.name} label={`#${t.name}`} color={t.color_hex} />)}
            </View>
          ) : null}
        </View>
        <Text style={[styles.chevron, expanded && styles.chevronUp]}>›</Text>
      </View>

      <Animated.View style={{ height: animHeight, overflow: 'hidden' }}>
        <View
          style={styles.expandedSection}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && h !== contentHeight) {
              setContentHeight(h);
              if (expanded) animHeight.setValue(h);
            }
          }}
        >
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Estado:</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{status}</Text>
              <Text style={styles.statusIcon}>👁</Text>
            </View>
            {onToggleRead ? (
              <TouchableOpacity
                style={styles.readToggleButton}
                onPress={() => onToggleRead(id, !isRead)}
                activeOpacity={0.7}
              >
                <Text style={styles.readToggleText}>
                  {isRead ? 'Marcar como no visto' : 'Marcar como visto'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
          <View style={styles.tagsSection}>
            <View style={styles.tagsSectionHeader}>
              <Text style={styles.metaLabel}>Etiquetas</Text>
              {onTagsPress && (
                <TouchableOpacity onPress={() => onTagsPress(id)} activeOpacity={0.7} style={styles.addTagButton}>
                  <Text style={styles.addTagIcon}>+</Text>
                </TouchableOpacity>
              )}
              {tags.length > 0 && tags.map((t) => <Tag key={t.name} label={`#${t.name}`} color={t.color_hex} />)}
            </View>
          </View>

          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Guardado:</Text>
            <Text style={styles.metaValue}>{savedDate}</Text>
            <TouchableOpacity style={styles.copyUrlButton} onPress={handleCopyUrl} activeOpacity={0.7}>
              <Text style={styles.copyUrlIcon}>⧉</Text>
              <Text style={styles.copyUrlText}>Copiar URL</Text>
            </TouchableOpacity>
          </View>
          <Button label="Abrir enlace original" onPress={handleOpenUrl} />
          {onOpenDetail ? (
            <TouchableOpacity onPress={() => onOpenDetail(id)} activeOpacity={0.7} style={styles.detailLink}>
              <Text style={styles.detailLinkText}>Ver detalles</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
