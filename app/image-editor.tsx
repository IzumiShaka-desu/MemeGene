import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import {
    PanGestureHandler,
    PinchGestureHandler,
    State,
} from 'react-native-gesture-handler';
import { Button, Text } from '../src/components';
import { borderRadius, colors, spacing } from '../src/constants/theme';
import { ImageElement } from '../src/types';

interface ImageEditorProps {
    onClose: () => void;
    onSave: (imageData: ImageElement) => void;
    editingImage?: ImageElement | null;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const PREVIEW_SIZE = Math.min(screenWidth - 40, 300);

export default function ImageEditor({ onClose, onSave, editingImage }: ImageEditorProps) {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
    const [opacity, setOpacity] = useState(1);
    const [crop, setCrop] = useState({ x: 0, y: 0, width: 1, height: 1 });
    const [isLoading, setIsLoading] = useState(false);

    // Gesture handling for crop area
    const panRef = useRef(null);
    const pinchRef = useRef(null);
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    // Reset state when component mounts or editingImage changes
    useEffect(() => {
        if (editingImage) {
            // Pre-fill with existing image data
            setSelectedImage(editingImage.uri);
            setOriginalDimensions(editingImage.originalDimensions);
            setOpacity(editingImage.opacity);
            setCrop(editingImage.crop);
        } else {
            // Reset for new image
            setSelectedImage(null);
            setOriginalDimensions({ width: 0, height: 0 });
            setOpacity(1);
            setCrop({ x: 0, y: 0, width: 1, height: 1 });
        }
    }, [editingImage]);

    const pickImage = async () => {
        try {
            setIsLoading(true);

            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your photo library to select images.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: false,
                quality: 0.8,
                aspect: undefined,
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                setSelectedImage(asset.uri);

                // Get image dimensions
                Image.getSize(asset.uri, (width, height) => {
                    setOriginalDimensions({ width, height });
                    // Reset crop to full image
                    setCrop({ x: 0, y: 0, width: 1, height: 1 });
                }, (error) => {
                    console.error('Error getting image size:', error);
                    Alert.alert('Error', 'Could not load image dimensions.');
                });
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Could not select image. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const onPanEvent = useCallback((event: any) => {
        const { translationX, translationY } = event.nativeEvent;
        translateX.setValue(translationX);
        translateY.setValue(translationY);
    }, []);

    const onPanStateChange = useCallback((event: any) => {
        if (event.nativeEvent.state === State.END) {
            // Convert translation to crop adjustment
            const deltaX = event.nativeEvent.translationX / PREVIEW_SIZE;
            const deltaY = event.nativeEvent.translationY / PREVIEW_SIZE;

            setCrop(prev => ({
                ...prev,
                x: Math.max(0, Math.min(1 - prev.width, prev.x - deltaX)),
                y: Math.max(0, Math.min(1 - prev.height, prev.y - deltaY)),
            }));

            // Reset gesture values
            translateX.setValue(0);
            translateY.setValue(0);
        }
    }, []);

    const onPinchEvent = useCallback((event: any) => {
        const { scale: gestureScale } = event.nativeEvent;
        scale.setValue(gestureScale);
    }, []);

    const onPinchStateChange = useCallback((event: any) => {
        if (event.nativeEvent.state === State.END) {
            const { scale: gestureScale } = event.nativeEvent;

            // Convert scale to crop size adjustment
            const newSize = Math.max(0.1, Math.min(1, crop.width / gestureScale));
            const centerX = crop.x + crop.width / 2;
            const centerY = crop.y + crop.height / 2;

            setCrop({
                x: Math.max(0, Math.min(1 - newSize, centerX - newSize / 2)),
                y: Math.max(0, Math.min(1 - newSize, centerY - newSize / 2)),
                width: newSize,
                height: newSize,
            });

            scale.setValue(1);
        }
    }, [crop]);

    const resetCrop = () => {
        setCrop({ x: 0, y: 0, width: 1, height: 1 });
        translateX.setValue(0);
        translateY.setValue(0);
        scale.setValue(1);
    };

    const handleSave = () => {
        if (!selectedImage) {
            Alert.alert('No Image', 'Please select an image first.');
            return;
        }

        const imageData: ImageElement = {
            id: editingImage?.id || Date.now().toString(),
            uri: selectedImage,
            width: originalDimensions.width,
            height: originalDimensions.height,
            x: editingImage?.x || 50,
            y: editingImage?.y || 50,
            opacity,
            crop,
            originalDimensions,
        };

        onSave(imageData);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onClose} style={styles.headerButton}>
                    <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>

                <Text variant="h3">Image Editor</Text>

                <TouchableOpacity onPress={handleSave} style={styles.headerButton}>
                    <Ionicons name="checkmark" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {!selectedImage ? (
                    <View style={styles.emptyState}>
                        <TouchableOpacity
                            style={styles.selectButton}
                            onPress={pickImage}
                            disabled={isLoading}
                        >
                            <Ionicons
                                name="image-outline"
                                size={48}
                                color={colors.primary}
                            />
                            <Text variant="h3" style={styles.selectText}>
                                {isLoading ? 'Loading...' : 'Select Image'}
                            </Text>
                            <Text variant="caption" color={colors.textSecondary}>
                                Choose from your photo library
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <>
                        {/* Image Preview with Crop */}
                        <View style={styles.previewSection}>
                            <Text variant="body" style={styles.sectionTitle}>Preview</Text>

                            <View style={styles.previewContainer}>
                                <PanGestureHandler
                                    ref={panRef}
                                    onGestureEvent={onPanEvent}
                                    onHandlerStateChange={onPanStateChange}
                                    simultaneousHandlers={[pinchRef]}
                                >
                                    <Animated.View style={styles.gestureContainer}>
                                        <PinchGestureHandler
                                            ref={pinchRef}
                                            onGestureEvent={onPinchEvent}
                                            onHandlerStateChange={onPinchStateChange}
                                            simultaneousHandlers={[panRef]}
                                        >
                                            <Animated.View
                                                style={[
                                                    styles.imageContainer,
                                                    {
                                                        transform: [
                                                            { translateX },
                                                            { translateY },
                                                            { scale },
                                                        ],
                                                    },
                                                ]}
                                            >
                                                <Image
                                                    source={{ uri: selectedImage }}
                                                    style={[
                                                        styles.previewImage,
                                                        { opacity },
                                                    ]}
                                                />

                                                {/* Crop overlay */}
                                                <View
                                                    style={[
                                                        styles.cropOverlay,
                                                        {
                                                            left: `${crop.x * 100}%`,
                                                            top: `${crop.y * 100}%`,
                                                            width: `${crop.width * 100}%`,
                                                            height: `${crop.height * 100}%`,
                                                        },
                                                    ]}
                                                />
                                            </Animated.View>
                                        </PinchGestureHandler>
                                    </Animated.View>
                                </PanGestureHandler>
                            </View>

                            <View style={styles.previewActions}>
                                <TouchableOpacity onPress={resetCrop} style={styles.actionButton}>
                                    <Ionicons name="refresh-outline" size={20} color={colors.primary} />
                                    <Text variant="caption" color={colors.primary}>Reset Crop</Text>
                                </TouchableOpacity>

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
    selectButton: {
        alignItems: 'center',
        padding: spacing.xl,
        borderRadius: borderRadius.lg,
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        backgroundColor: colors.surface,
    },
    selectText: {
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
    gestureContainer: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    cropOverlay: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: colors.primary,
        borderStyle: 'dashed',
        backgroundColor: 'rgba(0,0,0,0.1)',
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