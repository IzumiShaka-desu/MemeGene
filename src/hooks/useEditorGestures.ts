import { useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import { State } from 'react-native-gesture-handler';

export const useEditorGestures = () => {
    // Animated values
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current;

    // Refs
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

    // Pan gesture handling
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

    // Pinch gesture handling
    const onPinchEvent = useCallback((event: any) => {
        const { scale: eventScale } = event.nativeEvent;
        const newScale = gestureState.current.lastScale * eventScale;
        const constrainedScale = Math.min(Math.max(newScale, minScale), maxScale);

        scale.setValue(constrainedScale);
        gestureState.current.scale = constrainedScale;
    }, []);

    const onPinchStateChange = useCallback((event: any) => {
        if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
            gestureState.current.lastScale = gestureState.current.scale;
        }
    }, []);

    // Double-tap zoom
    const onDoubleTap = useCallback((event: any) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            const currentScale = gestureState.current.scale;
            const targetScale = currentScale > 1.2 ? 1 : 2;

            Animated.timing(scale, {
                toValue: targetScale,
                duration: 300,
                useNativeDriver: true,
            }).start();

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
        }
    }, []);

    // Reset zoom
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
    }, []);

    // Zoom in/out
    const zoomIn = useCallback(() => {
        const newScale = Math.min(gestureState.current.scale * 1.5, maxScale);
        Animated.timing(scale, {
            toValue: newScale,
            duration: 200,
            useNativeDriver: true,
        }).start();

        gestureState.current.scale = newScale;
        gestureState.current.lastScale = newScale;
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
    }, []);

    return {
        // Animated values
        translateX,
        translateY,
        scale,
        // Refs
        panRef,
        pinchRef,
        tapRef,
        // Gesture state
        gestureState,
        // Current zoom level
        currentZoom: gestureState.current.scale,
        // Gesture handlers
        onPanEvent,
        onPanStateChange,
        onPinchEvent,
        onPinchStateChange,
        onDoubleTap,
        // Zoom controls
        resetZoom,
        zoomIn,
        zoomOut,
    };
}; 