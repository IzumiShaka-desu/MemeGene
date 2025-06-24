import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import {
  Button,
  CanvasSettingsModal,
  CreationOptionsModal,
  Text
} from '../src/components';
import { colors, spacing } from '../src/constants/theme';
import { CanvasSettings, MemeCreationOption } from '../src/types';

export default function Index() {
  const [showCreationOptions, setShowCreationOptions] = useState(false);
  const [showCanvasSettings, setShowCanvasSettings] = useState(false);

  const handleCreateMeme = () => {
    setShowCreationOptions(true);
  };

  const handleOptionSelect = (option: MemeCreationOption) => {
    setShowCreationOptions(false);

    switch (option.type) {
      case 'blank':
        setShowCanvasSettings(true);
        break;
      case 'template':
        // Navigate to template selection (will implement next)
        router.push('/templates');
        break;
      case 'gallery':
        // Navigate to image picker (will implement next)
        router.push('/gallery');
        break;
    }
  };

  const handleCanvasConfirm = (settings: CanvasSettings) => {
    setShowCanvasSettings(false);
    // Navigate to editor with canvas settings
    router.push({
      pathname: '/editor',
      params: {
        type: 'blank',
        width: settings.width,
        height: settings.height,
        backgroundColor: settings.backgroundColor,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text variant="h1" style={styles.title}>
            MemeGene
          </Text>
          <Text variant="body" color={colors.textSecondary} style={styles.subtitle}>
            Create, share, and discover amazing memes
          </Text>
        </View>

        {/* Main CTA */}
        <View style={styles.ctaSection}>
          <Button
            title="Create a Meme"
            onPress={handleCreateMeme}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </View>

      {/* Modals */}
      <CreationOptionsModal
        visible={showCreationOptions}
        onClose={() => setShowCreationOptions(false)}
        onOptionSelect={handleOptionSelect}
      />

      <CanvasSettingsModal
        visible={showCanvasSettings}
        onClose={() => setShowCanvasSettings(false)}
        onConfirm={handleCanvasConfirm}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  title: {
    color: colors.primary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaSection: {
    marginBottom: spacing.xxl,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    justifyContent: 'space-between',
  },
  featureCard: {
    width: '48%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureTitle: {
    marginBottom: spacing.xs,
  },
});
