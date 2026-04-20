import React from 'react';
import { ScrollView, View } from 'react-native';
import { Pill } from '../../components/Pill/Pill';
import { styles } from './QuickFilters.styles';
import FilterIcon from '../../../../../assets/icons/search-filter-icon.svg';

const QUICK_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'unread', label: 'Sin ver' },
  { id: 'new', label: 'Nuevos' },
];

type QuickFiltersProps = {
  activeQuickFilter: string;
  hasActiveFilters: boolean;
  showFilterPanel: boolean;
  onQuickFilter: (id: string) => void;
  onToggleFilterPanel: () => void;
  onLayout: (y: number, height: number) => void;
};

export function QuickFilters({
  activeQuickFilter,
  hasActiveFilters,
  showFilterPanel,
  onQuickFilter,
  onToggleFilterPanel,
  onLayout,
}: QuickFiltersProps) {
  return (
    <View
      style={{ height: 40, marginTop: 8 }}
      onLayout={(e) => {
        const { y, height } = e.nativeEvent.layout;
        onLayout(y, height);
      }}
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillsRow}
      >
        <Pill
          icon={FilterIcon}
          label="Filtros"
          active={hasActiveFilters || showFilterPanel}
          onPress={onToggleFilterPanel}
          variant="filter"
        />
        {QUICK_FILTERS.map((f) => (
          <Pill
            key={f.id}
            label={f.label}
            active={activeQuickFilter === f.id}
            onPress={() => onQuickFilter(f.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
}
