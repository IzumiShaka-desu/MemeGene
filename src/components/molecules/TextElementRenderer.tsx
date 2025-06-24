import React from 'react';
import { Animated, Text as RNText } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { colors } from '../../constants';
import { TextElement } from '../../types';

interface TextElementRendererProps {
    textElement: TextElement;
    isSelected: boolean;
    onSelect: () => void;
    onUpdatePosition: (id: string, x: number, y: number) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    dragState: { [key: string]: { startX: number, startY: number } };
    setDragState: (state: any) => void;
}

export const TextElementRenderer: React.FC<TextElementRendererProps> = ({
    textElement,
    isSelected,
    onSelect,
    onUpdatePosition,
    onDragStart,
    onDragEnd,
    dragState,
    setDragState,
}) => {
    return (
        <PanGestureHandler
            onGestureEvent={(event) => {
                const { translationX, translationY } = event.nativeEvent;
                const startPos = dragState[textElement.id] || { startX: textElement.x || 50, startY: textElement.y || 50 };
                const newX = startPos.startX + translationX;
                const newY = startPos.startY + translationY;
                onUpdatePosition(textElement.id, newX, newY);
            }}
            onHandlerStateChange={(event) => {
                const { state } = event.nativeEvent;

                if (state === State.BEGAN) {
                    onDragStart();
                    setDragState({
                        ...dragState,
                        [textElement.id]: {
                            startX: textElement.x || 50,
                            startY: textElement.y || 50
                        }
                    });
                    onSelect();
                } else if (state === State.END || state === State.CANCELLED) {
                    onDragEnd();
                    const newState = { ...dragState };
                    delete newState[textElement.id];
                    setDragState(newState);
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
                        textDecorationLine: textElement.style.textDecoration,
                        textTransform: textElement.style.textTransform,
                        opacity: textElement.opacity || 1,
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                    }}
                >
                    {textElement.text || 'Missing Text'}
                </RNText>
            </Animated.View>
        </PanGestureHandler>
    );
}; 