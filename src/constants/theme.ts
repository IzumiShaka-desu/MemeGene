import { Platform } from 'react-native';
import { ThemeColors, ThemeSpacing, ThemeTypography } from '../types';

export const colors: ThemeColors = {
    primary: '#6366F1', // Indigo
    secondary: '#8B5CF6', // Violet
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#1E293B',
    textSecondary: '#64748B',
    border: '#E2E8F0',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
};

export const spacing: ThemeSpacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const typography: ThemeTypography = {
    h1: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    h2: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    h3: {
        fontSize: 20,
        fontWeight: '600',
    },
    body: {
        fontSize: 16,
        fontWeight: 'normal',
    },
    caption: {
        fontSize: 14,
        fontWeight: 'normal',
    },
};

export const borderRadius = {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
};

export const shadows = {
    small: Platform.select({
        web: {
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
        },
        default: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
        },
    }),
    medium: Platform.select({
        web: {
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.15)',
        },
        default: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 4,
        },
    }),
    large: Platform.select({
        web: {
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        },
        default: {
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 4,
            },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 8,
        },
    }),
}; 