import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Image,
    ScrollView,
    TouchableOpacity,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, ExploreTemplatesModal, Text } from '../src/components';
import { MEME_TEMPLATES, colors, spacing } from '../src/constants';
import { MemeTemplate } from '../src/types';
import { styles } from './templates.styles';



export const TemplatesPage: React.FC = () => {
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



// Default export for Expo Router compatibility
export default TemplatesPage; 