import React, { useState } from 'react';
import {
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
import { supabase } from '../../../lib/supabase';
import { styles } from './ContentCard.styles';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

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
  onOpenDetail,
  onToggleRead,
  onTagsPress,
}: ContentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isRead = status === 'Visto';

  const handleToggleExpanded = () => {
    LayoutAnimation.configureNext({
      duration: 280,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });
    setExpanded(prev => !prev);
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
      onPress={handleToggleExpanded}
      onLongPress={() => onOpenDetail?.(id)}
    >
      <View style={styles.row}>
        <View style={styles.thumbnail}>
          {thumbnailUri ? (
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnailImage} resizeMode="cover" />
          ) : faviconUri ? (
            <Image source={{ uri: faviconUri }} style={styles.thumbnailIcon} resizeMode="contain" />
          ) : iconSource ? (
            <Image source={iconSource} style={styles.thumbnailIcon} resizeMode="contain" />
          ) : null}
        </View>
        <View style={styles.textLayout}>
          <Text style={styles.title} numberOfLines={expanded ? undefined : 2}>{title}</Text>
          <View style={styles.sourceRow}>
            {faviconUri ? <Image source={{ uri: faviconUri }} style={styles.favicon} /> : null}
            <Text style={styles.source}>{source}</Text>
          </View>
          {tags.length > 0 && (
            <View style={styles.tagsRowCollapsed}>
              {tags.map((t) => <Tag key={t.name} label={`#${t.name}`} color={t.color_hex} />)}
            </View>
          )}
        </View>
        <Text style={[styles.chevron, expanded && styles.chevronUp]}>›</Text>
      </View>

      {expanded && (
        <View style={styles.expandedSection}>
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
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Guardado:</Text>
            <Text style={styles.metaValue}>{savedDate}</Text>
            <TouchableOpacity style={styles.copyUrlButton} onPress={handleCopyUrl} activeOpacity={0.7}>
              <Text style={styles.copyUrlIcon}>⧉</Text>
              <Text style={styles.copyUrlText}>Copiar URL</Text>
            </TouchableOpacity>
          </View>
          <Button label="Abrir enlace original" onPress={handleOpenUrl} />
          {onOpenDetail ? <Button label="Ver detalle" onPress={() => onOpenDetail(id)} /> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}
