import React from 'react';
import { OverlayProvider } from './contexts/OverlayContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import App from './app';

function AppProvider() {
    return (
        <ThemeProvider>
            <ProgressProvider>
                <OverlayProvider>
                    <App />
                </OverlayProvider>
            </ProgressProvider>
        </ThemeProvider>
    );
}

export default AppProvider;
