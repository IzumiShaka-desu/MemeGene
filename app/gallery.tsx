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
    View
} from 'react-native';
import { Button, Text } from '../src/components';
import { borderRadius, colors, spacing } from '../src/constants/theme';

export default function GalleryPage() {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

    const pickImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your photo library to select images.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.8,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setSelectedImage(asset.uri);

                // Get image dimensions
                Image.getSize(asset.uri, (width, height) => {
                    setImageSize({ width, height });
                });
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Could not select image. Please try again.');
        }
    };

    const handleContinue = () => {
        if (!selectedImage || !imageSize) return;

        router.push({
            pathname: '/editor',
            params: {
                type: 'gallery',
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
                <Text variant="h3">Pick from Gallery</Text>
                <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
                {!selectedImage ? (
                    <>
                        {/* Gallery Picker */}
                        <View style={styles.galleryContainer}>
                            <TouchableOpacity style={styles.galleryArea} onPress={pickImage}>
                                <Ionicons name="images-outline" size={80} color={colors.textSecondary} />
                                <Text variant="h3" style={styles.galleryTitle}>
                                    Select from Gallery
                                </Text>
                                <Text variant="body" color={colors.textSecondary} style={styles.galleryDescription}>
                                    Choose an image from your photo library
                                </Text>
                            </TouchableOpacity>
                        </View>

                        {/* Tips */}
                        <View style={styles.tipsContainer}>
                            <Text variant="h3" style={styles.tipsTitle}>
                                📱 Tips for Best Results
                            </Text>
                            <View style={styles.tipsList}>
                                <Text variant="body" style={styles.tipItem}>
                                    • Use high-resolution images for better quality
                                </Text>
                                <Text variant="body" style={styles.tipItem}>
                                    • Images with clear subjects work best for memes
                                </Text>
                                <Text variant="body" style={styles.tipItem}>
                                    • You can crop and adjust the image in the editor
                                </Text>
                            </View>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Selected Image Preview */}
                        <View style={styles.previewContainer}>
                            <Text variant="h3" style={styles.previewTitle}>
                                Selected Image
                            </Text>
                            <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                            <Text variant="caption" color={colors.textSecondary} style={styles.imageDimensions}>
                                {imageSize ? `${imageSize.width} × ${imageSize.height}px` : 'Loading dimensions...'}
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.actionsContainer}>
                            <Button
                                title="Choose Different Image"
                                onPress={pickImage}
                                variant="secondary"
                                size="large"
                                fullWidth
                            />
                            <Button
                                title="Continue to Editor"
                                onPress={handleContinue}
                                variant="primary"
                                size="large"
                                fullWidth
                            />
                        </View>
                    </>
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
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: spacing.lg,
    },
    galleryContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    galleryArea: {
        width: '100%',
        maxWidth: 300,
        aspectRatio: 1,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        borderRadius: borderRadius.lg,
        backgroundColor: colors.surface,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    galleryTitle: {
        marginTop: spacing.md,
        marginBottom: spacing.xs,
        textAlign: 'center',
    },
    galleryDescription: {
        textAlign: 'center',
        lineHeight: 22,
    },
    tipsContainer: {
        backgroundColor: colors.surface,
        padding: spacing.lg,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    tipsTitle: {
        marginBottom: spacing.md,
    },
    tipsList: {
        gap: spacing.sm,
    },
    tipItem: {
        lineHeight: 22,
    },
    previewContainer: {
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    previewTitle: {
        marginBottom: spacing.md,
    },
    previewImage: {
        width: 200,
        height: 200,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        resizeMode: 'cover',
        marginBottom: spacing.sm,
    },
    imageDimensions: {
        fontSize: 14,
    },
    actionsContainer: {
        gap: spacing.md,
    },
}); 