import { StyleSheet } from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../src/constants';

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
        backgroundColor: colors.background,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    backButton: {
        padding: spacing.xs,
    },
    placeholder: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: spacing.lg,
        paddingBottom: spacing.xl,
    },
    galleryContainer: {
        marginBottom: spacing.xl,
    },
    galleryArea: {
        width: '100%',
        minHeight: 280,
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        borderRadius: borderRadius.xl,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
        ...shadows.medium,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        ...shadows.small,
    },
    galleryTitle: {
        marginBottom: spacing.sm,
        textAlign: 'center',
        color: colors.text,
    },
    galleryDescription: {
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: spacing.md,
        paddingHorizontal: spacing.sm,
    },
    tapHint: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.primary,
    },
    tapText: {
        fontWeight: '600',
    },
    tipsContainer: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.small,
    },
    tipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    tipsTitle: {
        color: colors.text,
    },
    tipsList: {
        gap: spacing.md,
    },
    tipItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: spacing.sm,
    },
    tipText: {
        flex: 1,
        lineHeight: 20,
    },
    previewContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    previewTitle: {
        marginBottom: spacing.lg,
        color: colors.text,
    },
    imageWrapper: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.medium,
        marginBottom: spacing.sm,
    },
    previewImage: {
        width: 250,
        height: 250,
    },
    imageDimensions: {
        fontSize: 14,
        fontWeight: '500',
    },
    actionsContainer: {
        gap: spacing.md,
    },
    processingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: borderRadius.lg,
    },
    processingText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.primary,
        marginTop: spacing.sm,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '500',
        color: colors.success || colors.primary,
    },
});

export default styles;