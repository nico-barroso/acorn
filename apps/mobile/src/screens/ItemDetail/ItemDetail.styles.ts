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
    maxHeight: '92%',
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 28,
  },
  loading: {
    paddingVertical: 30,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: fonts.family.title.bold,
    fontSize: fonts.size.lg,
    color: colors.brown,
  },
  subtitle: {
    marginTop: 4,
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
    color: colors.brownMid,
  },
  image: {
    width: '100%',
    height: 170,
    borderRadius: 14,
    marginTop: 12,
    backgroundColor: colors.white,
  },
  row: {
    marginTop: 14,
    gap: 8,
  },
  rowTitle: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
    color: colors.brownMid,
  },
  paragraph: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.black,
    lineHeight: 20,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagChip: {
    backgroundColor: colors.brownMid,
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagChipText: {
    color: colors.white,
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
  },
  input: {
    width: '100%',
    minHeight: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.brown}30`,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.black,
  },
  textarea: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  switchLabel: {
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.md,
    color: colors.black,
  },
  error: {
    marginTop: 10,
    color: '#8b2a1b',
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
  },
  footerRow: {
    marginTop: 16,
    gap: 10,
  },
  linkButton: {
    marginTop: 12,
  },
  addTagRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  addTagInput: {
    flex: 1,
  },
  addTagButton: {
    minWidth: 92,
  },
  tagEditableChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brownMid,
    borderRadius: 24,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  removeTagText: {
    color: colors.white,
    fontFamily: fonts.family.primary.regular,
    fontSize: fonts.size.sm,
  },
});
