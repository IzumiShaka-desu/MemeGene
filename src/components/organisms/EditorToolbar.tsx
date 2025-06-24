import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors } from '../../constants';
import { Text } from '../atoms/Text';

type EditorTool = 'canvas' | 'text' | 'image' | 'export';

interface EditorToolbarProps {
    activeTool: EditorTool;
    onToolSelect: (tool: EditorTool) => void;
    onTextTool: () => void;
    onImageTool: () => void;
    onExport: () => void;
    isExporting: boolean;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
    activeTool,
    onToolSelect,
    onTextTool,
    onImageTool,
    onExport,
    isExporting,
}) => {
    const tools: { id: EditorTool; icon: keyof typeof Ionicons.glyphMap; title: string }[] = [
        { id: 'canvas', icon: 'resize-outline', title: 'Canvas' },
        { id: 'text', icon: 'text-outline', title: 'Text' },
        { id: 'image', icon: 'image-outline', title: 'Image' },
        { id: 'export', icon: 'download-outline', title: 'Export' },
    ];

    const handleToolPress = (tool: { id: EditorTool; icon: keyof typeof Ionicons.glyphMap; title: string }) => {
        if (tool.id === 'export') {
            onExport();
        } else if (tool.id === 'text') {
            onTextTool();
        } else if (tool.id === 'image') {
            onImageTool();
        } else {
            onToolSelect(tool.id);
        }
    };

    return (
        <View style={styles.toolbar}>
            <View style={styles.toolsContainer}>
                {tools.map((tool) => (
                    <TouchableOpacity
                        key={tool.id}
                        style={[
                            styles.toolButton,
                            activeTool === tool.id && styles.activeToolButton,
                        ]}
                        onPress={() => handleToolPress(tool)}
                        disabled={tool.id === 'export' && isExporting}
                    >
                        <Ionicons
                            name={tool.id === 'export' && isExporting ? 'hourglass-outline' : tool.icon}
                            size={24}
                            color={activeTool === tool.id ? colors.primary : colors.textSecondary}
                        />
                        <Text
                            variant="caption"
                            color={activeTool === tool.id ? colors.primary : colors.textSecondary}
                            style={styles.toolLabel}
                        >
                            {tool.id === 'export' && isExporting ? 'Saving...' : tool.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = {
    toolbar: {
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingVertical: 8,
    },
    toolsContainer: {
        flexDirection: 'row' as const,
        justifyContent: 'space-around' as const,
        alignItems: 'center' as const,
    },
    toolButton: {
        alignItems: 'center' as const,
        justifyContent: 'center' as const,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        minWidth: 80,
    },
    activeToolButton: {
        backgroundColor: `${colors.primary}20`,
    },
    toolLabel: {
        marginTop: 4,
        fontSize: 12,
    },
}; 