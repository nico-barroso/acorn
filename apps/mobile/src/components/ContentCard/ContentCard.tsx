import React, { useRef, useState } from 'react';
import {
  Animated,
  Image,
  ImageBackground,
  ImageSourcePropType,
  LayoutAnimation,
  Linking,
  Platform,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../../lib/supabase';
import { styles } from './ContentCard.styles';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';
import { colors } from '../../theme/colors';

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
  const isRead = status === 'Visto';

  const collapsedOpacity = useRef(new Animated.Value(1)).current;
  const expandedOpacity = useRef(new Animated.Value(0)).current;

  const handleToggleExpanded = () => {
    const toExpand = !expanded;

    LayoutAnimation.configureNext({
      duration: 280,
      create: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: { type: LayoutAnimation.Types.easeInEaseOut, property: LayoutAnimation.Properties.opacity },
    });

    if (toExpand) {
      Animated.timing(collapsedOpacity, { toValue: 0, duration: 160, useNativeDriver: true }).start(() => {
        setExpanded(true);
        Animated.timing(expandedOpacity, { toValue: 1, duration: 220, useNativeDriver: true }).start();
      });
    } else {
      Animated.timing(expandedOpacity, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
        setExpanded(false);
        Animated.timing(collapsedOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
      });
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

  if (isFile) console.log('[ContentCard] isFile=true thumbnailUri=', thumbnailUri, 'id=', id);

  const sourceIcon = faviconUri
    ? <Image source={{ uri: faviconUri }} style={styles.favicon} />
    : iconSource
      ? <Image source={iconSource} style={styles.favicon} />
      : null;

  // Archivos y links con imagen usan el layout de thumbnail
  if (thumbnailUri || isFile) {
    const filePlaceholder = !thumbnailUri && isFile;

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={handleToggleExpanded}
        onLongPress={() => onOpenDetail?.(id)}
      >
        {/* ── COLLAPSED ── */}
        {!expanded && (
          <Animated.View style={{ opacity: collapsedOpacity }}>
            <View style={styles.thumbnailRight}>
              {filePlaceholder ? (
                <LinearGradient
                  colors={[colors.brownMid, colors.salmon]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.filePlaceholderGradient}
                >
                  <Text style={styles.filePlaceholderEmoji}>📄</Text>
                </LinearGradient>
              ) : (
                <Image source={{ uri: thumbnailUri }} style={styles.thumbnailRightImage} />
              )}
              <LinearGradient
                colors={[colors.white, colors.white, 'transparent']}
                locations={[0, 0.35, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.thumbnailRightGradient}
              />
            </View>
            <View style={styles.row}>
              <View style={styles.textLayout}>
                <Text style={styles.title} numberOfLines={2}>{title}</Text>
                <View style={styles.sourceRow}>
                  {sourceIcon}
                  <Text style={styles.source}>{source}</Text>
                </View>
                {tags.length > 0 && (
                  <View style={styles.tagsRowCollapsed}>
                    {tags.map((t) => <Tag key={t.name} label={`#${t.name}`} color={t.color_hex} />)}
                  </View>
                )}
              </View>
              <Text style={styles.chevron}>›</Text>
            </View>
          </Animated.View>
        )}

        {/* ── EXPANDED HERO ── */}
        {expanded && (
          <Animated.View style={{ opacity: expandedOpacity }}>
            {filePlaceholder ? (
              <LinearGradient
                colors={[colors.brownMid, colors.salmon]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroImageBg}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(15,8,4,0.72)']}
                  style={styles.heroGradient}
                />
                <View style={styles.heroContent}>
                  <Text style={styles.heroTitle} numberOfLines={3}>{title}</Text>
                  <View style={styles.sourceRow}>
                    {sourceIcon}
                    <Text style={styles.heroSource}>{source}</Text>
                  </View>
                  {tags.length > 0 && (
                  <View style={styles.tagsRowCollapsed}>
                    {tags.map((t) => <Tag key={t.name} label={`#${t.name}`} color={t.color_hex} />)}
                  </View>
                )}
                </View>
              </LinearGradient>
            ) : (
              <ImageBackground
                source={{ uri: thumbnailUri }}
                style={styles.heroImageBg}
                imageStyle={styles.heroImageBgImage}
              >
                <LinearGradient
                  colors={['transparent', 'rgba(15,8,4,0.72)']}
                  style={styles.heroGradient}
                />
                <View style={styles.heroContent}>
                  <Text style={styles.heroTitle} numberOfLines={3}>{title}</Text>
                  <View style={styles.sourceRow}>
                    {sourceIcon}
                    <Text style={styles.heroSource}>{source}</Text>
                  </View>
                  {tags.length > 0 && (
                  <View style={styles.tagsRowCollapsed}>
                    {tags.map((t) => <Tag key={t.name} label={`#${t.name}`} color={t.color_hex} />)}
                  </View>
                )}
                </View>
              </ImageBackground>
            )}

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
              <View style={styles.tagsSection}>
                <View style={styles.tagsSectionHeader}>
                  <Text style={styles.metaLabel}>Etiquetas</Text>
                  {onTagsPress && (
                    <TouchableOpacity onPress={() => onTagsPress(id)} activeOpacity={0.7} style={styles.addTagButton}>
                      <Text style={styles.addTagIcon}>+</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {tags.length > 0 ? (
                  <View style={styles.tagsRow}>
                    {tags.map((t) => <Tag key={t.name} label={`#${t.name}`} color={t.color_hex} />)}
                  </View>
                ) : (
                  <Text style={styles.noTagsHint}>Toca + para añadir etiquetas</Text>
                )}
              </View>
              <Button label="Abrir enlace original" onPress={handleOpenUrl} />
              {onOpenDetail ? <Button label="Ver detalle" onPress={() => onOpenDetail(id)} /> : null}
            </View>
          </Animated.View>
        )}
      </TouchableOpacity>
    );
  }

  // ── SIN THUMBNAIL (solo links sin imagen) ──
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={handleToggleExpanded}
      onLongPress={() => onOpenDetail?.(id)}
    >
      <View style={styles.row}>
        <View style={styles.thumbnail}>
          {iconSource ? (
            <Image source={iconSource} style={styles.thumbnailImage} />
          ) : (
            <View style={styles.thumbnailPlaceholder} />
          )}
        </View>
        <View style={styles.textLayout}>
          <Text style={styles.title} numberOfLines={expanded ? undefined : 2}>{title}</Text>
          <View style={styles.sourceRow}>
            {faviconUri ? <Image source={{ uri: faviconUri }} style={styles.favicon} /> : null}
            <Text style={styles.source}>{source}</Text>
          </View>
          <Tag label={tag} />
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
