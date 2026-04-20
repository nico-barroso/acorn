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
    flex: 1,
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
  listContent: {
    paddingBottom: 8,
    gap: 10,
  },
  listEmptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  error: {
    marginBottom: 10,
    color: '#8b2a1b',
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
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
