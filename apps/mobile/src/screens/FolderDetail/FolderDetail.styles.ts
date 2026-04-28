import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export const styles = StyleSheet.create({
  panel: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 70,
    paddingBottom: 28,
  },
  inner: {
    paddingHorizontal: 20,
    gap: 20,
  },
  title: {
    fontFamily: fonts.family.title.bold,
    fontSize: fonts.size.xxl,
    color: colors.brown,
  },
  error: {
    marginTop: 8,
    color: '#8b2a1b',
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
  },
  resultsCounter: {
    marginTop: 20,
    marginBottom: 10,
    color: colors.brownMid,
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 10,
  },
  listEmptyContent: {
    paddingTop: 50,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: fonts.size.xl,
    color: colors.black,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: fonts.size.lg,
    color: colors.brownMid,
    textAlign: 'center',
  },
});