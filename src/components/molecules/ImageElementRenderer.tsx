import React from 'react';
import { Animated, Image, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { colors } from '../../constants';
import { ImageElement } from '../../types';

interface ImageElementRendererProps {
    imageElement: ImageElement;
    isSelected: boolean;
    onSelect: () => void;
    onUpdatePosition: (id: string, x: number, y: number) => void;
    onUpdateSize: (id: string, width: number, height: number) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    dragState: { [key: string]: { startX: number, startY: number } };
    setDragState: (state: any) => void;
}

export const ImageElementRenderer: React.FC<ImageElementRendererProps> = ({
    imageElement,
    isSelected,
    onSelect,
    onUpdatePosition,
    onUpdateSize,
    onDragStart,
    onDragEnd,
    dragState,
    setDragState,
}) => {
    return (
        <PanGestureHandler
            onGestureEvent={(event) => {
                const { translationX, translationY } = event.nativeEvent;
                const startPos = dragState[imageElement.id] || { startX: imageElement.x || 50, startY: imageElement.y || 50 };
                const newX = startPos.startX + translationX;
                const newY = startPos.startY + translationY;
                onUpdatePosition(imageElement.id, newX, newY);
            }}
            onHandlerStateChange={(event) => {
                const { state } = event.nativeEvent;

                if (state === State.BEGAN) {
                    onDragStart();
                    setDragState({
                        ...dragState,
                        [imageElement.id]: {
                            startX: imageElement.x || 50,
                            startY: imageElement.y || 50
                        }
                    });
                    onSelect();
                } else if (state === State.END || state === State.CANCELLED) {
                    onDragEnd();
                    const newState = { ...dragState };
                    delete newState[imageElement.id];
                    setDragState(newState);
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
                    resizeMode="cover"
                    style={{
                        width: (imageElement.width * imageElement.crop.width) / 8,
                        height: (imageElement.height * imageElement.crop.height) / 8,
                        opacity: imageElement.opacity,
                    }}
                />

                {/* Simplified resize handles for selected elements */}
                {isSelected && (
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
                )}
            </Animated.View>
        </PanGestureHandler>
    );
}; 