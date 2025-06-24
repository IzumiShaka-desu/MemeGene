import { Ionicons } from '@expo/vector-icons';
import * as MediaLibrary from 'expo-media-library';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Image,
    Modal,
    Text as RNText,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import {
    PanGestureHandler,
    PinchGestureHandler,
    State,
    TapGestureHandler,
} from 'react-native-gesture-handler';
import ViewShot from 'react-native-view-shot';
import { Text } from '../src/components';
import { borderRadius, colors, spacing } from '../src/constants/theme';
import { ImageElement, TextElement } from '../src/types';
import ImageEditor from './image-editor';
import TextEditorPage from './text-editor';


type EditorTool = 'canvas' | 'text' | 'image' | 'export';

export default function EditorPage() {
    const params = useLocalSearchParams();
    const [activeTool, setActiveTool] = useState<EditorTool>('canvas');
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(1);
    const [textElements, setTextElements] = useState<TextElement[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    const [dragState, setDragState] = useState<{ [key: string]: { startX: number, startY: number } }>({});
    const [processedTextIds, setProcessedTextIds] = useState<Set<string>>(new Set());
    const [showTextEditor, setShowTextEditor] = useState(false);
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [imageElements, setImageElements] = useState<ImageElement[]>([]);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [showImageEditor, setShowImageEditor] = useState(false);
    const [editingImageId, setEditingImageId] = useState<string | null>(null);
    const [isExporting, setIsExporting] = useState(false);

    // Animated values
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    // State tracking
    const panRef = useRef(null);
    const pinchRef = useRef(null);
    const tapRef = useRef(null);
    const viewShotRef = useRef<any>(null);

    // Gesture state
    const gestureState = useRef({
        scale: 1,
        translateX: 0,
        translateY: 0,
        lastScale: 1,
        lastTranslateX: 0,
        lastTranslateY: 0,
    });

    // Zoom constraints
    const minScale = 0.5;
    const maxScale = 4;

    // State for undo/redo functionality - smarter relocation tracking
    const [undoStack, setUndoStack] = useState<{
        textElements: TextElement[];
        imageElements: ImageElement[];
        timestamp: number;
        action: string;
    }[]>([]);
    const [redoStack, setRedoStack] = useState<{
        textElements: TextElement[];
        imageElements: ImageElement[];
        timestamp: number;
        action: string;
    }[]>([]);
    const isRestoringRef = useRef(false);
    const lastSaveTimeRef = useRef(0);
    const currentActionRef = useRef<string | null>(null);
    const isDraggingRef = useRef(false);
    const dragStartStateRef = useRef<{
        textElements: TextElement[];
        imageElements: ImageElement[];
    } | null>(null);

    // Save current state to undo stack with action description
    const saveCurrentState = useCallback((action: string = 'unknown') => {
        if (isRestoringRef.current) return;

        const now = Date.now();
        const timeSinceLastSave = now - lastSaveTimeRef.current;

        // For auto-saves, only save if enough time has passed AND we're not dragging
        if (action === 'auto_save' && (timeSinceLastSave < 5000 || isDraggingRef.current)) {
            return;
        }

        // For action-based saves, always save unless it's the same action within 1 second
        if (action !== 'auto_save' && currentActionRef.current === action && timeSinceLastSave < 1000) {
            return;
        }

        const currentState = {
            textElements: [...textElements],
            imageElements: [...imageElements],
            timestamp: now,
            action: action
        };

        setUndoStack(prev => {
            // Don't save if state hasn't actually changed
            const lastState = prev[prev.length - 1];
            if (lastState &&
                JSON.stringify(lastState.textElements) === JSON.stringify(currentState.textElements) &&
                JSON.stringify(lastState.imageElements) === JSON.stringify(currentState.imageElements)) {
                return prev;
            }

            const newStack = [...prev, currentState];
            // Keep only last 15 meaningful states
            return newStack.length > 15 ? newStack.slice(-15) : newStack;
        });

        // Clear redo stack when new action is performed
        setRedoStack([]);

        lastSaveTimeRef.current = now;
        currentActionRef.current = action;

        console.log(`State saved to undo stack: ${action}`);
    }, [textElements, imageElements]);

    // Save state when elements change (much longer debounce, only when not dragging)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isDraggingRef.current) {
                saveCurrentState('auto_save');
            }
        }, 5000); // 5 seconds, and only when not dragging

        return () => clearTimeout(timer);
    }, [saveCurrentState]);

    // Manual save for specific actions
    const saveStateForAction = useCallback((action: string) => {
        saveCurrentState(action);
    }, [saveCurrentState]);

    // Save state when drag starts
    const saveDragStartState = useCallback(() => {
        if (!isDraggingRef.current) {
            dragStartStateRef.current = {
                textElements: [...textElements],
                imageElements: [...imageElements]
            };
            isDraggingRef.current = true;
        }
    }, [textElements, imageElements]);

    // Save state when drag ends (if position actually changed)
    const saveDragEndState = useCallback(() => {
        if (isDraggingRef.current && dragStartStateRef.current) {
            // Check if position actually changed significantly
            const startState = dragStartStateRef.current;
            const hasSignificantChange =
                JSON.stringify(startState.textElements) !== JSON.stringify(textElements) ||
                JSON.stringify(startState.imageElements) !== JSON.stringify(imageElements);

            if (hasSignificantChange) {
                // Save the start state first if it's not already in history
                const currentUndoState = {
                    textElements: [...startState.textElements],
                    imageElements: [...startState.imageElements],
                    timestamp: Date.now() - 1000, // Slightly in the past
                    action: 'move_start'
                };

                setUndoStack(prev => {
                    const lastState = prev[prev.length - 1];
                    // Only add start state if it's different from the last saved state
                    if (!lastState ||
                        JSON.stringify(lastState.textElements) !== JSON.stringify(currentUndoState.textElements) ||
                        JSON.stringify(lastState.imageElements) !== JSON.stringify(currentUndoState.imageElements)) {
                        return [...prev, currentUndoState];
                    }
                    return prev;
                });

                // Then save the current end state
                saveCurrentState('move_end');
            }

            isDraggingRef.current = false;
            dragStartStateRef.current = null;
        }
    }, [textElements, imageElements, saveCurrentState]);

    // Update button states
    useEffect(() => {
        setCanUndo(undoStack.length > 0);
        setCanRedo(redoStack.length > 0);
    }, [undoStack.length, redoStack.length]);

    // Smooth pan gesture handling
    const onPanEvent = useCallback((event: any) => {
        const { translationX, translationY } = event.nativeEvent;

        translateX.setValue(gestureState.current.lastTranslateX + translationX);
        translateY.setValue(gestureState.current.lastTranslateY + translationY);
    }, []);

    const onPanStateChange = useCallback((event: any) => {
        if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
            gestureState.current.lastTranslateX += event.nativeEvent.translationX;
            gestureState.current.lastTranslateY += event.nativeEvent.translationY;
            gestureState.current.translateX = gestureState.current.lastTranslateX;
            gestureState.current.translateY = gestureState.current.lastTranslateY;
        }
    }, []);

    // Smooth pinch gesture handling
    const onPinchEvent = useCallback((event: any) => {
        const { scale: eventScale } = event.nativeEvent;
        const newScale = gestureState.current.lastScale * eventScale;

        // Apply constraints
        const constrainedScale = Math.min(Math.max(newScale, minScale), maxScale);

        scale.setValue(constrainedScale);
        gestureState.current.scale = constrainedScale;
        setCurrentZoom(constrainedScale);
    }, []);

    const onPinchStateChange = useCallback((event: any) => {
        if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
            gestureState.current.lastScale = gestureState.current.scale;
        }
    }, []);

    // Enhanced double-tap zoom
    const onDoubleTap = useCallback((event: any) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            const currentScale = gestureState.current.scale;
            const targetScale = currentScale > 1.2 ? 1 : 2;

            // Animate scale
            Animated.timing(scale, {
                toValue: targetScale,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // If zooming out to fit, also center the canvas
            if (targetScale === 1) {
                Animated.parallel([
                    Animated.timing(translateX, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                    Animated.timing(translateY, {
                        toValue: 0,
                        duration: 300,
                        useNativeDriver: true,
                    }),
                ]).start();

                gestureState.current.lastTranslateX = 0;
                gestureState.current.lastTranslateY = 0;
                gestureState.current.translateX = 0;
                gestureState.current.translateY = 0;
            }

            gestureState.current.lastScale = targetScale;
            gestureState.current.scale = targetScale;
            setCurrentZoom(targetScale);
        }
    }, []);

    // Reset zoom with smooth animation
    const resetZoom = useCallback(() => {
        Animated.parallel([
            Animated.timing(scale, {
                toValue: 1,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(translateX, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
            Animated.timing(translateY, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }),
        ]).start();

        gestureState.current = {
            scale: 1,
            translateX: 0,
            translateY: 0,
            lastScale: 1,
            lastTranslateX: 0,
            lastTranslateY: 0,
        };
        setCurrentZoom(1);
    }, []);

    // Zoom in/out with buttons
    const zoomIn = useCallback(() => {
        const newScale = Math.min(gestureState.current.scale * 1.5, maxScale);

        Animated.timing(scale, {
            toValue: newScale,
            duration: 200,
            useNativeDriver: true,
        }).start();

        gestureState.current.scale = newScale;
        gestureState.current.lastScale = newScale;
        setCurrentZoom(newScale);
    }, []);

    const zoomOut = useCallback(() => {
        const newScale = Math.max(gestureState.current.scale / 1.5, minScale);

        Animated.timing(scale, {
            toValue: newScale,
            duration: 200,
            useNativeDriver: true,
        }).start();

        gestureState.current.scale = newScale;
        gestureState.current.lastScale = newScale;
        setCurrentZoom(newScale);
    }, []);

    // Get canvas content based on creation type
    const canvasWidth = parseInt(params.width as string) || 800;
    const canvasHeight = parseInt(params.height as string) || 800;
    const backgroundColor = (params.backgroundColor as string) || '#FFFFFF';
    const creationType = params.type as string;
    const imageUrl = params.imageUrl as string; // For templates
    const imageUri = params.imageUri as string; // For gallery images

    // Determine what to show in canvas with proper layering: canvas->images->text
    const getCanvasContent = () => {
        const elements = [];

        console.log('Rendering canvas with image elements:', imageElements);
        console.log('Rendering canvas with text elements:', textElements);

        // Add base content (template or gallery image)
        if (creationType === 'template' && imageUrl) {
            elements.push(
                <Image
                    key="template"
                    source={{ uri: imageUrl }}
                    style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'cover',
                    }}
                />
            );
        } else if (creationType === 'gallery' && imageUri) {
            elements.push(
                <Image
                    key="gallery"
                    source={{ uri: imageUri }}
                    style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'cover',
                    }}
                />
            );
        }

        // Add image elements (layer 2)
        imageElements.forEach((imageElement, index) => {
            console.log('Rendering image element:', imageElement);
            const isSelected = selectedImageId === imageElement.id;

            elements.push(
                <PanGestureHandler
                    key={`image-pan-${imageElement.id || index}`}
                    onGestureEvent={(event) => {
                        const { translationX, translationY } = event.nativeEvent;
                        const startPos = dragState[imageElement.id] || { startX: imageElement.x || 50, startY: imageElement.y || 50 };
                        const newX = startPos.startX + translationX;
                        const newY = startPos.startY + translationY;
                        updateImagePosition(imageElement.id, newX, newY);
                    }}
                    onHandlerStateChange={(event) => {
                        const { state } = event.nativeEvent;

                        if (state === State.BEGAN) {
                            saveDragStartState(); // Save state when drag begins
                            setDragState(prev => ({
                                ...prev,
                                [imageElement.id]: {
                                    startX: imageElement.x || 50,
                                    startY: imageElement.y || 50
                                }
                            }));
                            setSelectedImageId(imageElement.id);
                            setSelectedTextId(null); // Deselect text when selecting image
                        } else if (state === State.END || state === State.CANCELLED) {
                            saveDragEndState(); // Save state when drag ends
                            setDragState(prev => {
                                const newState = { ...prev };
                                delete newState[imageElement.id];
                                return newState;
                            });
                        }
                    }}
                >
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: imageElement.y || 50,
                            left: imageElement.x || 50,
                            borderWidth: isSelected ? 2 : 0,
                            borderColor: colors.primary,
                            borderStyle: 'dashed',
                            padding: 2,
                        }}
                    >
                        <Image
                            source={{ uri: imageElement.uri }}
                            style={{
                                width: (imageElement.width * imageElement.crop.width) / 8, // Scale down for canvas
                                height: (imageElement.height * imageElement.crop.height) / 8,
                                opacity: imageElement.opacity,
                                resizeMode: 'cover',
                            }}
                        />

                        {/* Resize handles when selected */}
                        {isSelected && (
                            <>
                                {/* Bottom-right resize handle */}
                                <PanGestureHandler
                                    onGestureEvent={(event) => {
                                        const { translationX, translationY } = event.nativeEvent;
                                        const currentWidth = (imageElement.width * imageElement.crop.width) / 8;
                                        const currentHeight = (imageElement.height * imageElement.crop.height) / 8;
                                        const newWidth = Math.max(20, currentWidth + translationX);
                                        const newHeight = Math.max(20, currentHeight + translationY);

                                        // Update the crop to reflect new size while maintaining aspect ratio
                                        const aspectRatio = imageElement.width / imageElement.height;
                                        const scaledWidth = newWidth * 8;
                                        const scaledHeight = newHeight * 8;

                                        updateImageSize(imageElement.id, scaledWidth, scaledHeight);
                                    }}
                                    onHandlerStateChange={(event) => {
                                        if (event.nativeEvent.state === State.BEGAN) {
                                            saveDragStartState(); // Save state when resize begins
                                            // Store initial size for resize operation
                                            setDragState(prev => ({
                                                ...prev,
                                                [`${imageElement.id}-resize`]: {
                                                    startX: imageElement.width,
                                                    startY: imageElement.height
                                                }
                                            }));
                                        } else if (event.nativeEvent.state === State.END) {
                                            saveDragEndState(); // Save state when resize ends
                                            setDragState(prev => {
                                                const newState = { ...prev };
                                                delete newState[`${imageElement.id}-resize`];
                                                return newState;
                                            });
                                        }
                                    }}
                                >
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: -6,
                                            right: -6,
                                            width: 12,
                                            height: 12,
                                            backgroundColor: colors.primary,
                                            borderRadius: 6,
                                            borderWidth: 1,
                                            borderColor: colors.background,
                                        }}
                                    />
                                </PanGestureHandler>

                                {/* Top-left resize handle */}
                                <PanGestureHandler
                                    onGestureEvent={(event) => {
                                        const { translationX, translationY } = event.nativeEvent;
                                        const currentWidth = (imageElement.width * imageElement.crop.width) / 8;
                                        const currentHeight = (imageElement.height * imageElement.crop.height) / 8;
                                        const newWidth = Math.max(20, currentWidth - translationX);
                                        const newHeight = Math.max(20, currentHeight - translationY);

                                        // Update position and size
                                        updateImagePosition(imageElement.id,
                                            (imageElement.x || 50) + translationX,
                                            (imageElement.y || 50) + translationY
                                        );

                                        const scaledWidth = newWidth * 8;
                                        const scaledHeight = newHeight * 8;
                                        updateImageSize(imageElement.id, scaledWidth, scaledHeight);
                                    }}
                                >
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: -6,
                                            left: -6,
                                            width: 12,
                                            height: 12,
                                            backgroundColor: colors.primary,
                                            borderRadius: 6,
                                            borderWidth: 1,
                                            borderColor: colors.background,
                                        }}
                                    />
                                </PanGestureHandler>

                                {/* Top-right resize handle */}
                                <PanGestureHandler
                                    onGestureEvent={(event) => {
                                        const { translationX, translationY } = event.nativeEvent;
                                        const currentWidth = (imageElement.width * imageElement.crop.width) / 8;
                                        const currentHeight = (imageElement.height * imageElement.crop.height) / 8;
                                        const newWidth = Math.max(20, currentWidth + translationX);
                                        const newHeight = Math.max(20, currentHeight - translationY);

                                        // Update position (Y only) and size
                                        updateImagePosition(imageElement.id,
                                            imageElement.x || 50,
                                            (imageElement.y || 50) + translationY
                                        );

                                        const scaledWidth = newWidth * 8;
                                        const scaledHeight = newHeight * 8;
                                        updateImageSize(imageElement.id, scaledWidth, scaledHeight);
                                    }}
                                >
                                    <View
                                        style={{
                                            position: 'absolute',
                                            top: -6,
                                            right: -6,
                                            width: 12,
                                            height: 12,
                                            backgroundColor: colors.primary,
                                            borderRadius: 6,
                                            borderWidth: 1,
                                            borderColor: colors.background,
                                        }}
                                    />
                                </PanGestureHandler>

                                {/* Bottom-left resize handle */}
                                <PanGestureHandler
                                    onGestureEvent={(event) => {
                                        const { translationX, translationY } = event.nativeEvent;
                                        const currentWidth = (imageElement.width * imageElement.crop.width) / 8;
                                        const currentHeight = (imageElement.height * imageElement.crop.height) / 8;
                                        const newWidth = Math.max(20, currentWidth - translationX);
                                        const newHeight = Math.max(20, currentHeight + translationY);

                                        // Update position (X only) and size
                                        updateImagePosition(imageElement.id,
                                            (imageElement.x || 50) + translationX,
                                            imageElement.y || 50
                                        );

                                        const scaledWidth = newWidth * 8;
                                        const scaledHeight = newHeight * 8;
                                        updateImageSize(imageElement.id, scaledWidth, scaledHeight);
                                    }}
                                >
                                    <View
                                        style={{
                                            position: 'absolute',
                                            bottom: -6,
                                            left: -6,
                                            width: 12,
                                            height: 12,
                                            backgroundColor: colors.primary,
                                            borderRadius: 6,
                                            borderWidth: 1,
                                            borderColor: colors.background,
                                        }}
                                    />
                                </PanGestureHandler>
                            </>
                        )}
                    </Animated.View>
                </PanGestureHandler>
            );
        });

        // Add text elements (layer 3 - top)
        textElements.forEach((textElement, index) => {
            console.log('Rendering text element:', textElement);
            const isSelected = selectedTextId === textElement.id;

            elements.push(
                <PanGestureHandler
                    key={`text-pan-${textElement.id || index}`}
                    onGestureEvent={(event) => {
                        const { translationX, translationY } = event.nativeEvent;
                        const startPos = dragState[textElement.id] || { startX: textElement.x || 50, startY: textElement.y || 50 };
                        const newX = startPos.startX + translationX;
                        const newY = startPos.startY + translationY;
                        updateTextPosition(textElement.id, newX, newY);
                    }}
                    onHandlerStateChange={(event) => {
                        const { state } = event.nativeEvent;

                        if (state === State.BEGAN) {
                            saveDragStartState(); // Save state when drag begins
                            setDragState(prev => ({
                                ...prev,
                                [textElement.id]: {
                                    startX: textElement.x || 50,
                                    startY: textElement.y || 50
                                }
                            }));
                            setSelectedTextId(textElement.id);
                            setSelectedImageId(null); // Deselect image when selecting text
                        } else if (state === State.END || state === State.CANCELLED) {
                            saveDragEndState(); // Save state when drag ends
                            setDragState(prev => {
                                const newState = { ...prev };
                                delete newState[textElement.id];
                                return newState;
                            });
                        }
                    }}
                >
                    <Animated.View
                        style={{
                            position: 'absolute',
                            top: textElement.y || 50,
                            left: textElement.x || 50,
                            borderWidth: isSelected ? 2 : 0,
                            borderColor: colors.primary,
                            borderStyle: 'dashed',
                            padding: 4,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            minWidth: 50,
                            minHeight: 30,
                        }}
                    >
                        <RNText
                            style={{
                                fontSize: (textElement.style.fontSize || 24) / 4,
                                fontFamily: textElement.style.fontFamily,
                                color: textElement.style.color || '#FFFFFF',
                                backgroundColor: textElement.style.backgroundColor,
                                textAlign: textElement.style.textAlign,
                                fontWeight: textElement.style.fontWeight,
                                textDecorationLine: textElement.style.textDecoration,
                                textTransform: textElement.style.textTransform,
                                paddingHorizontal: 8,
                                paddingVertical: 4,
                            }}
                        >
                            {textElement.text || 'Missing Text'}
                        </RNText>
                    </Animated.View>
                </PanGestureHandler>
            );
        });

        console.log('Total elements to render:', elements.length);
        return elements.length > 0 ? elements : null;
    };

    const handleExport = async () => {
        if (isExporting) return;

        try {
            setIsExporting(true);

            // First, check for media library permissions
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'Please allow access to your photo library to save memes.',
                    [{ text: 'OK' }]
                );
                return;
            }

            // Clear selections before export to avoid selection borders
            const previousTextSelection = selectedTextId;
            const previousImageSelection = selectedImageId;
            setSelectedTextId(null);
            setSelectedImageId(null);

            // Wait a bit for state to update
            setTimeout(async () => {
                try {
                    if (!viewShotRef.current?.capture) {
                        throw new Error('Canvas not ready for export');
                    }

                    // Capture the canvas
                    const uri = await viewShotRef.current?.capture();

                    if (!uri) {
                        throw new Error('Failed to capture canvas');
                    }

                    // Save to photo library
                    const asset = await MediaLibrary.createAssetAsync(uri);
                    await MediaLibrary.createAlbumAsync('MemeGene', asset, false);

                    Alert.alert(
                        'Success!',
                        'Your meme has been saved to your photo library.',
                        [{ text: 'OK' }]
                    );

                    // Restore previous selections
                    setSelectedTextId(previousTextSelection);
                    setSelectedImageId(previousImageSelection);
                } catch (error) {
                    console.error('Export error:', error);
                    Alert.alert(
                        'Export Failed',
                        'Could not save your meme. Please try again.',
                        [{ text: 'OK' }]
                    );

                    // Restore previous selections
                    setSelectedTextId(previousTextSelection);
                    setSelectedImageId(previousImageSelection);
                }
            }, 100);
        } catch (error) {
            console.error('Export permission error:', error);
            Alert.alert(
                'Export Failed',
                'Could not save your meme. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsExporting(false);
        }
    };

    const handleTextTool = () => {
        setEditingTextId(null);
        setShowTextEditor(true);
    };

    const handleImageTool = () => {
        setEditingImageId(null);
        setShowImageEditor(true);
    };

    const tools: { id: EditorTool; icon: keyof typeof Ionicons.glyphMap; title: string }[] = [
        { id: 'canvas', icon: 'resize-outline', title: 'Canvas' },
        { id: 'text', icon: 'text-outline', title: 'Text' },
        { id: 'image', icon: 'image-outline', title: 'Image' },
        { id: 'export', icon: 'download-outline', title: 'Export' },
    ];

    // Add a separate effect to track textElements changes
    useEffect(() => {
        console.log('TextElements state changed:', textElements);
    }, [textElements]);

    // Delete selected text element
    const deleteSelectedText = () => {
        if (selectedTextId) {
            saveStateForAction('delete_text'); // Save before deletion
            setTextElements(prev => prev.filter(element => element.id !== selectedTextId));
            setSelectedTextId(null);
        }
    };

    // Duplicate selected text element
    const duplicateSelectedText = () => {
        if (selectedTextId) {
            const selectedElement = textElements.find(element => element.id === selectedTextId);
            if (selectedElement) {
                saveStateForAction('duplicate_text'); // Save before duplication

                const duplicatedElement = {
                    ...selectedElement,
                    id: Date.now().toString(), // New unique ID
                    x: (selectedElement.x || 50) + 20, // Offset position slightly
                    y: (selectedElement.y || 50) + 20,
                };

                console.log('Duplicating text element:', duplicatedElement);
                setTextElements(prev => [...prev, duplicatedElement]);
                setSelectedTextId(duplicatedElement.id); // Select the new duplicated element
            }
        }
    };

    // Update text element position
    const updateTextPosition = (textId: string, x: number, y: number) => {
        setTextElements(prev =>
            prev.map(element =>
                element.id === textId
                    ? { ...element, x: x, y: y }
                    : element
            )
        );
    };

    // Add new text element directly without navigation
    const addTextElement = (textData: any) => {
        console.log('Adding new text element:', textData);
        saveStateForAction('add_text'); // Save before adding
        setTextElements(prev => {
            const updated = [...prev, textData];
            console.log('Updated text elements:', updated);
            return updated;
        });
        setShowTextEditor(false); // Close the text editor modal
        setEditingTextId(null); // Clear editing state
    };

    // Edit existing text element
    const editTextElement = (textData: any) => {
        console.log('Editing text element:', textData);
        if (editingTextId) {
            saveStateForAction('edit_text'); // Save before editing
            setTextElements(prev =>
                prev.map(element =>
                    element.id === editingTextId
                        ? { ...textData, id: editingTextId, x: element.x, y: element.y } // Keep position
                        : element
                )
            );
        }
        setShowTextEditor(false);
        setEditingTextId(null);
    };

    // Handle text editor save (either add new or edit existing)
    const handleTextSave = (textData: any) => {
        if (editingTextId) {
            editTextElement(textData);
        } else {
            addTextElement(textData);
        }
    };

    // Handle text editor cancel
    const cancelTextEditor = () => {
        setShowTextEditor(false);
        setEditingTextId(null);
    };

    // Open text editor for editing existing text
    const editSelectedText = () => {
        if (selectedTextId) {
            setEditingTextId(selectedTextId);
            setShowTextEditor(true);
        }
    };

    // Update image element position
    const updateImagePosition = (imageId: string, x: number, y: number) => {
        setImageElements(prev =>
            prev.map(element =>
                element.id === imageId
                    ? { ...element, x: x, y: y }
                    : element
            )
        );
    };

    // Update image element size
    const updateImageSize = (imageId: string, width: number, height: number) => {
        setImageElements(prev =>
            prev.map(element =>
                element.id === imageId
                    ? { ...element, width: width, height: height }
                    : element
            )
        );
    };

    // Add new image element
    const addImageElement = (imageData: ImageElement) => {
        console.log('Adding new image element:', imageData);
        saveStateForAction('add_image'); // Save before adding
        setImageElements(prev => {
            const updated = [...prev, imageData];
            console.log('Updated image elements:', updated);
            return updated;
        });
        setShowImageEditor(false);
        setEditingImageId(null);
    };

    // Edit existing image element
    const editImageElement = (imageData: ImageElement) => {
        console.log('Editing image element:', imageData);
        if (editingImageId) {
            saveStateForAction('edit_image'); // Save before editing
            setImageElements(prev =>
                prev.map(element =>
                    element.id === editingImageId
                        ? { ...imageData, id: editingImageId, x: element.x, y: element.y }
                        : element
                )
            );
        }
        setShowImageEditor(false);
        setEditingImageId(null);
    };

    // Handle image editor save
    const handleImageSave = (imageData: ImageElement) => {
        if (editingImageId) {
            editImageElement(imageData);
        } else {
            addImageElement(imageData);
        }
    };

    // Handle image editor cancel
    const cancelImageEditor = () => {
        setShowImageEditor(false);
        setEditingImageId(null);
    };

    // Delete selected image element
    const deleteSelectedImage = () => {
        if (selectedImageId) {
            saveStateForAction('delete_image'); // Save before deletion
            setImageElements(prev => prev.filter(element => element.id !== selectedImageId));
            setSelectedImageId(null);
        }
    };

    // Duplicate selected image element
    const duplicateSelectedImage = () => {
        if (selectedImageId) {
            const selectedElement = imageElements.find(element => element.id === selectedImageId);
            if (selectedElement) {
                saveStateForAction('duplicate_image'); // Save before duplication

                const duplicatedElement = {
                    ...selectedElement,
                    id: Date.now().toString(),
                    x: (selectedElement.x || 50) + 20,
                    y: (selectedElement.y || 50) + 20,
                };

                console.log('Duplicating image element:', duplicatedElement);
                setImageElements(prev => [...prev, duplicatedElement]);
                setSelectedImageId(duplicatedElement.id);
            }
        }
    };

    // Open image editor for editing existing image
    const editSelectedImage = () => {
        if (selectedImageId) {
            setEditingImageId(selectedImageId);
            setShowImageEditor(true);
        }
    };

    const handleUndo = () => {
        if (undoStack.length > 0) {
            isRestoringRef.current = true;

            // Get the last state from undo stack
            const lastState = undoStack[undoStack.length - 1];

            // Save current state to redo stack
            const currentState = {
                textElements: [...textElements],
                imageElements: [...imageElements],
                timestamp: Date.now(),
                action: `redo_${lastState.action}`
            };
            setRedoStack(prev => [...prev, currentState]);

            // Remove the last state from undo stack
            setUndoStack(prev => prev.slice(0, -1));

            // Clear selections before restoring state
            setSelectedTextId(null);
            setSelectedImageId(null);

            // Restore the previous state
            setTextElements(lastState.textElements);
            setImageElements(lastState.imageElements);

            console.log(`Undo: ${lastState.action}, undo stack size: ${undoStack.length - 1}`);

            // Reset flag after state updates
            setTimeout(() => {
                isRestoringRef.current = false;
            }, 100);
        }
    };

    const handleRedo = () => {
        if (redoStack.length > 0) {
            isRestoringRef.current = true;

            // Get the last state from redo stack
            const nextState = redoStack[redoStack.length - 1];

            // Save current state to undo stack
            const currentState = {
                textElements: [...textElements],
                imageElements: [...imageElements],
                timestamp: Date.now(),
                action: nextState.action.replace('redo_', 'undo_')
            };
            setUndoStack(prev => [...prev, currentState]);

            // Remove the last state from redo stack
            setRedoStack(prev => prev.slice(0, -1));

            // Clear selections before restoring state
            setSelectedTextId(null);
            setSelectedImageId(null);

            // Restore the next state
            setTextElements(nextState.textElements);
            setImageElements(nextState.imageElements);

            console.log(`Redo: ${nextState.action}, redo stack size: ${redoStack.length - 1}`);

            // Reset flag after state updates
            setTimeout(() => {
                isRestoringRef.current = false;
            }, 100);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Header */}
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
                            <TouchableOpacity onPress={editSelectedText} style={styles.actionButton}>
                                <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={duplicateSelectedText} style={styles.actionButton}>
                                <Ionicons name="copy-outline" size={18} color={colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={deleteSelectedText} style={styles.actionButton}>
                                <Ionicons name="trash-outline" size={18} color="#FF0000" />
                            </TouchableOpacity>
                        </>
                    )}

                    {selectedImageId && (
                        <>
                            <TouchableOpacity onPress={editSelectedImage} style={styles.actionButton}>
                                <Ionicons name="pencil-outline" size={18} color={colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={duplicateSelectedImage} style={styles.actionButton}>
                                <Ionicons name="copy-outline" size={18} color={colors.primary} />
                            </TouchableOpacity>

                            <TouchableOpacity onPress={deleteSelectedImage} style={styles.actionButton}>
                                <Ionicons name="trash-outline" size={18} color="#FF0000" />
                            </TouchableOpacity>
                        </>
                    )}

                    <TouchableOpacity onPress={zoomOut} style={styles.headerButton}>
                        <Ionicons name="remove" size={18} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={resetZoom} style={styles.headerButton}>
                        <Ionicons name="contract-outline" size={18} color={colors.text} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={zoomIn} style={styles.headerButton}>
                        <Ionicons name="add" size={18} color={colors.text} />
                    </TouchableOpacity>

                    <View style={styles.divider} />

                    <TouchableOpacity
                        onPress={handleUndo}
                        style={[styles.headerButton, !canUndo && styles.disabledButton]}
                        disabled={!canUndo}
                    >
                        <Ionicons name="arrow-undo" size={18} color={canUndo ? colors.text : colors.textSecondary} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleRedo}
                        style={[styles.headerButton, !canRedo && styles.disabledButton]}
                        disabled={!canRedo}
                    >
                        <Ionicons name="arrow-redo" size={18} color={canRedo ? colors.text : colors.textSecondary} />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Editor Area */}
            <View style={styles.editorContainer}>
                <TapGestureHandler
                    ref={tapRef}
                    numberOfTaps={2}
                    onHandlerStateChange={onDoubleTap}
                    waitFor={[pinchRef, panRef]}
                >
                    <Animated.View style={styles.gestureContainer}>
                        <PinchGestureHandler
                            ref={pinchRef}
                            onGestureEvent={onPinchEvent}
                            onHandlerStateChange={onPinchStateChange}
                            simultaneousHandlers={[panRef]}
                        >
                            <Animated.View style={styles.pinchContainer}>
                                <PanGestureHandler
                                    ref={panRef}
                                    onGestureEvent={onPanEvent}
                                    onHandlerStateChange={onPanStateChange}
                                    simultaneousHandlers={[pinchRef]}
                                    minPointers={1}
                                    maxPointers={1}
                                >
                                    <Animated.View style={styles.canvasContainer}>
                                        <ViewShot
                                            ref={viewShotRef}
                                            options={{
                                                format: 'png',
                                                quality: 1.0,
                                            }}
                                        >
                                            <Animated.View
                                                style={[
                                                    styles.canvas,
                                                    {
                                                        width: canvasWidth / 4,
                                                        height: canvasHeight / 4,
                                                        backgroundColor: creationType === 'blank' ? backgroundColor : 'transparent',
                                                        transform: [
                                                            { translateX },
                                                            { translateY },
                                                            { scale },
                                                        ],
                                                    },
                                                ]}
                                            >
                                                {getCanvasContent()}
                                            </Animated.View>
                                        </ViewShot>
                                    </Animated.View>
                                </PanGestureHandler>
                            </Animated.View>
                        </PinchGestureHandler>
                    </Animated.View>
                </TapGestureHandler>
            </View>

            {/* Bottom Toolbar */}
            <View style={styles.toolbar}>
                <View style={styles.toolsContainer}>
                    {tools.map((tool) => (
                        <TouchableOpacity
                            key={tool.id}
                            style={[
                                styles.toolButton,
                                activeTool === tool.id && styles.activeToolButton,
                            ]}
                            onPress={() => {
                                if (tool.id === 'export') {
                                    handleExport();
                                } else if (tool.id === 'text') {
                                    handleTextTool();
                                } else if (tool.id === 'image') {
                                    handleImageTool();
                                } else {
                                    setActiveTool(tool.id);
                                }
                            }}
                            disabled={tool.id === 'export' && isExporting}
                        >
                            <Ionicons
                                name={tool.id === 'export' && isExporting ? 'hourglass-outline' : tool.icon}
                                size={24}
                                color={activeTool === tool.id ? colors.primary : colors.textSecondary}
                            />
                            <Text
                                variant="caption"
                                color={activeTool === tool.id ? colors.primary : colors.textSecondary}
                                style={styles.toolLabel}
                            >
                                {tool.id === 'export' && isExporting ? 'Saving...' : tool.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            {/* Text Editor Modal */}
            <Modal
                visible={showTextEditor}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={cancelTextEditor}
            >
                <TextEditorPage
                    onSave={handleTextSave}
                    onCancel={cancelTextEditor}
                    isModal={true}
                    canvasParams={params}
                    editingText={editingTextId ? textElements.find(el => el.id === editingTextId) : null}
                />
            </Modal>

            {/* Image Editor Modal */}
            <Modal
                visible={showImageEditor}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={cancelImageEditor}
            >
                <ImageEditor
                    onClose={cancelImageEditor}
                    onSave={handleImageSave}
                    editingImage={editingImageId ? imageElements.find(el => el.id === editingImageId) : null}
                />
            </Modal>
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