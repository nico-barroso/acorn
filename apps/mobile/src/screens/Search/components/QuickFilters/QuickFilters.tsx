import React from 'react';
import { ScrollView, View } from 'react-native';
import { Pill } from '@/screens/Search/components/Pill/Pill';
import { styles } from './QuickFilters.styles';
import FilterIcon from '../../assets/search-filter-icon.svg';

const QUICK_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'unread', label: 'Sin ver' },
  { id: 'new', label: 'Nuevos' },
];

type QuickFiltersProps = {
  activeQuickFilter: string | null;
  hasActiveFilters: boolean;
  showFilterPanel: boolean;
  onQuickFilter: (id: string) => void;
  onToggleFilterPanel: () => void;
  onLayout: (y: number, height: number) => void;
  hideFilterButton?: boolean;
};

export function QuickFilters({
  activeQuickFilter,
  hasActiveFilters,
  showFilterPanel,
  onQuickFilter,
  onToggleFilterPanel,
  onLayout,
  hideFilterButton = false,
}: QuickFiltersProps) {
  const pills = QUICK_FILTERS.map((f) => (
    <Pill
      key={f.id}
      label={f.label}
      active={activeQuickFilter === f.id}
      onPress={() => onQuickFilter(f.id)}
    />
  ));

  return (
    <View
      style={{ height: 40, marginTop: 8 }}
      onLayout={(e) => {
        const { y, height } = e.nativeEvent.layout;
        onLayout(y, height);
      }}
    >
      {hideFilterButton ? (
        <View style={[styles.pillsRow, { justifyContent: 'center' }]}>
          {pills}
        </View>
      ) : (
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
          {pills}
        </ScrollView>
      )}
    </View>
  );
}
