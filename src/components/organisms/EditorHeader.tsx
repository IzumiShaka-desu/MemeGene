import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants';
import { Text } from '../atoms/Text';

interface EditorHeaderProps {
    currentZoom: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onResetZoom: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    selectedTextId: string | null;
    selectedImageId: string | null;
    onEditText: () => void;
    onDuplicateText: () => void;
    onDeleteText: () => void;
    onEditImage: () => void;
    onDuplicateImage: () => void;
    onDeleteImage: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
    currentZoom,
    onZoomIn,
    onZoomOut,
    onResetZoom,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    selectedTextId,
    selectedImageId,
    onEditText,
    onDuplicateText,
    onDeleteText,
    onEditImage,
    onDuplicateImage,
    onDeleteImage,
}) => {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>

            <View style={styles.headerCenter}>
                <Text variant="caption" color={colors.textSecondary}>
                    {Math.round(currentZoom * 100)}%
                </Text>
            </View>

            <View style={styles.headerActions}>
                {selectedTextId && (
                    <>
                        <TouchableOpacity onPress={onEditText} style={styles.actionButton}>
                            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onDuplicateText} style={styles.actionButton}>
                            <Ionicons name="copy-outline" size={18} color={colors.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onDeleteText} style={styles.actionButton}>
                            <Ionicons name="trash-outline" size={18} color="#FF0000" />
                        </TouchableOpacity>
                    </>
                )}

                {selectedImageId && (
                    <>
                        <TouchableOpacity onPress={onEditImage} style={styles.actionButton}>
                            <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onDuplicateImage} style={styles.actionButton}>
                            <Ionicons name="copy-outline" size={18} color={colors.primary} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={onDeleteImage} style={styles.actionButton}>
                            <Ionicons name="trash-outline" size={18} color="#FF0000" />
                        </TouchableOpacity>
                    </>
                )}

                <TouchableOpacity onPress={onZoomOut} style={styles.headerButton}>
                    <Ionicons name="remove" size={18} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onResetZoom} style={styles.headerButton}>
                    <Ionicons name="contract-outline" size={18} color={colors.text} />
                </TouchableOpacity>

                <TouchableOpacity onPress={onZoomIn} style={styles.headerButton}>
                    <Ionicons name="add" size={18} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.divider} />

                <TouchableOpacity
                    onPress={onUndo}
                    style={[styles.headerButton, !canUndo && styles.disabledButton]}
                    disabled={!canUndo}
                >
                    <Ionicons name="arrow-undo" size={18} color={canUndo ? colors.text : colors.textSecondary} />
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={onRedo}
                    style={[styles.headerButton, !canRedo && styles.disabledButton]}
                    disabled={!canRedo}
                >
                    <Ionicons name="arrow-redo" size={18} color={canRedo ? colors.text : colors.textSecondary} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = {
    header: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        justifyContent: 'space-between' as const,
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        padding: 8,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center' as const,
    },
    headerActions: {
        flexDirection: 'row' as const,
        alignItems: 'center' as const,
        gap: 8,
    },
    actionButton: {
        padding: 8,
        borderRadius: 6,
        backgroundColor: colors.surface,
    },
    headerButton: {
        padding: 8,
        borderRadius: 6,
    },
    disabledButton: {
        opacity: 0.5,
    },
    divider: {
        width: 1,
        height: 20,
        backgroundColor: colors.border,
        marginHorizontal: 4,
    },
}; 