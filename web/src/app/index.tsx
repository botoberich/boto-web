import React from 'react';
import { OverlayProvider } from './contexts/OverlayContext';
import { PhotoProvider } from './contexts/PhotoContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/root.store'
import App from './app';

function AppProvider() {
    return (
        <ReduxProvider store={store}>
            <ThemeProvider>
                <ServiceProvider>
                    <ProgressProvider>
                        <OverlayProvider>
                            <PhotoProvider>
                                {/** not ideal since photo states will bleed through all screen components under app 
                     But needed since the header needs to be aware of photo states | Possibly refactor later */}
                                <App />
                            </PhotoProvider>
                        </OverlayProvider>
                    </ProgressProvider>
                </ServiceProvider>
            </ThemeProvider>
        </ReduxProvider>
    );
}

export default AppProvider;
