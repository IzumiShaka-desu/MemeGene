import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ExploreTemplatesModal, Text } from '../src/components';
import { borderRadius, colors, shadows, spacing } from '../src/constants/theme';
import { MemeTemplate } from '../src/types';

// Sample meme templates (in a real app, these would come from an API)
const MEME_TEMPLATES: MemeTemplate[] = [
    {
        id: '1',
        name: 'Drake Pointing',
        imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
        width: 1200,
        height: 1200,
    },
    {
        id: '2',
        name: 'Distracted Boyfriend',
        imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
        width: 1200,
        height: 800,
    },
    {
        id: '3',
        name: 'Two Buttons',
        imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
        width: 1200,
        height: 908,
    },
    {
        id: '4',
        name: 'Change My Mind',
        imageUrl: 'https://i.imgflip.com/24y43o.jpg',
        width: 1200,
        height: 900,
    },
    {
        id: '5',
        name: 'This Is Fine',
        imageUrl: 'https://i.imgflip.com/26am.jpg',
        width: 1200,
        height: 675,
    },
    {
        id: '6',
        name: 'Woman Yelling at Cat',
        imageUrl: 'https://i.imgflip.com/345v97.jpg',
        width: 1200,
        height: 438,
    },
];

export default function TemplatesPage() {
    const insets = useSafeAreaInsets();
    const [showExploreModal, setShowExploreModal] = useState(false);

    const handleTemplateSelect = (template: MemeTemplate) => {
        router.push({
            pathname: '/editor',
            params: {
                type: 'template',
                templateId: template.id,
                width: template.width,
                height: template.height,
                imageUrl: template.imageUrl,
            },
        });
    };

    return (
        <View style={styles.container}>
            <StatusBar style="dark" translucent={false} />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text variant="h2" style={styles.headerTitle}>
                    Meme Templates
                </Text>
                <View style={styles.placeholder} />
            </View>

            {/* Templates Grid */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + spacing.xl }]}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.grid}>
                    {MEME_TEMPLATES.map((template) => (
                        <TouchableOpacity
                            key={template.id}
                            style={styles.templateCard}
                            onPress={() => handleTemplateSelect(template)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.imageContainer}>
                                <Image
                                    source={{ uri: template.imageUrl }}
                                    style={styles.templateImage}
                                    resizeMode="cover"
                                />
                                <View style={styles.overlay} />
                            </View>
                            <View style={styles.templateInfo}>
                                <Text variant="body" weight="medium" style={styles.templateName}>
                                    {template.name}
                                </Text>
                                <Text variant="caption" color={colors.textSecondary}>
                                    {template.width} × {template.height}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Coming Soon Section */}
                <View style={styles.comingSoonSection}>
                    <Text variant="h3" style={styles.comingSoonTitle}>
                        Want More Templates?
                    </Text>
                    <Text variant="caption" color={colors.textSecondary} style={styles.comingSoonDesc}>
                        Explore hundreds of trending meme templates from popular APIs
                    </Text>
                    <Button
                        title="Explore More Templates"
                        onPress={() => setShowExploreModal(true)}
                        variant="primary"
                        style={styles.exploreButton}
                    />
                </View>
            </ScrollView>

            {/* Explore Templates Modal */}
            <ExploreTemplatesModal
                visible={showExploreModal}
                onClose={() => setShowExploreModal(false)}
            />
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
    placeholder: {
        width: 40, // Same as back button to center the title
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: spacing.md,
    },
    templateCard: {
        width: '48%',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        ...shadows.small,
        overflow: 'hidden',
    },
    imageContainer: {
        position: 'relative',
        aspectRatio: 1,
        backgroundColor: colors.border,
    },
    templateImage: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0,
    },
    templateInfo: {
        padding: spacing.sm,
    },
    templateName: {
        marginBottom: spacing.xs,
    },
    comingSoonSection: {
        padding: spacing.lg,
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    comingSoonTitle: {
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    comingSoonDesc: {
        textAlign: 'center',
        lineHeight: 20,
    },
    exploreButton: {
        marginTop: spacing.md,
    },
}); 