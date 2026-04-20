import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './FilterPanel.styles';
import { FilterPanelProps, DateFilterValue, ReadFilterValue } from '../../types';

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function Chip({ label, active, onPress }: ChipProps) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const DATE_OPTIONS: { label: string; value: DateFilterValue }[] = [
  { label: 'Todas', value: 'all' },
  { label: '7 días', value: '7d' },
  { label: '30 días', value: '30d' },
  { label: '12 meses', value: '365d' },
];

const READ_OPTIONS: { label: string; value: ReadFilterValue }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'No visto', value: 'unread' },
  { label: 'Visto', value: 'read' },
];

export function FilterPanel({
  domains,
  tags,
  selectedDomain,
  selectedTag,
  selectedDate,
  selectedRead,
  onSelectDomain,
  onSelectTag,
  onSelectDate,
  onSelectRead,
  onClear,
}: FilterPanelProps) {
  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Filtros</Text>
        <TouchableOpacity onPress={onClear} activeOpacity={0.8}>
          <Text style={styles.clearText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Dominio</Text>
        <View style={styles.chipsWrap}>
          <Chip
            label="Todos"
            active={selectedDomain === null}
            onPress={() => onSelectDomain(null)}
          />
          {domains.map((domain) => (
            <Chip
              key={domain}
              label={domain}
              active={selectedDomain === domain}
              onPress={() => onSelectDomain(selectedDomain === domain ? null : domain)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Etiqueta</Text>
        <View style={styles.chipsWrap}>
          <Chip label="Todas" active={selectedTag === null} onPress={() => onSelectTag(null)} />
          {tags.map((tag) => (
            <Chip
              key={tag}
              label={`#${tag}`}
              active={selectedTag === tag}
              onPress={() => onSelectTag(selectedTag === tag ? null : tag)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Fecha</Text>
        <View style={styles.chipsWrap}>
          {DATE_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={selectedDate === o.value}
              onPress={() => onSelectDate(o.value)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>Estado</Text>
        <View style={styles.chipsWrap}>
          {READ_OPTIONS.map((o) => (
            <Chip
              key={o.value}
              label={o.label}
              active={selectedRead === o.value}
              onPress={() => onSelectRead(o.value)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}
