import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants/theme';
import { BaseComponentProps } from '../../types';

interface TextProps extends BaseComponentProps {
    variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
    color?: string;
    align?: 'left' | 'center' | 'right';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
}

export const Text: React.FC<TextProps> = ({
    children,
    variant = 'body',
    color = colors.text,
    align = 'left',
    weight,
    style,
    testID,
    ...props
}) => {
    const textStyle = [
        styles[variant],
        { color, textAlign: align },
        weight && { fontWeight: weight },
        style,
    ];

    return (
        <RNText style={textStyle} testID={testID} {...props}>
            {children}
        </RNText>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontSize: typography.h1.fontSize,
        fontWeight: typography.h1.fontWeight as any,
        lineHeight: typography.h1.fontSize * 1.2,
    },
    h2: {
        fontSize: typography.h2.fontSize,
        fontWeight: typography.h2.fontWeight as any,
        lineHeight: typography.h2.fontSize * 1.3,
    },
    h3: {
        fontSize: typography.h3.fontSize,
        fontWeight: typography.h3.fontWeight as any,
        lineHeight: typography.h3.fontSize * 1.4,
    },
    body: {
        fontSize: typography.body.fontSize,
        fontWeight: typography.body.fontWeight as any,
        lineHeight: typography.body.fontSize * 1.5,
    },
    caption: {
        fontSize: typography.caption.fontSize,
        fontWeight: typography.caption.fontWeight as any,
        lineHeight: typography.caption.fontSize * 1.4,
    },
}); 