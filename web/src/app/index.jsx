import React from 'react';
import { OverlayProvider } from './contexts/OverlayContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { PhotoProvider } from './contexts/PhotoContext';
import App from './app';

function AppProvider() {
    return (
        <ThemeProvider>
            <ProgressProvider>
                <OverlayProvider>
                    <PhotoProvider>
                        {/** not ideal since photo states will bleed through all screen components under app 
                     But needed since the header needs to be aware of photo states | Possibly refactor later */}
                        <App />
                    </PhotoProvider>
                </OverlayProvider>
            </ProgressProvider>
        </ThemeProvider>
    );
}

export default AppProvider;
