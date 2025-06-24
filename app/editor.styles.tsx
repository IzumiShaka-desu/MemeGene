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
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    headerButton: {
        padding: spacing.xs,
        borderRadius: borderRadius.sm,
        minWidth: 32,
        alignItems: 'center',
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: colors.border,
        marginHorizontal: spacing.xs,
    },
    disabledButton: {
        opacity: 0.5,
    },
    editorContainer: {
        flex: 1,
        backgroundColor: colors.surface,
    },
    gestureContainer: {
        flex: 1,
    },
    pinchContainer: {
        flex: 1,
    },
    canvasContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    canvas: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.sm,
        overflow: 'hidden',
    },
    canvasImage: {
        width: '100%',
        height: '100%',
    },
    toolbar: {
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
    },
    toolsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    toolButton: {
        alignItems: 'center',
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        minWidth: 60,
    },
    activeToolButton: {
        backgroundColor: colors.surface,
    },
    toolLabel: {
        marginTop: spacing.xs,
        fontSize: 12,
    },
    actionButton: {
        padding: spacing.xs,
    },
});

export default styles;