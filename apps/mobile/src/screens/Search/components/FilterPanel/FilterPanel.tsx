import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './FilterPanel.styles';
import { FilterPanelProps, DateFilterValue, ReadFilterValue, TypeFilterValue } from '../../types';

type ChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
  variant?: 'default' | 'action';
};

function Chip({ label, active, onPress, variant = 'default' }: ChipProps) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        active && styles.chipActive,
        variant === 'action' && styles.chipAction,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[
        styles.chipText,
        active && styles.chipTextActive,
        variant === 'action' && styles.chipActionText,
      ]}>{label}</Text>
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

const TYPE_OPTIONS: { label: string; value: TypeFilterValue }[] = [
  { label: 'Todos', value: 'all' },
  { label: 'Enlace', value: 'link' },
  { label: 'Archivo', value: 'file' },
];

export function FilterPanel({
  domains,
  tags,
  selectedDomain,
  selectedTag,
  selectedDate,
  selectedRead,
  selectedType,
  onSelectDomain,
  onSelectTag,
  onSelectDate,
  onSelectRead,
  onSelectType,
  onClear,
}: FilterPanelProps) {
  const [showAllDomains, setShowAllDomains] = useState(false);

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Filtros</Text>
        <TouchableOpacity
          style={styles.clearButton}
          onPress={onClear}
          activeOpacity={0.7}
        >
          <Text style={styles.clearText}>Limpiar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Dominio</Text>
          <View style={styles.chipsWrap}>
            <Chip
              label="Todos"
              active={selectedDomain === null}
              onPress={() => onSelectDomain(null)}
            />
            {!showAllDomains ? (
              <>
                {domains.slice(0, 2).map((domain) => (
                  <Chip
                    key={domain}
                    label={domain}
                    active={selectedDomain === domain}
                    onPress={() => onSelectDomain(selectedDomain === domain ? null : domain)}
                  />
                ))}
                {domains.length > 3 && (
                  <Chip
                    label="..."
                    active={false}
                    onPress={() => setShowAllDomains(true)}
                    variant="action"
                  />
                )}
              </>
            ) : (
              <>
                {domains.map((domain) => (
                  <Chip
                    key={domain}
                    label={domain}
                    active={selectedDomain === domain}
                    onPress={() => onSelectDomain(selectedDomain === domain ? null : domain)}
                  />
                ))}
                <Chip
                  label="Ver menos"
                  active={false}
                  onPress={() => setShowAllDomains(false)}
                  variant="action"
                />
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Etiqueta</Text>
          <View style={styles.chipsWrap}>
            <Chip label="Todas" active={selectedTag === null} onPress={() => onSelectTag(null)} />
            {tags.map((tag) => {
              const isActive = selectedTag?.toLowerCase() === tag.toLowerCase();
              return (
                <Chip
                  key={tag}
                  label={`#${tag}`}
                  active={isActive}
                  onPress={() => onSelectTag(isActive ? null : tag)}
                />
              );
            })}
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

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Tipo</Text>
          <View style={styles.chipsWrap}>
            {TYPE_OPTIONS.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                active={selectedType === o.value}
                onPress={() => onSelectType(o.value)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
