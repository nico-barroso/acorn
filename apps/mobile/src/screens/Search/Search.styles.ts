import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/fonts';

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
  filterPanelContainer: {
    marginTop: 8,
    marginHorizontal: 20,
  },
  filterPanel: {
    borderRadius: 20,
    backgroundColor: colors.white,
    shadowColor: colors.brown,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 16,
    borderWidth: 1,
    borderColor: `${colors.brown}15`,
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
    paddingVertical: 8,
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
  tagQueryHint: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
    marginTop: -10,
  },
  tagQueryBadge: {
    fontFamily: 'Satoshi-Bold',
    color: colors.salmon,
  },
  skeletonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
  },
});
