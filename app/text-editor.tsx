import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Text as RNText,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../src/components';
import { borderRadius, colors, spacing } from '../src/constants/theme';

interface TextStyle {
    fontSize: number;
    fontFamily: string | undefined;
    color: string;
    backgroundColor: string;
    textAlign: 'left' | 'center' | 'right';
    fontWeight: 'normal' | 'bold';
    textDecoration: 'none' | 'underline';
    textTransform: 'none' | 'uppercase' | 'lowercase';
}

const FONT_FAMILIES = [
    { name: 'System', value: undefined },
    { name: 'Inter', value: 'Inter_400Regular' },           // Modern alternative to Helvetica
    { name: 'Roboto', value: 'Roboto_400Regular' },         // Android's default, great alternative to Arial
    { name: 'Open Sans', value: 'OpenSans_400Regular' },    // Clean alternative to Verdana
    { name: 'Playfair', value: 'PlayfairDisplay_400Regular' }, // Elegant alternative to Times/Georgia
    { name: 'Source Sans', value: 'SourceSansPro_400Regular' }, // Professional alternative
    { name: 'Anton', value: 'Anton' },
    { name: 'Bebas Neue', value: 'BebasNeue' },
    { name: 'Fredoka One', value: 'FredokaOne' },
    { name: 'Oswald', value: 'Oswald' },
    { name: 'Righteous', value: 'Righteous' },
    { name: 'Monospace', value: 'monospace' },
    { name: 'Serif', value: 'serif' },
    { name: 'Sans-Serif', value: 'sans-serif' },
];

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 84, 96];

const TEXT_COLORS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
];

const BACKGROUND_COLORS = [
    'transparent', '#000000', '#FFFFFF', '#FF0000', '#00FF00',
    '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000080',
];

interface TextEditorProps {
    // Modal props (optional - when used as modal)
    onSave?: (textData: any) => void;
    onCancel?: () => void;
    isModal?: boolean;
    canvasParams?: any;
    editingText?: any; // Existing text data when editing
}

