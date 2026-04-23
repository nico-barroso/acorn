import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
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
    marginBottom: 6,
  },
  subtitle: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 14,
    color: colors.brownMid,
    marginBottom: 16,
  },
  // Mode toggle
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: '#F0E6E0',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
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
    marginBottom: 12,
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

  // Preview card
  previewCard: {
    backgroundColor: colors.white,
    borderRadius: 15,
    marginTop: 16,
    overflow: 'hidden',
    shadowColor: colors.salmon,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  previewImageBg: {
    borderRadius: 15,
    overflow: 'hidden',
    minHeight: 110,
  },
  previewImageBgImage: {
    borderRadius: 15,
  },
  previewImageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(20, 12, 8, 0.55)',
    borderRadius: 15,
  },
  previewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    paddingHorizontal: 16,
    minHeight: 90,
  },
  previewThumbnail: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#E8D8CF',
    marginRight: 12,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  previewThumbnailIcon: {
    width: 32,
    height: 32,
    borderRadius: 6,
  },
  previewTextLayout: {
    flex: 1,
    gap: 4,
  },
  previewTitle: {
    fontFamily: 'CabinetGrotesk-Medium',
    fontWeight: '500',
    fontSize: 15,
    color: colors.black,
    lineHeight: 19,
  },
  previewTitleOnImage: {
    color: colors.white,
  },
  previewSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  previewFavicon: {
    width: 13,
    height: 13,
    borderRadius: 3,
  },
  previewSource: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 12,
    color: colors.brownMid,
    letterSpacing: -0.1,
  },
  previewSourceOnImage: {
    color: 'rgba(255,255,255,0.8)',
  },
  previewTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.brownMid,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  previewTagText: {
    fontFamily: 'Satoshi-Regular',
    fontSize: 11,
    color: colors.white,
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
    marginTop: 20,
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
