import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing } from '../../constants/theme';
import { CanvasSettings } from '../../types';
import { Button } from '../atoms/Button';
import { Text } from '../atoms/Text';
import { Modal } from '../molecules/Modal';

interface CanvasSettingsModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: (settings: CanvasSettings) => void;
}

const CANVAS_SIZES = [
    { name: 'Square (1:1)', width: 800, height: 800 },
    { name: 'Portrait (3:4)', width: 800, height: 1067 },
    { name: 'Landscape (4:3)', width: 1067, height: 800 },
    { name: 'Story (9:16)', width: 800, height: 1422 },
    { name: 'Wide (16:9)', width: 1422, height: 800 },
];

const BACKGROUND_COLORS = [
    '#FFFFFF', '#000000', '#F3F4F6', '#EF4444', '#F59E0B',
    '#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#6B7280',
];

export const CanvasSettingsModal: React.FC<CanvasSettingsModalProps> = ({
    visible,
    onClose,
    onConfirm,
}) => {
    const [selectedSize, setSelectedSize] = useState(CANVAS_SIZES[0]);
    const [selectedColor, setSelectedColor] = useState(BACKGROUND_COLORS[0]);

    const handleConfirm = () => {
        onConfirm({
            width: selectedSize.width,
            height: selectedSize.height,
            backgroundColor: selectedColor,
        });
    };

    return (
        <Modal visible={visible} onClose={onClose} size="medium">
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text variant="h2" style={styles.title}>
                    Canvas Settings
                </Text>
                <Text variant="caption" color={colors.textSecondary} style={styles.subtitle}>
                    Choose your canvas size and background color
                </Text>

                {/* Canvas Size Selection */}
                <View style={styles.section}>
                    <Text variant="h3" style={styles.sectionTitle}>
                        Canvas Size
                    </Text>
                    <View style={styles.sizeGrid}>
                        {CANVAS_SIZES.map((size, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.sizeOption,
                                    selectedSize.name === size.name && styles.selectedSizeOption,
                                ]}
                                onPress={() => setSelectedSize(size)}
                            >
                                <Text
                                    variant="caption"
                                    color={selectedSize.name === size.name ? colors.primary : colors.text}
                                    weight="medium"
                                >
                                    {size.name}
                                </Text>
                                <Text
                                    variant="caption"
                                    color={colors.textSecondary}
                                    style={styles.sizeText}
                                >
                                    {size.width} × {size.height}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Background Color Selection */}
                <View style={styles.section}>
                    <Text variant="h3" style={styles.sectionTitle}>
                        Background Color
                    </Text>
                    <View style={styles.colorGrid}>
                        {BACKGROUND_COLORS.map((color, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.colorOption,
                                    { backgroundColor: color },
                                    selectedColor === color && styles.selectedColorOption,
                                ]}
                                onPress={() => setSelectedColor(color)}
                            />
                        ))}
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actions}>
                    <Button
                        title="Cancel"
                        onPress={onClose}
                        variant="ghost"
                        style={styles.cancelButton}
                    />
                    <Button
                        title="Create Canvas"
                        onPress={handleConfirm}
                        variant="primary"
                        style={styles.confirmButton}
                    />
                </View>
            </ScrollView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },
    sizeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    sizeOption: {
        flex: 1,
        minWidth: '45%',
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    selectedSizeOption: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    sizeText: {
        marginTop: spacing.xs,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.border,
    },
    selectedColorOption: {
        borderColor: colors.primary,
        borderWidth: 3,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.lg,
    },
    cancelButton: {
        flex: 1,
    },
    confirmButton: {
        flex: 1,
    },
}); 