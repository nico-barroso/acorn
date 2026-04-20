import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 27, 27, 0.45)',
    justifyContent: 'flex-end',
  },
  panel: {
    maxHeight: '92%',
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
    marginBottom: 10,
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  createButtonWrap: {
    marginBottom: 10,
  },
  error: {
    marginBottom: 10,
    color: '#8b2a1b',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
  listContent: {
    paddingTop: 4,
    paddingBottom: 10,
    gap: 10,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  folderCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.brown}18`,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 6,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  folderName: {
    flex: 1,
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 19,
    color: colors.black,
  },
  statusChip: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: `${colors.salmon}20`,
  },
  statusChipInactive: {
    backgroundColor: `${colors.brownMid}18`,
  },
  statusText: {
    fontFamily: 'Satoshi-Bold',
    fontSize: 11,
    color: colors.salmon,
  },
  statusTextInactive: {
    color: colors.brownMid,
  },
  folderDescription: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  folderMeta: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brownMid,
  },
  ruleText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.black,
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
  },
  emptyTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 22,
    color: colors.black,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brownMid,
    textAlign: 'center',
  },
});
