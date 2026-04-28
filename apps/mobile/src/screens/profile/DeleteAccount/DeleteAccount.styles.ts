import { StyleSheet } from 'react-native';
import { colors } from '@theme/colors';
import { fonts } from '@theme/fonts';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backButton: {
    width: 32,
    alignItems: 'flex-start',
  },
  backChevron: {
    fontSize: 28,
    color: colors.brownMid,
    lineHeight: 32,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.brownMid,
    letterSpacing: 0.1,
  },
  headerRight: {
    width: 32,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.brownMid,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.salmon,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.salmon,
  },
  avatarInitial: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.lg,
    color: colors.white,
  },
  warningBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 21,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  warningBadgeText: {
    fontWeight: '700',
    color: colors.salmon,
    lineHeight: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.brown,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: fonts.size.md,
    color: colors.brown,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  consequencesContainer: {
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  consequencesTitle: {
    fontFamily: fonts.family.primary.bold,
    fontSize: fonts.size.lg,
    color: colors.brown,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 14,
  },
  bulletText: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.brownMid,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 8,
  },
  deleteLinkContainer: {
    paddingVertical: 8,
  },
  deleteLink: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.lg,
    color: colors.salmon,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
