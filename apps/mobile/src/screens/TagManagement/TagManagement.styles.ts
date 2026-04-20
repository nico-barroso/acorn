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
    marginBottom: 14,
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
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
  inputAction: {
    minWidth: 100,
  },
  error: {
    marginTop: 8,
    color: '#8b2a1b',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
  },
  listContent: {
    paddingTop: 14,
    paddingBottom: 10,
    gap: 10,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  tagCard: {
    backgroundColor: colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.brown}18`,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  tagName: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 18,
    color: colors.black,
  },
  tagMeta: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brownMid,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
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
