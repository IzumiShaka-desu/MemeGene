import { useCallback, useState } from 'react';
import { ImageElement } from '../types';

interface UseImageElementsProps {
    onStateChange?: (action: string) => void;
}

export const useImageElements = ({ onStateChange }: UseImageElementsProps = {}) => {
    const [imageElements, setImageElements] = useState<ImageElement[]>([]);
    const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
    const [editingImageId, setEditingImageId] = useState<string | null>(null);
    const [showImageEditor, setShowImageEditor] = useState(false);

    // Add new image element
    const addImageElement = useCallback((imageData: ImageElement) => {
        console.log('Adding new image element:', imageData);
        onStateChange?.('add_image');
        setImageElements(prev => {
            const updated = [...prev, imageData];
            console.log('Updated image elements:', updated);
            return updated;
        });
        setShowImageEditor(false);
        setEditingImageId(null);
    }, [onStateChange]);

    // Edit existing image element
    const editImageElement = useCallback((imageData: ImageElement) => {
        console.log('Editing image element:', imageData);
        if (editingImageId) {
            onStateChange?.('edit_image');
            setImageElements(prev =>
                prev.map(element =>
                    element.id === editingImageId
                        ? { ...imageData, id: editingImageId, x: element.x, y: element.y }
                        : element
                )
            );
        }
        setShowImageEditor(false);
        setEditingImageId(null);
    }, [editingImageId, onStateChange]);

    // Delete selected image element
    const deleteSelectedImage = useCallback(() => {
        if (selectedImageId) {
            onStateChange?.('delete_image');
            setImageElements(prev => prev.filter(element => element.id !== selectedImageId));
            setSelectedImageId(null);
        }
    }, [selectedImageId, onStateChange]);

    // Duplicate selected image element
    const duplicateSelectedImage = useCallback(() => {
        if (selectedImageId) {
            const selectedElement = imageElements.find(element => element.id === selectedImageId);
            if (selectedElement) {
                onStateChange?.('duplicate_image');
                const duplicatedElement = {
                    ...selectedElement,
                    id: Date.now().toString(),
                    x: (selectedElement.x || 50) + 20,
                    y: (selectedElement.y || 50) + 20,
                };

                console.log('Duplicating image element:', duplicatedElement);
                setImageElements(prev => [...prev, duplicatedElement]);
                setSelectedImageId(duplicatedElement.id);
            }
        }
    }, [selectedImageId, imageElements, onStateChange]);

    // Update image element position
    const updateImagePosition = useCallback((imageId: string, x: number, y: number) => {
        setImageElements(prev =>
            prev.map(element =>
                element.id === imageId
                    ? { ...element, x: x, y: y }
                    : element
            )
        );
    }, []);

    // Update image element size
    const updateImageSize = useCallback((imageId: string, width: number, height: number) => {
        setImageElements(prev =>
            prev.map(element =>
                element.id === imageId
                    ? { ...element, width: width, height: height }
                    : element
            )
        );
    }, []);

    // Image editor operations
    const handleImageTool = useCallback(() => {
        setEditingImageId(null);
        setShowImageEditor(true);
    }, []);

    const editSelectedImage = useCallback(() => {
        if (selectedImageId) {
            setEditingImageId(selectedImageId);
            setShowImageEditor(true);
        }
    }, [selectedImageId]);

    const handleImageSave = useCallback((imageData: ImageElement) => {
        if (editingImageId) {
            editImageElement(imageData);
        } else {
            addImageElement(imageData);
        }
    }, [editingImageId, editImageElement, addImageElement]);

    const cancelImageEditor = useCallback(() => {
        setShowImageEditor(false);
        setEditingImageId(null);
    }, []);

    return {
        // State
        imageElements,
        selectedImageId,
        editingImageId,
        showImageEditor,
        // Actions
        setImageElements,
        setSelectedImageId,
        addImageElement,
        editImageElement,
        deleteSelectedImage,
        duplicateSelectedImage,
        updateImagePosition,
        updateImageSize,
        // Editor operations
        handleImageTool,
        editSelectedImage,
        handleImageSave,
        cancelImageEditor,
    };
}; 