export default function TextEditorPage({ onSave, onCancel, isModal = false, canvasParams, editingText }: TextEditorProps = {}) {
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const actualParams = canvasParams || params; // Use canvasParams when modal, params when standalone

    // Initialize with existing text data if editing, otherwise use defaults
    const [text, setText] = useState(editingText?.text || 'Your Meme Text');
    const [opacity, setOpacity] = useState(editingText?.opacity || 1);
    const [textStyle, setTextStyle] = useState<TextStyle>(editingText?.style || {
        fontSize: 24,
        fontFamily: undefined,
        color: '#FFFFFF',
        backgroundColor: 'transparent',
        textAlign: 'center',
        fontWeight: 'bold',
        textDecoration: 'none',
        textTransform: 'uppercase',
    });

    // Update state when editingText changes (for editing mode)
    useEffect(() => {
        if (editingText) {
            setText(editingText.text || 'Your Meme Text');
            setOpacity(editingText.opacity || 1);
            setTextStyle(editingText.style || {
                fontSize: 24,
                fontFamily: undefined,
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                textAlign: 'center',
                fontWeight: 'bold',
                textDecoration: 'none',
                textTransform: 'uppercase',
            });
        }
    }, [editingText]);

    const updateTextStyle = (key: keyof TextStyle, value: any) => {
        console.log(`🎨 Font Debug: Updating ${key} to:`, value);
        setTextStyle(prev => {
            const newStyle = { ...prev, [key]: value };
            console.log('🎨 Font Debug: New text style:', newStyle);
            return newStyle;
        });
    };

    const handleSave = () => {
        if (!text.trim()) {
            Alert.alert('Error', 'Please enter some text');
            return;
        }

        const textData = {
            text: text.trim(),
            style: textStyle,
            opacity,
            id: Date.now().toString(),
            x: 50,
            y: 50,
        };

        if (isModal && onSave) {
            // Modal mode - call the callback
            onSave(textData);
        } else {
            // Standalone page mode - navigate back with params
            router.push({
                pathname: '/editor',
                params: {
                    ...actualParams,
                    newText: JSON.stringify(textData),
                },
            });
        }
    };

    const handleCancel = () => {
        if (isModal && onCancel) {
            // Modal mode - call the callback
            onCancel();
        } else {
            // Standalone page mode - navigate back
            router.back();
        }
    };

    const ColorPicker = ({
        title,
        colors: colorOptions,
        selectedColor,
        onColorSelect
    }: {
        title: string;
        colors: string[];
        selectedColor: string;
        onColorSelect: (color: string) => void;
    }) => (
        <View style={styles.section}>
            <Text variant="h3" style={styles.sectionTitle}>
                {title}
            </Text>
            <View style={styles.colorGrid}>
                {colorOptions.map((color, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.colorOption,
                            { backgroundColor: color === 'transparent' ? '#F0F0F0' : color },
                            selectedColor === color && styles.selectedColorOption,
                            color === 'transparent' && styles.transparentOption,
                        ]}
                        onPress={() => onColorSelect(color)}
                    >
                        {color === 'transparent' && (
                            <Ionicons name="close" size={16} color={colors.textSecondary} />
                        )}
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <StatusBar style="dark" translucent={false} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={handleCancel} style={styles.backButton}>
                    <Ionicons name={isModal ? "close" : "arrow-back"} size={24} color={colors.text} />
                </TouchableOpacity>
                <Text variant="h2" style={styles.headerTitle}>
                    Text Editor
                </Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
                    <Text variant="body" color={colors.primary} weight="medium">
                        Save
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
                showsVerticalScrollIndicator={false}
            >
                {/* Text Preview */}
                <View style={styles.previewSection}>
                    <Text variant="h3" style={styles.sectionTitle}>
                        Preview
                    </Text>
                    <View style={styles.previewContainer}>
                        {/* <RNText style={{
                            fontFamily: textStyle.fontFamily,
                            fontSize: textStyle.fontSize,
                            color: textStyle.color,
                            backgroundColor: textStyle.backgroundColor,
                            textTransform: textStyle.textTransform,
                            textAlign: textStyle.textAlign,
                            textDecorationLine: textStyle.textDecoration,
                            flex: 1
                        }}>
                            {text || 'Your Meme Text'}
                        </RNText> */}
                        <RNText
                            style={[
                                styles.previewText,
                                {
                                    fontSize: textStyle.fontSize,
                                    fontFamily: textStyle.fontFamily,
                                    color: textStyle.color,
                                    backgroundColor: textStyle.backgroundColor,
                                    textAlign: textStyle.textAlign,
                                    // fontWeight: textStyle.fontWeight,
                                    textDecorationLine: textStyle.textDecoration,
                                    textTransform: textStyle.textTransform,
                                    opacity,
                                },
                            ]}
                        >
                            {text || 'Your Meme Text'}
                        </RNText>

                    </View>
                </View>


                {/* Text Input */}
                <View style={styles.section}>
                    <Text variant="h3" style={styles.sectionTitle}>
                        Text Content
                    </Text>
                    <TextInput
                        style={styles.textInput}
                        value={text}
                        onChangeText={setText}
                        placeholder="Enter your meme text..."
                        multiline
                        textAlignVertical="top"
                    />
                </View>

                {/* Font Family */}
                <View style={styles.section}>
                    <Text variant="h3" style={styles.sectionTitle}>
                        Font Style
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.fontGrid}>
                            {FONT_FAMILIES.map((font, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.fontOption,
                                        textStyle.fontFamily === font.value && styles.selectedFontOption,
                                    ]}
                                    onPress={() => updateTextStyle('fontFamily', font.value)}
                                >
                                    <Text
                                        variant="body"
                                        style={[
                                            styles.fontOptionText,
                                            { fontFamily: font.value || undefined },
                                            textStyle.fontFamily === font.value && { color: colors.primary },
                                        ]}
                                    >
                                        {font.name}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Font Size */}
                <View style={styles.section}>
                    <Text variant="h3" style={styles.sectionTitle}>
                        Font Size: {textStyle.fontSize}px
                    </Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.sizeGrid}>
                            {FONT_SIZES.map((size, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[
                                        styles.sizeOption,
                                        textStyle.fontSize === size && styles.selectedSizeOption,
                                    ]}
                                    onPress={() => updateTextStyle('fontSize', size)}
                                >
                                    <Text
                                        variant="caption"
                                        color={textStyle.fontSize === size ? colors.primary : colors.text}
                                        weight="medium"
                                    >
                                        {size}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Text Color */}
                <ColorPicker
                    title="Text Color"
                    colors={TEXT_COLORS}
                    selectedColor={textStyle.color}
                    onColorSelect={(color) => updateTextStyle('color', color)}
                />

                {/* Background Color */}
                <ColorPicker
                    title="Background Color"
                    colors={BACKGROUND_COLORS}
                    selectedColor={textStyle.backgroundColor}
                    onColorSelect={(color) => updateTextStyle('backgroundColor', color)}
                />

                {/* Opacity Control */}
                <View style={styles.section}>
                    <Text variant="h3" style={styles.sectionTitle}>
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

                {/* Text Alignment */}
                <View style={styles.section}>
                    <Text variant="h3" style={styles.sectionTitle}>
                        Text Alignment
                    </Text>
                    <View style={styles.alignmentGrid}>
                        {(['left', 'center', 'right'] as const).map((align) => (
                            <TouchableOpacity
                                key={align}
                                style={[
                                    styles.alignmentOption,
                                    textStyle.textAlign === align && styles.selectedAlignmentOption,
                                ]}
                                onPress={() => updateTextStyle('textAlign', align)}
                            >
                                <Ionicons
                                    name={
                                        align === 'left' ? 'text-outline' :
                                            align === 'center' ? 'text-outline' : 'text-outline'
                                    }
                                    size={20}
                                    color={textStyle.textAlign === align ? colors.primary : colors.textSecondary}
                                />
                                <Text
                                    variant="caption"
                                    color={textStyle.textAlign === align ? colors.primary : colors.textSecondary}
                                    style={styles.alignmentLabel}
                                >
                                    {align.charAt(0).toUpperCase() + align.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>


                <View style={styles.bottomPadding} />
            </ScrollView>
        </View>
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
    headerTitle: {
        flex: 1,
        textAlign: 'center',
    },
    saveButton: {
        padding: spacing.xs,
    },
    content: {
        flex: 1,
        padding: spacing.md,
    },
    scrollContent: {
        padding: spacing.md,
    },
    previewSection: {
        marginBottom: spacing.xl,
    },
    previewContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        borderWidth: 1,
        borderColor: colors.border,
    },
    previewText: {
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
    },
    section: {
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        marginBottom: spacing.md,
    },
    textInput: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 16,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
        minHeight: 80,
    },
    fontGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    fontOption: {
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        minWidth: 80,
        alignItems: 'center',
    },
    selectedFontOption: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    fontOptionText: {
        fontSize: 14,
    },
    sizeGrid: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    sizeOption: {
        width: 50,
        height: 40,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedSizeOption: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    colorGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    colorOption: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        borderWidth: 2,
        borderColor: colors.border,
        alignItems: 'center',
        justifyContent: 'center',
    },
    selectedColorOption: {
        borderColor: colors.primary,
        borderWidth: 3,
    },
    transparentOption: {
        borderStyle: 'dashed',
    },
    alignmentGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    alignmentOption: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    selectedAlignmentOption: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    alignmentLabel: {
        marginTop: spacing.xs,
    },
    styleGrid: {
        flexDirection: 'row',
        gap: spacing.md,
    },
    styleOption: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        alignItems: 'center',
    },
    selectedStyleOption: {
        borderColor: colors.primary,
        backgroundColor: colors.background,
    },
    bottomPadding: {
        height: spacing.xl,
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    debugSection: {
        marginBottom: spacing.xl,
    },
    debugContainer: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.xl,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 100,
        borderWidth: 1,
        borderColor: colors.border,
    },
    debugTextContainer: {
        marginBottom: spacing.md,
    },
    debugFontTest: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
}); 