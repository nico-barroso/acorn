import { StyleSheet } from 'react-native';

import { colors } from '../../theme/colors';
import { fonts } from '../../theme/fonts';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 27, 27, 0.45)',
    justifyContent: 'flex-end',
  },
  panel: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 12,
  },
  title: {
    fontFamily: fonts.family.title.bold,
    fontSize: fonts.size.lg,
    color: colors.brown,
  },
  subtitle: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.brownMid,
    lineHeight: 20,
  },
  error: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
    color: '#8b2a1b',
  },
  success: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
    color: '#2f6a3b',
  },
  filePreviewCard: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: `${colors.brown}2f`,
    backgroundColor: colors.white,
    padding: 14,
    gap: 6,
  },
  fileName: {
    fontFamily: fonts.family.title.bold,
    fontSize: fonts.size.md,
    color: colors.black,
  },
  fileMeta: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
    color: colors.brownMid,
  },
});
