import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, spacing } from '../../constants/theme';
import { MemeCreationOption } from '../../types';
import { Text } from '../atoms/Text';
import { Modal } from '../molecules/Modal';
import { OptionCard } from '../molecules/OptionCard';

interface CreationOptionsModalProps {
    visible: boolean;
    onClose: () => void;
    onOptionSelect: (option: MemeCreationOption) => void;
}

const CREATION_OPTIONS: MemeCreationOption[] = [
    {
        id: 'blank',
        title: 'Create from Blank Canvas',
        description: 'Start with a blank canvas and customize size and background',
        icon: 'add-circle-outline',
        type: 'blank',
    },
    {
        id: 'template',
        title: 'Use Meme Template',
        description: 'Choose from popular meme templates',
        icon: 'grid-outline',
        type: 'template',
    },
    {
        id: 'gallery',
        title: 'Pick Image from Gallery',
        description: 'Select an image from your photo library',
        icon: 'images-outline',
        type: 'gallery',
    },
];

export const CreationOptionsModal: React.FC<CreationOptionsModalProps> = ({
    visible,
    onClose,
    onOptionSelect,
}) => {
    return (
        <Modal visible={visible} onClose={onClose} size="medium">
            <View style={styles.container}>
                <Text variant="h2" style={styles.title}>
                    Create a Meme
                </Text>
                <Text variant="caption" color={colors.textSecondary} style={styles.subtitle}>
                    Choose how you want to create your meme
                </Text>

                <View style={styles.optionsContainer}>
                    {CREATION_OPTIONS.map((option) => (
                        <OptionCard
                            key={option.id}
                            option={option}
                            onPress={() => onOptionSelect(option)}
                        />
                    ))}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        // Remove paddingBottom since Modal handles padding
    },
    title: {
        textAlign: 'center',
        marginBottom: spacing.xs,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    optionsContainer: {
        gap: spacing.sm,
    },
}); 