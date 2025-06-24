import * as MediaLibrary from 'expo-media-library';
import { useCallback, useState } from 'react';
import { Alert, Platform } from 'react-native';

interface UseExportProps {
    canvasParams: any;
    clearSelections: () => void;
    resetCanvasTransform: () => void;
    restoreCanvasTransform: (translateX: number, translateY: number, scale: number) => void;
    captureCanvas: () => Promise<string>;
}

export const useExport = ({
    canvasParams,
    clearSelections,
    resetCanvasTransform,
    restoreCanvasTransform,
    captureCanvas,
}: UseExportProps) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = useCallback(async () => {
        if (isExporting) return;

        try {
            setIsExporting(true);

            // Platform-specific permission check
            if (Platform.OS !== 'web') {
                const { status } = await MediaLibrary.requestPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert(
                        'Permission Required',
                        'Please allow access to your photo library to save memes.',
                        [{ text: 'OK' }]
                    );
                    return;
                }
            }

            // Store current state for restoration
            const previousState = {
                translateX: 0, // These would come from gesture state
                translateY: 0,
                scale: 1,
            };

            // Clear selections and reset canvas for export
            clearSelections();
            resetCanvasTransform();

            // Wait for UI to update
            setTimeout(async () => {
                try {
                    const uri = await captureCanvas();

                    if (!uri) {
                        throw new Error('Failed to capture canvas');
                    }

                    console.log('Canvas captured successfully:', uri);

                    // Platform-specific save logic
                    if (Platform.OS === 'web') {
                        // Web: Trigger browser download
                        if (typeof document !== 'undefined') {
                            const link = document.createElement('a');
                            link.download = `meme-${Date.now()}.png`;
                            link.href = uri;
                            link.style.display = 'none';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            Alert.alert(
                                'Success!',
                                'Your meme has been downloaded to your device.',
                                [{ text: 'OK' }]
                            );
                        } else {
                            throw new Error('Document not available for web download');
                        }
                    } else {
                        // Mobile: Save to photo library
                        const asset = await MediaLibrary.createAssetAsync(uri);
                        await MediaLibrary.createAlbumAsync('MemeGene', asset, false);

                        Alert.alert(
                            'Success!',
                            'Your meme has been saved to your photo library at full resolution.',
                            [{ text: 'OK' }]
                        );
                    }

                    // Restore previous state
                    restoreCanvasTransform(previousState.translateX, previousState.translateY, previousState.scale);

                } catch (error) {
                    console.error('Export error:', error);
                    Alert.alert(
                        'Export Failed',
                        'Could not save your meme. Please try again.',
                        [{ text: 'OK' }]
                    );

                    // Restore previous state even on error
                    restoreCanvasTransform(previousState.translateX, previousState.translateY, previousState.scale);
                }
            }, 200);

        } catch (error) {
            console.error('Export permission error:', error);
            Alert.alert(
                'Export Failed',
                'Could not save your meme. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsExporting(false);
        }
    }, [isExporting, clearSelections, resetCanvasTransform, restoreCanvasTransform, captureCanvas]);

    return {
        isExporting,
        handleExport,
    };
}; 