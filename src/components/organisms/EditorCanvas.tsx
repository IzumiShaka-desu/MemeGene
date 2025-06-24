import React, { useRef } from 'react';
import { Animated, Image, View } from 'react-native';
import { PanGestureHandler, PinchGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';
import ViewShot from 'react-native-view-shot';
import { ImageElement, TextElement } from '../../types';
import { ImageElementRenderer } from '../molecules/ImageElementRenderer';
import { TextElementRenderer } from '../molecules/TextElementRenderer';

interface EditorCanvasProps {
    // Gesture props
    translateX: Animated.Value;
    translateY: Animated.Value;
    scale: Animated.Value;
    panRef: React.RefObject<any>;
    pinchRef: React.RefObject<any>;
    tapRef: React.RefObject<any>;
    onPanEvent: (event: any) => void;
    onPanStateChange: (event: any) => void;
    onPinchEvent: (event: any) => void;
    onPinchStateChange: (event: any) => void;
    onDoubleTap: (event: any) => void;

    // Canvas props
    canvasWidth: number;
    canvasHeight: number;
    backgroundColor: string;
    creationType: string;
    imageUrl?: string;
    imageUri?: string;

    // Elements
    textElements: TextElement[];
    imageElements: ImageElement[];
    selectedTextId: string | null;
    selectedImageId: string | null;

    // Element handlers
    onSelectText: (id: string) => void;
    onSelectImage: (id: string) => void;
    onUpdateTextPosition: (id: string, x: number, y: number) => void;
    onUpdateImagePosition: (id: string, x: number, y: number) => void;
    onUpdateImageSize: (id: string, width: number, height: number) => void;
    onDragStart: () => void;
    onDragEnd: () => void;

    // Refs
    viewShotRef: React.RefObject<any>;
    canvasRef: React.RefObject<any>;
}

export const EditorCanvas: React.FC<EditorCanvasProps> = ({
    translateX,
    translateY,
    scale,
    panRef,
    pinchRef,
    tapRef,
    onPanEvent,
    onPanStateChange,
    onPinchEvent,
    onPinchStateChange,
    onDoubleTap,
    canvasWidth,
    canvasHeight,
    backgroundColor,
    creationType,
    imageUrl,
    imageUri,
    textElements,
    imageElements,
    selectedTextId,
    selectedImageId,
    onSelectText,
    onSelectImage,
    onUpdateTextPosition,
    onUpdateImagePosition,
    onUpdateImageSize,
    onDragStart,
    onDragEnd,
    viewShotRef,
    canvasRef,
}) => {
    const dragState = useRef<{ [key: string]: { startX: number, startY: number } }>({});

    const getCanvasContent = () => {
        const elements = [];

        // Add base content (template or gallery image)
        if (creationType === 'template' && imageUrl) {
            elements.push(
                <Image
                    key="template"
                    source={{ uri: imageUrl }}
                    resizeMode="cover"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            );
        } else if (creationType === 'gallery' && imageUri) {
            elements.push(
                <Image
                    key="gallery"
                    source={{ uri: imageUri }}
                    resizeMode="cover"
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                />
            );
        }

        // Add image elements
        imageElements.forEach((imageElement) => {
            elements.push(
                <ImageElementRenderer
                    key={`image-${imageElement.id}`}
                    imageElement={imageElement}
                    isSelected={selectedImageId === imageElement.id}
                    onSelect={() => {
                        onSelectImage(imageElement.id);
                        onSelectText(''); // Clear text selection
                    }}
                    onUpdatePosition={onUpdateImagePosition}
                    onUpdateSize={onUpdateImageSize}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    dragState={dragState.current}
                    setDragState={(state: any) => {
                        dragState.current = state;
                    }}
                />
            );
        });

        // Add text elements
        textElements.forEach((textElement) => {
            elements.push(
                <TextElementRenderer
                    key={`text-${textElement.id}`}
                    textElement={textElement}
                    isSelected={selectedTextId === textElement.id}
                    onSelect={() => {
                        onSelectText(textElement.id);
                        onSelectImage(''); // Clear image selection
                    }}
                    onUpdatePosition={onUpdateTextPosition}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    dragState={dragState.current}
                    setDragState={(state: any) => {
                        dragState.current = state;
                    }}
                />
            );
        });

        return elements.length > 0 ? elements : null;
    };

    return (
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
                                            ref={canvasRef}
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
    );
};

const styles = {
    editorContainer: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    gestureContainer: {
        flex: 1,
    },
    pinchContainer: {
        flex: 1,
    },
    canvasContainer: {
        flex: 1,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },
    canvas: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
}; 