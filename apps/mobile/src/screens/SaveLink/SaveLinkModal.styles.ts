import { Platform, StatusBar, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    top: Platform.OS === 'android' ? -(StatusBar.currentHeight ?? 0) : 0,
    justifyContent: 'flex-end',
    zIndex: 100,
  },
  backdropPress: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingTop: 12,
    maxHeight: '90%',
  },
  handleContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.brownMid,
    opacity: 0.3,
  },
  title: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 22,
    color: colors.brown,
    fontWeight: '700',
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 15,
    color: colors.brownMid,
    marginBottom: 26,
  },
  // Mode toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0E6E0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 28,
  },
  modeTab: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 11,
    alignItems: 'center',
  },
  modeTabActive: {
    backgroundColor: colors.white,
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  modeTabText: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 14,
    color: colors.brownMid,
    fontWeight: '700',
  },
  modeTabTextActive: {
    color: colors.brown,
  },

  // File section
  filePickButton: {
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.brownMid,
    borderStyle: 'dashed',
    paddingVertical: 18,
    alignItems: 'center',
    marginBottom: 18,
  },
  filePickButtonText: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 15,
    color: colors.brownMid,
    fontWeight: '700',
  },
  filePreviewCard: {
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E8D8CF',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 4,
    gap: 4,
  },
  fileName: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 15,
    color: colors.brown,
    fontWeight: '700',
  },
  fileMeta: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brownMid,
  },
  fileProgress: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
    marginTop: 6,
    textAlign: 'center',
  },

  label: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.brownMid,
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 16,
    color: colors.brown,
    backgroundColor: '#FFF8F5',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E8D8CF',
  },
  inputError: {
    borderColor: '#c0392b',
  },
  textarea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // Preview card — mirrors collapsed ContentCard
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(192, 110, 82, 0.2)',
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 26,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    paddingHorizontal: 20,
    minHeight: 100,
  },
  previewThumbnail: {
    width: 74,
    height: 74,
    borderRadius: 13,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: 'transparent',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  previewThumbnailImage: {
    width: '100%',
    height: '100%',
  },
  previewThumbnailIcon: {
    width: 44,
    height: 44,
  },
  previewTextLayout: {
    flex: 1,
    gap: 2,
  },
  previewTitle: {
    fontFamily: 'CabinetGrotesk-Medium',
    fontWeight: '500',
    fontSize: 16,
    color: colors.black,
    lineHeight: 20,
  },
  previewSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 4,
  },
  previewSourceEmoji: {
    fontSize: 11,
  },
  previewSource: {
    fontFamily: 'Satoshi-Regular',
    fontWeight: '400',
    fontSize: 12,
    color: colors.black,
    letterSpacing: -0.12,
  },
  previewFavicon: {
    width: 13,
    height: 13,
    borderRadius: 3,
  },

  // Editar toggle
  editToggle: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 2,
  },
  editToggleText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brownMid,
    textDecorationLine: 'underline',
  },

  // Edit fields section
  editFields: {
    marginTop: 4,
  },

  // Tags
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  tagChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.brownMid,
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  tagChipText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.white,
  },
  tagRemove: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 13,
    color: colors.white,
    opacity: 0.7,
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.salmon,
    alignItems: 'center',
  },
  addTagLabel: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 14,
    color: colors.white,
    fontWeight: '700',
  },

  error: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: '#8b2a1b',
    marginTop: 6,
    marginBottom: 4,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 36,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.brownMid,
    alignItems: 'center',
  },
  cancelLabel: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 15,
    color: colors.brownMid,
    fontWeight: '700',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: colors.salmon,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.45,
  },
  confirmLabel: {
    fontFamily: 'CabinetGrotesk-Bold',
    fontSize: 15,
    color: colors.white,
    fontWeight: '700',
  },
});
