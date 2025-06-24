import { useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import { Modal, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Custom hooks
import {
    useEditorGestures,
    useExport,
    useImageElements,
    useTextElements,
    useUndoRedo,
} from '../src/hooks';

// Components
import { EditorCanvas } from '../src/components/organisms/EditorCanvas';
import { EditorHeader } from '../src/components/organisms/EditorHeader';
import { EditorToolbar } from '../src/components/organisms/EditorToolbar';
import { ImageEditor } from './image-editor';
import { TextEditorPage } from './text-editor';

// Types and utils
import { ImageElement, TextElement } from '../src/types';
import { styles } from './editor.styles';

type EditorTool = 'canvas' | 'text' | 'image' | 'export';

export const EditorPageRefactored: React.FC = () => {
    const params = useLocalSearchParams();
    const insets = useSafeAreaInsets();
    const [activeTool, setActiveTool] = useState<EditorTool>('canvas');

    // ViewShot refs
    const viewShotRef = useRef<any>(null);
    const canvasRef = useRef<any>(null);

    // Gesture management
    const gestures = useEditorGestures();

    // Text elements management
    const textElementsHook = useTextElements({
        onStateChange: (action: string) => undoRedoHook.saveStateForAction(action),
    });

    // Image elements management
    const imageElementsHook = useImageElements({
        onStateChange: (action: string) => undoRedoHook.saveStateForAction(action),
    });

    // Undo/Redo management
    const undoRedoHook = useUndoRedo({
        textElements: textElementsHook.textElements,
        imageElements: imageElementsHook.imageElements,
        onRestore: (textElements: TextElement[], imageElements: ImageElement[]) => {
            // Clear selections before restoring
            textElementsHook.setSelectedTextId(null);
            imageElementsHook.setSelectedImageId(null);

            // Restore state
            textElementsHook.setTextElements(textElements);
            imageElementsHook.setImageElements(imageElements);
        },
    });

    // Export management
    const exportHook = useExport({
        canvasParams: params,
        clearSelections: () => {
            textElementsHook.setSelectedTextId(null);
            imageElementsHook.setSelectedImageId(null);
        },
        resetCanvasTransform: () => {
            gestures.translateX.setValue(0);
            gestures.translateY.setValue(0);
            gestures.scale.setValue(1);
            gestures.gestureState.current = {
                scale: 1,
                translateX: 0,
                translateY: 0,
                lastScale: 1,
                lastTranslateX: 0,
                lastTranslateY: 0,
            };
        },
        restoreCanvasTransform: (translateX: number, translateY: number, scale: number) => {
            gestures.translateX.setValue(translateX);
            gestures.translateY.setValue(translateY);
            gestures.scale.setValue(scale);
            gestures.gestureState.current.translateX = translateX;
            gestures.gestureState.current.translateY = translateY;
            gestures.gestureState.current.scale = scale;
        },
        captureCanvas: async () => {
            if (!viewShotRef.current?.capture) {
                throw new Error('Canvas not ready for export');
            }
            return await viewShotRef.current.capture({
                format: 'png',
                quality: 1.0,
                result: 'tmpfile',
            });
        },
    });

    // Canvas parameters
    const canvasWidth = parseInt(params.width as string) || 800;
    const canvasHeight = parseInt(params.height as string) || 800;
    const backgroundColor = (params.backgroundColor as string) || '#FFFFFF';
    const creationType = params.type as string;
    const imageUrl = params.imageUrl as string;
    const imageUri = params.imageUri as string;

    return (
        <View style={styles.container}>
            <StatusBar style="dark" translucent={false} />

            {/* Header */}
            <View style={{ paddingTop: insets.top }}>
                <EditorHeader
                    currentZoom={gestures.currentZoom}
                    onZoomIn={gestures.zoomIn}
                    onZoomOut={gestures.zoomOut}
                    onResetZoom={gestures.resetZoom}
                    onUndo={undoRedoHook.handleUndo}
                    onRedo={undoRedoHook.handleRedo}
                    canUndo={undoRedoHook.canUndo}
                    canRedo={undoRedoHook.canRedo}
                    selectedTextId={textElementsHook.selectedTextId}
                    selectedImageId={imageElementsHook.selectedImageId}
                    onEditText={textElementsHook.editSelectedText}
                    onDuplicateText={textElementsHook.duplicateSelectedText}
                    onDeleteText={textElementsHook.deleteSelectedText}
                    onEditImage={imageElementsHook.editSelectedImage}
                    onDuplicateImage={imageElementsHook.duplicateSelectedImage}
                    onDeleteImage={imageElementsHook.deleteSelectedImage}
                />
            </View>

            {/* Canvas */}
            <EditorCanvas
                // Gesture props
                translateX={gestures.translateX}
                translateY={gestures.translateY}
                scale={gestures.scale}
                panRef={gestures.panRef}
                pinchRef={gestures.pinchRef}
                tapRef={gestures.tapRef}
                onPanEvent={gestures.onPanEvent}
                onPanStateChange={gestures.onPanStateChange}
                onPinchEvent={gestures.onPinchEvent}
                onPinchStateChange={gestures.onPinchStateChange}
                onDoubleTap={gestures.onDoubleTap}

                // Canvas props
                canvasWidth={canvasWidth}
                canvasHeight={canvasHeight}
                backgroundColor={backgroundColor}
                creationType={creationType}
                imageUrl={imageUrl}
                imageUri={imageUri}

                // Elements
                textElements={textElementsHook.textElements}
                imageElements={imageElementsHook.imageElements}
                selectedTextId={textElementsHook.selectedTextId}
                selectedImageId={imageElementsHook.selectedImageId}

                // Element handlers
                onSelectText={textElementsHook.setSelectedTextId}
                onSelectImage={imageElementsHook.setSelectedImageId}
                onUpdateTextPosition={textElementsHook.updateTextPosition}
                onUpdateImagePosition={imageElementsHook.updateImagePosition}
                onUpdateImageSize={imageElementsHook.updateImageSize}
                onDragStart={undoRedoHook.saveDragStartState}
                onDragEnd={undoRedoHook.saveDragEndState}

                // Refs
                viewShotRef={viewShotRef}
                canvasRef={canvasRef}
            />

            {/* Toolbar */}
            <EditorToolbar
                activeTool={activeTool}
                onToolSelect={setActiveTool}
                onTextTool={textElementsHook.handleTextTool}
                onImageTool={imageElementsHook.handleImageTool}
                onExport={exportHook.handleExport}
                isExporting={exportHook.isExporting}
            />

            {/* Text Editor Modal */}
            <Modal
                visible={textElementsHook.showTextEditor}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={textElementsHook.cancelTextEditor}
            >
                <TextEditorPage
                    onSave={textElementsHook.handleTextSave}
                    onCancel={textElementsHook.cancelTextEditor}
                    isModal={true}
                    canvasParams={params}
                    editingText={
                        textElementsHook.editingTextId
                            ? textElementsHook.textElements.find(el => el.id === textElementsHook.editingTextId)
                            : null
                    }
                />
            </Modal>

            {/* Image Editor Modal */}
            <Modal
                visible={imageElementsHook.showImageEditor}
                animationType="slide"
                presentationStyle="pageSheet"
                onRequestClose={imageElementsHook.cancelImageEditor}
            >
                <ImageEditor
                    onClose={imageElementsHook.cancelImageEditor}
                    onSave={imageElementsHook.handleImageSave}
                    editingImage={
                        imageElementsHook.editingImageId
                            ? imageElementsHook.imageElements.find(el => el.id === imageElementsHook.editingImageId)
                            : null
                    }
                />
            </Modal>
        </View>
    );
};

// Default export for Expo Router compatibility
export default EditorPageRefactored; 