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

export interface ApiMemeTemplate {
    id: string;
    name: string;
    lines: number;
    overlays: number;
    styles: string[];
    blank: string;
    example: {
        text: string[];
        url: string;
    };
    source: string;
    keywords: string[];
    _self: string;
}

export interface MemeCreationOption {
    id: string;
    title: string;
    description: string;
    icon: string;
    type: 'blank' | 'template' | 'gallery';
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

// Text editor types
export interface TextStyle {
    fontSize: number;
    fontFamily: string | undefined;
    color: string;
    backgroundColor: string;
    textAlign: 'left' | 'center' | 'right';
    fontWeight: 'normal' | 'bold';
    textDecoration: 'none' | 'underline';
    textTransform: 'none' | 'uppercase' | 'lowercase';
}

export interface TextEditorProps {
    // Modal props (optional - when used as modal)
    onSave?: (textData: any) => void;
    onCancel?: () => void;
    isModal?: boolean;
    canvasParams?: any;
    editingText?: any; // Existing text data when editing
}

export interface TextElement {
    id: string;
    text: string;
    x?: number;
    y?: number;
    opacity?: number;
    style: {
        fontSize: number;
        fontFamily: string;
        color: string;
        backgroundColor: string;
        textAlign: 'left' | 'center' | 'right';
        fontWeight: 'normal' | 'bold';
        textDecoration: 'none' | 'underline';
        textTransform: 'none' | 'uppercase' | 'lowercase';
    };
}

// Image editor types
export interface ImageEditorProps {
    onClose: () => void;
    onSave: (imageData: ImageElement) => void;
    editingImage?: ImageElement | null;
}

export interface ImageElement {
    id: string;
    uri: string;
    width: number;
    height: number;
    x: number;
    y: number;
    opacity: number;
    crop: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    originalDimensions: {
        width: number;
        height: number;
    };
}

export interface ImageEditSettings {
    opacity: number;
    crop: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
}

export interface EditorState {
    canvasSettings: CanvasSettings;
    elements: EditorElement[];
    selectedElementId?: string;
    history: EditorState[];
    historyIndex: number;
}

export type EditorTool = 'canvas' | 'text' | 'image' | 'export'; 