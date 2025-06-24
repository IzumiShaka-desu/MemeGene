import { Ionicons } from '@expo/vector-icons';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, Text } from '../src/components';
import { colors, spacing } from '../src/constants';
import { styles } from './gallery.styles';

export const GalleryPage: React.FC = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);
    const [optimizedImageUri, setOptimizedImageUri] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const insets = useSafeAreaInsets();

    const pickImage = async () => {
        try {
            setIsProcessing(true);

            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your photo library to select images.');
                setIsProcessing(false);
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.9, // High quality for initial selection
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];


                // Step 1: Set the preview image
                setSelectedImage(asset.uri);

                // Step 2: Get image dimensions and optimize
                Image.getSize(asset.uri, async (originalWidth, originalHeight) => {


                    try {
                        // Step 3: Optimize image for canvas use


                        // Calculate optimal canvas size (max 2048px on longest side for performance)
                        const maxCanvasSize = 2048;
                        let canvasWidth = originalWidth;
                        let canvasHeight = originalHeight;

                        if (Math.max(originalWidth, originalHeight) > maxCanvasSize) {
                            const aspectRatio = originalWidth / originalHeight;
                            if (originalWidth > originalHeight) {
                                canvasWidth = maxCanvasSize;
                                canvasHeight = Math.round(maxCanvasSize / aspectRatio);
                            } else {
                                canvasHeight = maxCanvasSize;
                                canvasWidth = Math.round(maxCanvasSize * aspectRatio);
                            }
                        }



                        // Use ImageManipulator for efficient processing
                        const manipulatorResult = await ImageManipulator.manipulateAsync(
                            asset.uri,
                            [
                                {
                                    resize: {
                                        width: canvasWidth,
                                        height: canvasHeight,
                                    },
                                },
                            ],
                            {
                                compress: 0.85, // Good balance between quality and performance
                                format: ImageManipulator.SaveFormat.JPEG,
                            }
                        );



                        setImageSize({ width: manipulatorResult.width, height: manipulatorResult.height });
                        setOptimizedImageUri(manipulatorResult.uri);
                        setIsProcessing(false);

                    } catch (optimizationError) {
                        Alert.alert('Error', 'Could not optimize image. Please try again.');
                        setIsProcessing(false);
                    }
                }, (error) => {
                    Alert.alert('Error', 'Could not get image information. Please try again.');
                    setIsProcessing(false);
                });
            } else {
                setIsProcessing(false);
            }
        } catch (error) {
            Alert.alert('Error', 'Could not select image. Please try again.');
            setIsProcessing(false);
        }
    };

    const handleContinue = () => {
        if (!selectedImage || !imageSize || !optimizedImageUri) {
            Alert.alert('Error', 'Image is still processing. Please wait.');
            return;
        }


        router.push({
            pathname: '/editor',
            params: {
                type: 'gallery',
                imageUri: optimizedImageUri, // Use optimized image URI
                width: imageSize.width,
                height: imageSize.height,
            },
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" translucent={false} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text variant="h3" style={styles.headerTitle}>Pick from Gallery</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xl }]}
                showsVerticalScrollIndicator={false}
            >
                {!selectedImage ? (
                    <>
                        {/* Gallery Picker */}
                        <View style={styles.galleryContainer}>
                            <TouchableOpacity
                                style={styles.galleryArea}
                                onPress={pickImage}
                                activeOpacity={0.7}
                                disabled={isProcessing}
                            >
                                <View style={styles.iconContainer}>
                                    {isProcessing ? (
                                        <ActivityIndicator size="large" color={colors.primary} />
                                    ) : (
                                        <Ionicons name="images" size={60} color={colors.primary} />
                                    )}
                                </View>
                                <Text variant="h2" style={styles.galleryTitle}>
                                    {isProcessing ? 'Optimizing...' : 'Select from Gallery'}
                                </Text>
                                <Text variant="body" color={colors.textSecondary} style={styles.galleryDescription}>
                                    {isProcessing
                                        ? 'Processing your image...'
                                        : 'Choose an image from your photo library to create your meme'
                                    }
                                </Text>
                                {!isProcessing && (
                                    <View style={styles.tapHint}>
                                        <Ionicons name="hand-left" size={16} color={colors.primary} />
                                        <Text variant="caption" color={colors.primary} style={styles.tapText}>
                                            Tap to browse
                                        </Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        </View>

                        {/* Tips */}
                        <View style={styles.tipsContainer}>
                            <View style={styles.tipsHeader}>
                                <Ionicons name="bulb" size={20} color={colors.primary} />
                                <Text variant="h3" style={styles.tipsTitle}>
                                    Tips for Best Results
                                </Text>
                            </View>
                            <View style={styles.tipsList}>
                                <View style={styles.tipItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={colors.success || colors.primary} />
                                    <Text variant="body" style={styles.tipText}>
                                        Choose high-quality images for better memes
                                    </Text>
                                </View>
                                <View style={styles.tipItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={colors.success || colors.primary} />
                                    <Text variant="body" style={styles.tipText}>
                                        Portrait and landscape orientations both work great
                                    </Text>
                                </View>
                                <View style={styles.tipItem}>
                                    <Ionicons name="checkmark-circle" size={16} color={colors.success || colors.primary} />
                                    <Text variant="body" style={styles.tipText}>
                                        Add text and effects in the editor
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </>
                ) : (
                    <>
                        {/* Selected Image Preview */}
                        <View style={styles.previewContainer}>
                            <Text variant="h2" style={styles.previewTitle}>
                                Selected Image
                            </Text>
                            <View style={styles.imageWrapper}>
                                <Image source={{ uri: selectedImage }} resizeMode="cover" style={styles.previewImage} />
                                {isProcessing && (
                                    <View style={styles.processingOverlay}>
                                        <ActivityIndicator size="large" color={colors.primary} />
                                        <Text variant="caption" color={colors.primary} style={styles.processingText}>
                                            Processing...
                                        </Text>
                                    </View>
                                )}
                            </View>
                            <Text variant="caption" color={colors.textSecondary} style={styles.imageDimensions}>
                                {imageSize ? `${imageSize.width} × ${imageSize.height}px` : 'Processing...'}
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
                                disabled={isProcessing}
                            />
                            <Button
                                title={isProcessing ? "Processing..." : "Continue to Editor"}
                                onPress={handleContinue}
                                variant="primary"
                                size="large"
                                fullWidth
                                disabled={isProcessing || !optimizedImageUri}
                            />
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
}



// Default export for Expo Router compatibility
export default GalleryPage; 