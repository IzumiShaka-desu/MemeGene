import { useCallback, useEffect, useRef, useState } from 'react';
import { ImageElement, TextElement } from '../types';

interface EditorState {
    textElements: TextElement[];
    imageElements: ImageElement[];
    timestamp: number;
    action: string;
}

interface UseUndoRedoProps {
    textElements: TextElement[];
    imageElements: ImageElement[];
    onRestore: (textElements: TextElement[], imageElements: ImageElement[]) => void;
}

export const useUndoRedo = ({ textElements, imageElements, onRestore }: UseUndoRedoProps) => {
    const [undoStack, setUndoStack] = useState<EditorState[]>([]);
    const [redoStack, setRedoStack] = useState<EditorState[]>([]);
    const [canUndo, setCanUndo] = useState(false);
    const [canRedo, setCanRedo] = useState(false);

    // Control refs
    const isRestoringRef = useRef(false);
    const lastSaveTimeRef = useRef(0);
    const currentActionRef = useRef<string | null>(null);
    const isDraggingRef = useRef(false);
    const dragStartStateRef = useRef<{
        textElements: TextElement[];
        imageElements: ImageElement[];
    } | null>(null);

    // Save current state to undo stack
    const saveCurrentState = useCallback((action: string = 'unknown') => {
        if (isRestoringRef.current) return;

        const now = Date.now();
        const timeSinceLastSave = now - lastSaveTimeRef.current;

        // For auto-saves, only save if enough time has passed AND we're not dragging
        if (action === 'auto_save' && (timeSinceLastSave < 5000 || isDraggingRef.current)) {
            return;
        }

        // For action-based saves, always save unless it's the same action within 1 second
        if (action !== 'auto_save' && currentActionRef.current === action && timeSinceLastSave < 1000) {
            return;
        }

        const currentState = {
            textElements: [...textElements],
            imageElements: [...imageElements],
            timestamp: now,
            action: action
        };

        setUndoStack(prev => {
            // Don't save if state hasn't actually changed
            const lastState = prev[prev.length - 1];
            if (lastState &&
                JSON.stringify(lastState.textElements) === JSON.stringify(currentState.textElements) &&
                JSON.stringify(lastState.imageElements) === JSON.stringify(currentState.imageElements)) {
                return prev;
            }

            const newStack = [...prev, currentState];
            // Keep only last 15 meaningful states
            return newStack.length > 15 ? newStack.slice(-15) : newStack;
        });

        // Clear redo stack when new action is performed
        setRedoStack([]);

        lastSaveTimeRef.current = now;
        currentActionRef.current = action;

        console.log(`State saved to undo stack: ${action}`);
    }, [textElements, imageElements]);

    // Save state when elements change (debounced auto-save)
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isDraggingRef.current) {
                saveCurrentState('auto_save');
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [saveCurrentState]);

    // Update button states
    useEffect(() => {
        setCanUndo(undoStack.length > 0);
        setCanRedo(redoStack.length > 0);
    }, [undoStack.length, redoStack.length]);

    // Manual save for specific actions
    const saveStateForAction = useCallback((action: string) => {
        saveCurrentState(action);
    }, [saveCurrentState]);

    // Drag state management
    const saveDragStartState = useCallback(() => {
        if (!isDraggingRef.current) {
            dragStartStateRef.current = {
                textElements: [...textElements],
                imageElements: [...imageElements]
            };
            isDraggingRef.current = true;
        }
    }, [textElements, imageElements]);

    const saveDragEndState = useCallback(() => {
        if (isDraggingRef.current && dragStartStateRef.current) {
            const startState = dragStartStateRef.current;
            const hasSignificantChange =
                JSON.stringify(startState.textElements) !== JSON.stringify(textElements) ||
                JSON.stringify(startState.imageElements) !== JSON.stringify(imageElements);

            if (hasSignificantChange) {
                const currentUndoState = {
                    textElements: [...startState.textElements],
                    imageElements: [...startState.imageElements],
                    timestamp: Date.now() - 1000,
                    action: 'move_start'
                };

                setUndoStack(prev => {
                    const lastState = prev[prev.length - 1];
                    if (!lastState ||
                        JSON.stringify(lastState.textElements) !== JSON.stringify(currentUndoState.textElements) ||
                        JSON.stringify(lastState.imageElements) !== JSON.stringify(currentUndoState.imageElements)) {
                        return [...prev, currentUndoState];
                    }
                    return prev;
                });

                saveCurrentState('move_end');
            }

            isDraggingRef.current = false;
            dragStartStateRef.current = null;
        }
    }, [textElements, imageElements, saveCurrentState]);

    // Undo operation
    const handleUndo = useCallback(() => {
        if (undoStack.length > 0) {
            isRestoringRef.current = true;

            const lastState = undoStack[undoStack.length - 1];

            // Save current state to redo stack
            const currentState = {
                textElements: [...textElements],
                imageElements: [...imageElements],
                timestamp: Date.now(),
                action: `redo_${lastState.action}`
            };
            setRedoStack(prev => [...prev, currentState]);

            // Remove the last state from undo stack
            setUndoStack(prev => prev.slice(0, -1));

            // Restore the previous state
            onRestore(lastState.textElements, lastState.imageElements);

            console.log(`Undo: ${lastState.action}, undo stack size: ${undoStack.length - 1}`);

            setTimeout(() => {
                isRestoringRef.current = false;
            }, 100);
        }
    }, [undoStack, textElements, imageElements, onRestore]);

    // Redo operation
    const handleRedo = useCallback(() => {
        if (redoStack.length > 0) {
            isRestoringRef.current = true;

            const nextState = redoStack[redoStack.length - 1];

            // Save current state to undo stack
            const currentState = {
                textElements: [...textElements],
                imageElements: [...imageElements],
                timestamp: Date.now(),
                action: nextState.action.replace('redo_', 'undo_')
            };
            setUndoStack(prev => [...prev, currentState]);

            // Remove the last state from redo stack
            setRedoStack(prev => prev.slice(0, -1));

            // Restore the next state
            onRestore(nextState.textElements, nextState.imageElements);

            console.log(`Redo: ${nextState.action}, redo stack size: ${redoStack.length - 1}`);

            setTimeout(() => {
                isRestoringRef.current = false;
            }, 100);
        }
    }, [redoStack, textElements, imageElements, onRestore]);

    return {
        // State
        canUndo,
        canRedo,
        // Actions
        saveStateForAction,
        saveDragStartState,
        saveDragEndState,
        handleUndo,
        handleRedo,
    };
}; 