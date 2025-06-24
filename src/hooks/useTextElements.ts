import { useCallback, useState } from 'react';
import { TextElement } from '../types';

interface UseTextElementsProps {
    onStateChange?: (action: string) => void;
}

export const useTextElements = ({ onStateChange }: UseTextElementsProps = {}) => {
    const [textElements, setTextElements] = useState<TextElement[]>([]);
    const [selectedTextId, setSelectedTextId] = useState<string | null>(null);
    const [editingTextId, setEditingTextId] = useState<string | null>(null);
    const [showTextEditor, setShowTextEditor] = useState(false);

    // Add new text element
    const addTextElement = useCallback((textData: any) => {
        console.log('Adding new text element:', textData);
        onStateChange?.('add_text');
        setTextElements(prev => {
            const updated = [...prev, textData];
            console.log('Updated text elements:', updated);
            return updated;
        });
        setShowTextEditor(false);
        setEditingTextId(null);
    }, [onStateChange]);

    // Edit existing text element
    const editTextElement = useCallback((textData: any) => {
        console.log('Editing text element:', textData);
        if (editingTextId) {
            onStateChange?.('edit_text');
            setTextElements(prev =>
                prev.map(element =>
                    element.id === editingTextId
                        ? { ...textData, id: editingTextId, x: element.x, y: element.y }
                        : element
                )
            );
        }
        setShowTextEditor(false);
        setEditingTextId(null);
    }, [editingTextId, onStateChange]);

    // Delete selected text element
    const deleteSelectedText = useCallback(() => {
        if (selectedTextId) {
            onStateChange?.('delete_text');
            setTextElements(prev => prev.filter(element => element.id !== selectedTextId));
            setSelectedTextId(null);
        }
    }, [selectedTextId, onStateChange]);

    // Duplicate selected text element
    const duplicateSelectedText = useCallback(() => {
        if (selectedTextId) {
            const selectedElement = textElements.find(element => element.id === selectedTextId);
            if (selectedElement) {
                onStateChange?.('duplicate_text');
                const duplicatedElement = {
                    ...selectedElement,
                    id: Date.now().toString(),
                    x: (selectedElement.x || 50) + 20,
                    y: (selectedElement.y || 50) + 20,
                };

                console.log('Duplicating text element:', duplicatedElement);
                setTextElements(prev => [...prev, duplicatedElement]);
                setSelectedTextId(duplicatedElement.id);
            }
        }
    }, [selectedTextId, textElements, onStateChange]);

    // Update text element position
    const updateTextPosition = useCallback((textId: string, x: number, y: number) => {
        setTextElements(prev =>
            prev.map(element =>
                element.id === textId
                    ? { ...element, x: x, y: y }
                    : element
            )
        );
    }, []);

    // Text editor operations
    const handleTextTool = useCallback(() => {
        setEditingTextId(null);
        setShowTextEditor(true);
    }, []);

    const editSelectedText = useCallback(() => {
        if (selectedTextId) {
            setEditingTextId(selectedTextId);
            setShowTextEditor(true);
        }
    }, [selectedTextId]);

    const handleTextSave = useCallback((textData: any) => {
        if (editingTextId) {
            editTextElement(textData);
        } else {
            addTextElement(textData);
        }
    }, [editingTextId, editTextElement, addTextElement]);

    const cancelTextEditor = useCallback(() => {
        setShowTextEditor(false);
        setEditingTextId(null);
    }, []);

    return {
        // State
        textElements,
        selectedTextId,
        editingTextId,
        showTextEditor,
        // Actions
        setTextElements,
        setSelectedTextId,
        addTextElement,
        editTextElement,
        deleteSelectedText,
        duplicateSelectedText,
        updateTextPosition,
        // Editor operations
        handleTextTool,
        editSelectedText,
        handleTextSave,
        cancelTextEditor,
    };
}; 