import { StyleSheet } from 'react-native';

import { colors } from '../../../../theme/colors';

export const styles = StyleSheet.create({
  panel: {
    marginTop: 10,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.brown}22`,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 18,
    color: colors.brown,
  },
  clearText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: colors.salmon,
  },
  section: {
    gap: 6,
  },
  sectionLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: colors.brownMid,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: `${colors.brown}28`,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.background,
  },
  chipActive: {
    borderColor: colors.salmon,
    backgroundColor: `${colors.salmon}20`,
  },
  chipText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brownMid,
  },
  chipTextActive: {
    color: colors.brown,
    fontFamily: 'Satoshi-Bold',
  },
});
