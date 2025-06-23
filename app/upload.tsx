import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
    Image,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import { Button, Text } from '../src/components';
import { borderRadius, colors, shadows, spacing } from '../src/constants/theme';

export default function UploadPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

    const requestPermission = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                'Permission Required',
                'Sorry, we need camera roll permissions to make this work!'
            );
            return false;
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await requestPermission();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled && result.assets[0]) {
            const asset = result.assets[0];
            setSelectedImage(asset.uri);
            setImageSize({
                width: asset.width || 800,
                height: asset.height || 800,
            });
        }
    };

    const handleContinue = () => {
        if (!selectedImage || !imageSize) return;

        router.push({
            pathname: '/editor',
            params: {
                type: 'upload',
                imageUri: selectedImage,
                width: imageSize.width,
                height: imageSize.height,
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text variant="h2" style={styles.headerTitle}>
                    Upload Image
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {selectedImage ? (
                    <View style={styles.imagePreviewContainer}>
                        <View style={styles.imagePreview}>
                            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                        </View>
                        <Text variant="body" style={styles.imageInfo}>
                            Selected Image
                        </Text>
                        {imageSize && (
                            <Text variant="caption" color={colors.textSecondary}>
                                {imageSize.width} × {imageSize.height} pixels
                            </Text>
                        )}

                        <View style={styles.actions}>
                            <Button
                                title="Choose Different Image"
                                onPress={pickImage}
                                variant="outline"
                                style={styles.actionButton}
                            />
                            <Button
                                title="Continue to Editor"
                                onPress={handleContinue}
                                variant="primary"
                                style={styles.actionButton}
                            />
                        </View>
                    </View>
                ) : (
                    <View style={styles.uploadContainer}>
                        <TouchableOpacity style={styles.uploadArea} onPress={pickImage}>
                            <Ionicons name="cloud-upload-outline" size={80} color={colors.textSecondary} />
                            <Text variant="h3" style={styles.uploadTitle}>
                                Upload Your Image
                            </Text>
                            <Text variant="body" color={colors.textSecondary} style={styles.uploadDescription}>
                                Tap to select an image from your gallery to use as a meme template
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.tipsContainer}>
                            <Text variant="h3" style={styles.tipsTitle}>
                                📸 Tips for Best Results
                            </Text>
                            <View style={styles.tip}>
                                <Text variant="body">• Use high-quality images for better results</Text>
                            </View>
                            <View style={styles.tip}>
                                <Text variant="body">• Images with clear subjects work best</Text>
                            </View>
                            <View style={styles.tip}>
                                <Text variant="body">• Consider the aspect ratio for your meme</Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </SafeAreaView>
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
    backButton: {
        padding: spacing.xs,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    uploadContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    uploadArea: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        padding: spacing.xxl,
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    uploadTitle: {
        marginTop: spacing.lg,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    uploadDescription: {
        textAlign: 'center',
        lineHeight: 24,
    },
    imagePreviewContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePreview: {
        width: 300,
        height: 300,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        ...shadows.medium,
        marginBottom: spacing.lg,
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imageInfo: {
        marginBottom: spacing.xs,
        fontWeight: '600',
    },
    actions: {
        width: '100%',
        gap: spacing.md,
        marginTop: spacing.xl,
    },
    actionButton: {
        width: '100%',
    },
    tipsContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tipsTitle: {
        marginBottom: spacing.md,
    },
    tip: {
        marginBottom: spacing.sm,
    },
}); 