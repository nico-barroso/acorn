import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { supabase } from '@mobile/lib/supabase';
import { useSession } from '@/context/SessionContext';
import { colors } from '@/theme/colors';

type FolderOption = { id: string; name: string };

type Props = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  disabled?: boolean;
};

export function FolderSelectorSection({ selectedIds, onChange, disabled }: Props) {
  const { session } = useSession();
  const user = session?.user;
  const [folders, setFolders] = useState<FolderOption[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFolders = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('smart_folders')
      .select('id,name')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setFolders((data ?? []).map((row) => ({ id: row.id, name: row.name ?? 'Carpeta sin nombre' })));
    setLoading(false);
  }, [user]);

  useEffect(() => { void loadFolders(); }, [loadFolders]);

  if (!loading && folders.length === 0) return null;

  const toggle = (id: string) => {
    onChange(selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Carpetas</Text>
      {loading ? (
        <ActivityIndicator size="small" color={colors.salmon} style={{ alignSelf: 'flex-start' }} />
      ) : (
        <View style={styles.chips}>
          {folders.map((folder) => {
            const selected = selectedIds.includes(folder.id);
            return (
              <TouchableOpacity
                key={folder.id}
                style={[styles.chip, selected && styles.chipSelected]}
                onPress={() => toggle(folder.id)}
                activeOpacity={0.75}
                disabled={disabled}
              >
                <Text style={[styles.chipLabel, selected && styles.chipLabelSelected]}>
                  {folder.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
    marginBottom: 10,
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
  chipSelected: {
    backgroundColor: colors.brownMid,
  },
  chipLabel: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  chipLabelSelected: {
    color: colors.white,
  },
});
