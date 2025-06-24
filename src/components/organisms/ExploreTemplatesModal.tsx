import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal as RNModal,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { borderRadius, colors, shadows, spacing } from '../../constants/theme';
import { ApiMemeTemplate } from '../../types';
import { Text } from '../atoms/Text';

interface ExploreTemplatesModalProps {
    visible: boolean;
    onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');
const numColumns = 1;
const horizontalPadding = spacing.md * 2; // Container padding
const cardWidth = screenWidth - horizontalPadding;

export const ExploreTemplatesModal: React.FC<ExploreTemplatesModalProps> = ({
    visible,
    onClose,
}) => {
    const [templates, setTemplates] = useState<ApiMemeTemplate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const insets = useSafeAreaInsets();

    const fetchTemplates = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://api.memegen.link/templates?animated=false');
            if (!response.ok) {
                throw new Error('Failed to fetch templates');
            }
            const data = await response.json();
            setTemplates(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            Alert.alert('Error', 'Failed to load templates. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (visible) {
            fetchTemplates();
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
    }, [visible]);

    const handleTemplateSelect = (template: ApiMemeTemplate) => {
        onClose();
        // Navigate to editor with the selected template
        router.push({
            pathname: '/editor',
            params: {
                type: 'template',
                templateId: template.id,
                width: 800, // Default width for API templates
                height: 600, // Default height for API templates
                imageUrl: template.blank,
            },
        });
    };

    const renderTemplate = ({ item }: { item: ApiMemeTemplate }) => (
        <TouchableOpacity
            style={styles.templateCard}
            onPress={() => handleTemplateSelect(item)}
            activeOpacity={0.8}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: item.blank }}
                    style={styles.templateImage}
                    resizeMode="cover"
                />
            </View>
            <View style={styles.templateInfo}>
                <Text variant="body" weight="medium" style={styles.templateName}>
                    {item.name}
                </Text>
                <Text variant="caption" color={colors.textSecondary} style={styles.templateDetails}>
                    {item.lines} line{item.lines !== 1 ? 's' : ''} • {item.keywords.length > 0 ? item.keywords.slice(0, 2).join(', ') : 'Meme template'}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderContent = () => {
        if (loading) {
            return (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text variant="body" color={colors.textSecondary} style={styles.loadingText}>
                        Loading templates...
                    </Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.centerContent}>
                    <Ionicons name="alert-circle-outline" size={48} color={colors.error} />
                    <Text variant="body" color={colors.error} style={styles.errorText}>
                        Failed to load templates
                    </Text>
                    <TouchableOpacity onPress={fetchTemplates} style={styles.retryButton}>
                        <Text variant="caption" color={colors.primary}>
                            Tap to retry
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return (
            <FlatList
                data={templates}
                renderItem={renderTemplate}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
                ItemSeparatorComponent={() => <View style={{ height: spacing.md }} />}
                style={styles.flatList}
            />
        );
    };

    return (
        <RNModal
            visible={visible}
            transparent
            animationType="none"
            statusBarTranslucent
        >
            <Animated.View
                style={[
                    styles.backdrop,
                    {
                        opacity: fadeAnim,
                        paddingTop: insets.top,
                        paddingBottom: insets.bottom,
                    }
                ]}
            >
                <TouchableWithoutFeedback onPress={onClose}>
                    <View style={styles.backdropTouchable} />
                </TouchableWithoutFeedback>

                <View style={styles.modalContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text variant="h2" style={styles.title}>
                            Explore Templates
                        </Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color={colors.text} />
                        </TouchableOpacity>
                    </View>

                    <Text variant="caption" color={colors.textSecondary} style={styles.subtitle}>
                        Choose from hundreds of popular meme templates
                    </Text>

                    {/* Content - FlatList handles its own scrolling */}
                    {renderContent()}
                </View>
            </Animated.View>
        </RNModal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    backdropTouchable: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalContainer: {
        backgroundColor: colors.background,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        flex: 1,
        marginTop: spacing.xl * 2,
        paddingHorizontal: spacing.md,
        paddingTop: spacing.md,
        ...shadows.large,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xs,
    },
    title: {
        flex: 1,
    },
    closeButton: {
        padding: spacing.xs,
        marginRight: -spacing.xs,
    },
    subtitle: {
        marginBottom: spacing.lg,
    },
    flatList: {
        flex: 1,
    },
    listContent: {
        paddingBottom: spacing.md,
    },
    centerContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xl,
    },
    loadingText: {
        marginTop: spacing.md,
    },
    errorText: {
        marginTop: spacing.md,
        textAlign: 'center',
    },
    retryButton: {
        marginTop: spacing.sm,
        padding: spacing.sm,
    },
    row: {
        justifyContent: 'space-between',
    },
    templateCard: {
        width: cardWidth,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        ...shadows.small,
        overflow: 'hidden',
        flexDirection: 'row',
        alignItems: 'center',
    },
    imageContainer: {
        width: 80,
        height: 80,
        backgroundColor: colors.border,
        borderRadius: borderRadius.sm,
    },
    templateImage: {
        width: '100%',
        height: '100%',
    },
    templateInfo: {
        flex: 1,
        padding: spacing.md,
    },
    templateName: {
        marginBottom: spacing.xs,
        lineHeight: 16,
    },
    templateDetails: {
        fontSize: 12,
    },
}); 