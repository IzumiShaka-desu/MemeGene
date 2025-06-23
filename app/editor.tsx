import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef, useState } from 'react';
import {
    Animated,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    PanGestureHandler,
    PinchGestureHandler,
    State,
    TapGestureHandler,
} from 'react-native-gesture-handler';
import { Text } from '../src/components';
import { borderRadius, colors, spacing } from '../src/constants/theme';
import { EditorTool } from '../src/types';

export default function EditorPage() {
    const params = useLocalSearchParams();
    const [activeTool, setActiveTool] = useState<EditorTool>('canvas');
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);
    const [currentZoom, setCurrentZoom] = useState(1);

    // Animated values
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    // State tracking
    const panRef = useRef(null);
    const pinchRef = useRef(null);
    const tapRef = useRef(null);

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

    const canvasWidth = parseInt(params.width as string) || 800;
    const canvasHeight = parseInt(params.height as string) || 800;
    const backgroundColor = (params.backgroundColor as string) || '#FFFFFF';

    const handleUndo = () => {
        console.log('Undo');
    };

    const handleRedo = () => {
        console.log('Redo');
    };

    const handleExport = () => {
        console.log('Export');
    };

    const tools: { id: EditorTool; icon: keyof typeof Ionicons.glyphMap; title: string }[] = [
        { id: 'canvas', icon: 'resize-outline', title: 'Canvas' },
        { id: 'text', icon: 'text-outline', title: 'Text' },
        { id: 'image', icon: 'image-outline', title: 'Image' },
        { id: 'export', icon: 'download-outline', title: 'Export' },
    ];

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
                                        <Animated.View
                                            style={[
                                                styles.canvas,
                                                {
                                                    width: canvasWidth / 4,
                                                    height: canvasHeight / 4,
                                                    backgroundColor,
                                                    transform: [
                                                        { translateX },
                                                        { translateY },
                                                        { scale },
                                                    ],
                                                },
                                            ]}
                                        >
                                            <Text variant="caption" color={colors.textSecondary} style={styles.canvasLabel}>
                                                Canvas ({canvasWidth} × {canvasHeight})
                                            </Text>
                                            <Text variant="caption" color={colors.textSecondary} style={styles.gestureHint}>
                                                Double tap • Pinch • Drag
                                            </Text>
                                        </Animated.View>
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
                                } else {
                                    setActiveTool(tool.id);
                                }
                            }}
                        >
                            <Ionicons
                                name={tool.icon}
                                size={24}
                                color={activeTool === tool.id ? colors.primary : colors.textSecondary}
                            />
                            <Text
                                variant="caption"
                                color={activeTool === tool.id ? colors.primary : colors.textSecondary}
                                style={styles.toolLabel}
                            >
                                {tool.title}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
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
        borderWidth: 2,
        borderColor: colors.border,
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.md,
        borderRadius: borderRadius.sm,
    },
    canvasLabel: {
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    gestureHint: {
        textAlign: 'center',
        fontSize: 10,
        opacity: 0.6,
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
}); 