import React from 'react';
import { OverlayProvider } from './contexts/OverlayContext';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './app';

function AppProvider() {
    return (
        <ThemeProvider>
            <OverlayProvider>
                <App></App>
            </OverlayProvider>
        </ThemeProvider>
    );
}

export default AppProvider;
