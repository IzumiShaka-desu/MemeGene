import React from 'react';
import {
    Animated,
    Modal as RNModal,
    StyleSheet,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../../constants/theme';
import { BaseComponentProps } from '../../types';

interface ModalProps extends BaseComponentProps {
    visible: boolean;
    onClose: () => void;
    title?: string;
    closeOnBackdrop?: boolean;
    size?: 'small' | 'medium' | 'large' | 'fullscreen';
}

export const Modal: React.FC<ModalProps> = ({
    children,
    visible,
    onClose,
    closeOnBackdrop = true,
    size = 'medium',
    style,
    testID,
}) => {
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

    React.useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 0.9,
                    duration: 150,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const modalStyle = [
        styles.modal,
        styles[size],
        style,
    ];

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
            testID={testID}
        >
            <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
                <TouchableWithoutFeedback onPress={closeOnBackdrop ? onClose : undefined}>
                    <View style={styles.backdropTouchable} />
                </TouchableWithoutFeedback>
                <Animated.View
                    style={[
                        modalStyle,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }],
                        },
                    ]}
                >
                    {children}
                </Animated.View>
            </Animated.View>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    backdropTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modal: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        ...shadows.large,
        maxHeight: '80%',
    },
    small: {
        width: '80%',
        maxWidth: 300,
    },
    medium: {
        width: '90%',
        maxWidth: 400,
    },
    large: {
        width: '95%',
        maxWidth: 600,
    },
    fullscreen: {
        width: '100%',
        height: '100%',
        borderRadius: 0,
        padding: 0,
    },
}); 