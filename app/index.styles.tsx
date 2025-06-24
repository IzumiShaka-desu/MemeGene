import { StyleSheet } from 'react-native';
import { colors, spacing } from '../src/constants';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.xxl,
    },
    title: {
        color: colors.primary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        textAlign: 'center',
        lineHeight: 24,
    },
    ctaSection: {
        marginBottom: spacing.xxl,
    },
    featuresGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
        justifyContent: 'space-between',
    },
    featureCard: {
        width: '48%',
        backgroundColor: colors.surface,
        padding: spacing.md,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    featureTitle: {
        marginBottom: spacing.xs,
    },
});

export default styles;