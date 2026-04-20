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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontFamily: fonts.family.title.bold,
    fontSize: fonts.size.xxl,
    color: colors.brown,
  },
  filterPanel: {
    marginHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.white,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
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
  emptyImageContainer: {
    width: 150,
    height: 150,
  },
  emptyImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  actionButton: {
    flex: 1,
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
