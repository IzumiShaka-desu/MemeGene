import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';

import { Button } from '../src/components/atoms/Button';
import { Text } from '../src/components/atoms/Text';
import { borderRadius, colors, spacing } from '../src/constants/theme';
import { ImageElement } from '../src/types';

const PREVIEW_SIZE = 300;

interface ImageEditorProps {
    onClose: () => void;
    onSave: (imageData: ImageElement) => void;
    editingImage?: ImageElement | null;
}

export default function ImageEditor({ onClose, onSave, editingImage }: ImageEditorProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(editingImage?.uri || null);
    const [opacity, setOpacity] = useState(editingImage?.opacity || 1);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("Permission required", "Please allow access to your photo library to select images.");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: false,
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            setSelectedImage(result.assets[0].uri);
        }
    };

    const handleSave = () => {
        if (!selectedImage) return;

        const imageData: ImageElement = {
            id: editingImage?.id || Date.now().toString(),
            uri: selectedImage,
            x: editingImage?.x || 50,
            y: editingImage?.y || 50,
            width: editingImage?.width || 200,
            height: editingImage?.height || 200,
            opacity,
            originalDimensions: editingImage?.originalDimensions || { width: 200, height: 200 },
            crop: { x: 0, y: 0, width: 1, height: 1 } // Full image
        };

        onSave(imageData);
        onClose();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>

                <Text variant="h3">Image Editor</Text>

                <View style={styles.headerButton} />
            </View>

            <View style={styles.content}>
                {!selectedImage ? (
                    <View style={styles.emptyState}>
                        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
                            <Ionicons name="image-outline" size={64} color={colors.primary} />
                            <Text variant="h3" style={styles.pickerTitle}>Select Image</Text>
                            <Text variant="caption" color={colors.textSecondary}>
                                Choose from your photo library
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Image Preview */}
                        <View style={styles.previewSection}>
                            <Text variant="body" style={styles.sectionTitle}>Preview</Text>

                            <View style={styles.previewContainer}>
                                <Image
                                    source={{ uri: selectedImage }}
                                    style={[styles.previewImage, { opacity }]}
                                    resizeMode="contain"
                                />
                            </View>

                            <View style={styles.previewActions}>
                                <TouchableOpacity onPress={pickImage} style={styles.actionButton}>
                                    <Ionicons name="image-outline" size={20} color={colors.primary} />
                                    <Text variant="caption" color={colors.primary}>Change Image</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Opacity Control */}
                        <View style={styles.controlSection}>
                            <Text variant="body" style={styles.sectionTitle}>
                                Opacity: {Math.round(opacity * 100)}%
                            </Text>

                            <View style={styles.sliderContainer}>
                                <Ionicons name="eye-off-outline" size={20} color={colors.textSecondary} />
                                <Slider
                                    style={styles.slider}
                                    minimumValue={0.1}
                                    maximumValue={1}
                                    value={opacity}
                                    onValueChange={setOpacity}
                                    minimumTrackTintColor={colors.primary}
                                    maximumTrackTintColor={colors.border}
                                />
                                <Ionicons name="eye-outline" size={20} color={colors.textSecondary} />
                            </View>
                        </View>

                        {/* Save Button */}
                        <View style={styles.saveSection}>
                            <Button
                                title={editingImage ? "Update Image" : "Add to Canvas"}
                                onPress={handleSave}
                                variant="primary"
                                size="large"
                                fullWidth
                            />
                        </View>
                    </>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
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
        resizeMode: 'contain',
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