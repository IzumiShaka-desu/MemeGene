import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing } from '../src/constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    saveButton: {
        padding: spacing.xs,
    },
    content: {
        flex: 1,
        padding: spacing.md,
    },
    scrollContent: {
        padding: spacing.md,
    },
    previewSection: {
        marginBottom: spacing.xl,
    },
    previewContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        borderWidth: 1,
        borderColor: colors.border,
    },
    previewText: {
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },
    textInput: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: 80,
    },
    fontGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    fontOption: {
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        minWidth: 80,
        alignItems: 'center',
    },
    selectedFontOption: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    fontOptionText: {
        fontSize: 14,
    },
    sizeGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    sizeOption: {
        width: 50,
        height: 40,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedSizeOption: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedColorOption: {
        borderColor: colors.primary,
        borderWidth: 3,
    },
    transparentOption: {
        borderStyle: 'dashed',
    },
    alignmentGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    alignmentOption: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    selectedAlignmentOption: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    alignmentLabel: {
        marginTop: spacing.xs,
    },
    styleGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    styleOption: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    selectedStyleOption: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    bottomPadding: {
        height: spacing.xl,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    debugSection: {
        marginBottom: spacing.xl,
    },
    debugContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        borderWidth: 1,
        borderColor: colors.border,
    },
    debugTextContainer: {
        marginBottom: spacing.md,
    },
    debugFontTest: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
});

export default styles;