import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Button,
  CanvasSettingsModal,
  CreationOptionsModal,
  Text
} from '../src/components';
import { colors } from '../src/constants';
import { CanvasSettings, MemeCreationOption } from '../src/types';
import { styles } from './index.styles';

export const Index: React.FC = () => {
  const [showCreationOptions, setShowCreationOptions] = useState(false);
  const [showCanvasSettings, setShowCanvasSettings] = useState(false);
  const insets = useSafeAreaInsets();

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
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <StatusBar style="dark" translucent={false} />

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
    </View>
  );
}



// Default export for Expo Router compatibility
export default Index;
