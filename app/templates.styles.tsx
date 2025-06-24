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
    },
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40, // Same as back button to center the title
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    templateCard: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        ...shadows.small,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        aspectRatio: 1,
        backgroundColor: colors.border,
    },
    templateImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
    },
    templateInfo: {
        padding: spacing.sm,
    },
    templateName: {
        marginBottom: spacing.xs,
    },
    comingSoonSection: {
        padding: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    comingSoonTitle: {
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    comingSoonDesc: {
        textAlign: 'center',
        lineHeight: 20,
    },
    exploreButton: {
        marginTop: spacing.md,
    },
});

export default styles;