import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 27, 27, 0.45)',
    justifyContent: 'flex-end',
  },
  panel: {
    maxHeight: '94%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 28,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 24,
    color: colors.brown,
  },
  closeLabel: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 14,
    color: colors.salmon,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 12,
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  sectionLabel: {
    marginTop: 10,
    marginBottom: 6,
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: colors.brownMid,
  },
  input: {
    width: '100%',
    minHeight: 44,
    borderWidth: 1,
    borderColor: `${colors.brown}30`,
    borderRadius: 12,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.black,
  },
  textarea: {
    minHeight: 76,
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  ruleCard: {
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.brown}18`,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  ruleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ruleTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 17,
    color: colors.black,
  },
  removeRuleText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 12,
    color: '#8b2a1b',
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
  error: {
    marginTop: 10,
    color: '#8b2a1b',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
  actions: {
    marginTop: 12,
    gap: 8,
  },
});
