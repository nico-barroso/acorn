import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '@mobile/lib/supabase';
import { useSession } from '@/context/SessionContext';
import { TagPickerModal } from '@/components/TagPickerModal/TagPickerModal';
import { colors } from '@/theme/colors';

type TagOption = { id: string; name: string; color_hex: string | null };

type Props = {
  onTagsChange: (tagNames: string[]) => void;
  disabled?: boolean;
};

const MAX_TAGS = 4;

export function TagSelectorSection({ onTagsChange, disabled }: Props) {
  const { session } = useSession();
  const user = session?.user;
  const [allTags, setAllTags] = useState<TagOption[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const loadTags = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('tags')
      .select('id,name,color_hex')
      .eq('user_id', user.id)
      .order('name');
    setAllTags((data ?? []) as TagOption[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { void loadTags(); }, [loadTags]);

  const toggleTag = (id: string) => {
    const newIds = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : selectedIds.length < MAX_TAGS
        ? [...selectedIds, id]
        : selectedIds;
    setSelectedIds(newIds);
    onTagsChange(allTags.filter((t) => newIds.includes(t.id)).map((t) => t.name));
  };

  const handleModalClose = () => {
    setModalVisible(false);
    void loadTags();
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>Etiquetas</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.7} disabled={disabled}>
          <Text style={styles.createBtn}>+ Crear etiqueta</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color={colors.salmon} style={{ alignSelf: 'flex-start' }} />
      ) : allTags.length === 0 ? (
        <Text style={styles.empty}>Sin etiquetas aún. Crea una arriba.</Text>
      ) : (
        <View style={styles.chips}>
          {allTags.map((tag) => {
            const selected = selectedIds.includes(tag.id);
            const chipDisabled = disabled || (!selected && selectedIds.length >= MAX_TAGS);
            return (
              <TouchableOpacity
                key={tag.id}
                style={[styles.chip, selected && { backgroundColor: tag.color_hex ?? colors.brownMid }]}
                onPress={() => toggleTag(tag.id)}
                activeOpacity={0.75}
                disabled={chipDisabled}
              >
                <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>#{tag.name}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <TagPickerModal
        visible={modalVisible}
        itemId={null}
        onClose={handleModalClose}
        onSaved={handleModalClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  createBtn: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.salmon,
    textDecorationLine: 'underline',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.brownMid,
  },
  chipLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  chipLabelSelected: {
    color: colors.white,
  },
  empty: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
    fontStyle: 'italic',
  },
});
