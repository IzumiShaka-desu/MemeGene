export const FONT_FAMILIES = [
    { name: 'System', value: undefined },
    { name: 'Inter', value: 'Inter_400Regular' },           // Modern alternative to Helvetica
    { name: 'Roboto', value: 'Roboto_400Regular' },         // Android's default, great alternative to Arial
    { name: 'Open Sans', value: 'OpenSans_400Regular' },    // Clean alternative to Verdana
    { name: 'Playfair', value: 'PlayfairDisplay_400Regular' }, // Elegant alternative to Times/Georgia
    { name: 'Source Sans', value: 'SourceSansPro_400Regular' }, // Professional alternative
    { name: 'Anton', value: 'Anton' },
    { name: 'Bebas Neue', value: 'BebasNeue' },
    { name: 'Fredoka One', value: 'FredokaOne' },
    { name: 'Oswald', value: 'Oswald' },
    { name: 'Righteous', value: 'Righteous' },
    { name: 'Monospace', value: 'monospace' },
    { name: 'Serif', value: 'serif' },
    { name: 'Sans-Serif', value: 'sans-serif' },
];

export const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 42, 48, 56, 64, 72, 84, 96];

export const TEXT_COLORS = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
    '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000',
];

export const BACKGROUND_COLORS = [
    'transparent', '#000000', '#FFFFFF', '#FF0000', '#00FF00',
    '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500',
    '#800080', '#FFC0CB', '#A52A2A', '#808080', '#000080',
];

export const DEFAULT_TEXT_STYLE = {
    fontSize: 24,
    fontFamily: undefined,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
    textDecoration: 'none' as const,
    textTransform: 'uppercase' as const,
};
