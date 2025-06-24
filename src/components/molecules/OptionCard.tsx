import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../../constants/theme';
import { BaseComponentProps, MemeCreationOption } from '../../types';
import { Text } from '../atoms/Text';

interface OptionCardProps extends BaseComponentProps {
    option: MemeCreationOption;
    onPress: () => void;
}

export const OptionCard: React.FC<OptionCardProps> = ({
    option,
    onPress,
    style,
    testID,
}) => {
    return (
        <TouchableOpacity
            style={[styles.container, style]}
            onPress={onPress}
            testID={testID}
        >
            <View style={styles.iconContainer}>
                <Ionicons
                    name={option.icon as keyof typeof Ionicons.glyphMap}
                    size={32}
                    color={colors.primary}
                />
            </View>
            <View style={styles.content}>
                <Text variant="h3" style={styles.title}>
                    {option.title}
                </Text>
                <Text variant="caption" color={colors.textSecondary} style={styles.description}>
                    {option.description}
                </Text>
            </View>
            <View style={styles.arrowContainer}>
                <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.small,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    content: {
        flex: 1,
    },
    title: {
        marginBottom: spacing.xs,
    },
    description: {
        lineHeight: 18,
    },
    arrowContainer: {
        marginLeft: spacing.sm,
    },
}); 