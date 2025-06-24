import { StyleSheet } from 'react-native';
import { borderRadius, colors, spacing } from '../src/constants';

const PREVIEW_SIZE = 300;

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
    headerButton: {
        padding: spacing.xs,
        width: 40,
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: spacing.md,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePicker: {
        alignItems: 'center',
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        backgroundColor: colors.surface,
    },
    pickerTitle: {
        marginTop: spacing.md,
        marginBottom: spacing.xs,
    },
    previewSection: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        marginBottom: spacing.md,
        fontWeight: '600',
    },
    previewContainer: {
        width: PREVIEW_SIZE,
        height: PREVIEW_SIZE,
        alignSelf: 'center',
        borderRadius: borderRadius.md,
        overflow: 'hidden',
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    previewActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: spacing.md,
    },
    actionButton: {
        alignItems: 'center',
        padding: spacing.sm,
    },
    controlSection: {
        marginBottom: spacing.lg,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    saveSection: {
        marginTop: 'auto',
        paddingTop: spacing.lg,
    },
});

export default styles;