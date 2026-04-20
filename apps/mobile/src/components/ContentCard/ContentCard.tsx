import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  ImageSourcePropType,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { styles } from './ContentCard.styles';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

export interface ContentCardProps {
  id: string;
  title: string;
  source: string;
  tag: string;
  savedDate?: string;
  status?: 'No visto' | 'Visto';
  url?: string;
  thumbnailUri?: string;
  iconSource?: ImageSourcePropType;
  onOpenDetail?: (id: string) => void;
  onToggleRead?: (id: string, nextRead: boolean) => void;
}

export function ContentCard({
  id,
  title,
  source,
  tag,
  savedDate = 'Hace dos días',
  status = 'No visto',
  url,
  thumbnailUri,
  iconSource,
  onOpenDetail,
  onToggleRead,
}: ContentCardProps) {
  const [expanded, setExpanded] = useState(false);
  const isRead = status === 'Visto';

  const handleToggleExpanded = () => {
    LayoutAnimation.configureNext({
      duration: 150,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: {
        type: LayoutAnimation.Types.easeInEaseOut,
      },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
    setExpanded(!expanded);
  };

  const handleCopyUrl = () => {
    // TODO: Clipboard.setStringAsync(url ?? '') con expo-clipboard
    console.log('Copiar URL:', url);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={handleToggleExpanded}
      onLongPress={() => onOpenDetail?.(id)}
    >
      {/* Fila principal — siempre visible */}
      <View style={styles.row}>
        <View style={styles.thumbnail}>
          {thumbnailUri ? (
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnailImage} />
          ) : iconSource ? (
            <Image source={iconSource} style={styles.thumbnailImage} />
          ) : (
            <View style={styles.thumbnailPlaceholder} />
          )}
        </View>
        <View style={styles.textLayout}>
          <Text style={styles.title} numberOfLines={expanded ? undefined : 2}>
            {title}
          </Text>
          <Text style={styles.source}>{source}</Text>
          <Tag label={tag} />
        </View>
        <Text style={[styles.chevron, expanded && styles.chevronUp]}>›</Text>
      </View>

      {/* Sección expandida */}
      {expanded && (
        <View style={styles.expandedSection}>
          {/* Estado */}
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

          {/* Guardado + Copiar URL */}
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Guardado:</Text>
            <Text style={styles.metaValue}>{savedDate}</Text>
            <TouchableOpacity
              style={styles.copyUrlButton}
              onPress={handleCopyUrl}
              activeOpacity={0.7}
            >
              <Text style={styles.copyUrlIcon}>⧉</Text>
              <Text style={styles.copyUrlText}>Copiar URL</Text>
            </TouchableOpacity>
          </View>

          {/* Botón abrir enlace */}
          <Button label="Abrir enlace original" onPress={() => url && Linking.openURL(url)} />
          {onOpenDetail ? <Button label="Ver detalle" onPress={() => onOpenDetail(id)} /> : null}
        </View>
      )}
    </TouchableOpacity>
  );
}
