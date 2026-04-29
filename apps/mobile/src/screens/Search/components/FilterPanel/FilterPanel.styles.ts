import { StyleSheet } from 'react-native';

import { colors } from '../../../../theme/colors';

export const styles = StyleSheet.create({
  panel: {
    marginTop: 8,
    marginBottom: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: `${colors.brown}15`,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 24,
    elevation: 12,
    maxHeight: 420,
  },
  scrollContent: {
    maxHeight: 380,
  },
  scrollContainer: {
    gap: 14,
    paddingBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 16,
    color: colors.brown,
    letterSpacing: 0.3,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: `${colors.salmon}12`,
  },
  clearText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: colors.salmon,
    letterSpacing: 0.2,
  },
  section: {
    gap: 8,
  },
  sectionLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 11,
    color: colors.brownMid,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: `${colors.brown}20`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
  },
  chipActive: {
    borderColor: colors.salmon,
    backgroundColor: `${colors.salmon}15`,
  },
  chipText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 13,
    color: colors.brownMid,
  },
  chipTextActive: {
    color: colors.salmon,
    fontFamily: 'Satoshi-Bold',
  },
  chipAction: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: `${colors.brown}30`,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: `${colors.brown}15`,
  },
  chipActionText: {
    fontFamily: 'Satoshi-Medium',
    fontSize: 13,
    color: colors.brown,
  },
});
