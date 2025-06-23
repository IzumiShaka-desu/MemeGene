// Core type definitions for the design system
export interface BaseComponentProps {
    testID?: string;
    style?: any;
    children?: React.ReactNode;
}

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
    warning: string;
}

export interface ThemeSpacing {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
}

export interface ThemeTypography {
    h1: {
        fontSize: number;
        fontWeight: string;
    };
    h2: {
        fontSize: number;
        fontWeight: string;
    };
    h3: {
        fontSize: number;
        fontWeight: string;
    };
    body: {
        fontSize: number;
        fontWeight: string;
    };
    caption: {
        fontSize: number;
        fontWeight: string;
    };
}

// Meme creation types
export interface CanvasSettings {
    width: number;
    height: number;
    backgroundColor: string;
}

export interface MemeTemplate {
    id: string;
    name: string;
    imageUrl: string;
    width: number;
    height: number;
}

export interface MemeCreationOption {
    id: string;
    title: string;
    description: string;
    icon: string;
    type: 'blank' | 'template' | 'upload';
}

export interface EditorElement {
    id: string;
    type: 'text' | 'image';
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    data: any;
}

export interface EditorState {
    canvasSettings: CanvasSettings;
    elements: EditorElement[];
    selectedElementId?: string;
    history: EditorState[];
    historyIndex: number;
}

export type EditorTool = 'canvas' | 'text' | 'image' | 'export'; 