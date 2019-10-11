import React from 'react';
import { OverlayProvider } from './contexts/OverlayContext';
import { SelectionProvider } from './contexts/SelectionContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { ServiceProvider } from './contexts/ServiceContext';
import { FormProvider } from './contexts/FormContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Provider as ReduxProvider } from 'react-redux';
import store from './redux/root.store';
import App from './app';
import { HeaderProvider } from './contexts/HeaderContext';

function AppProvider() {
    return (
        <ReduxProvider store={store}>
            <ThemeProvider>
                <ServiceProvider>
                    <ProgressProvider>
                        <OverlayProvider>
                            <HeaderProvider>
                                <FormProvider>
                                    <SelectionProvider>
                                        <App />
                                    </SelectionProvider>
                                </FormProvider>
                            </HeaderProvider>
                        </OverlayProvider>
                    </ProgressProvider>
                </ServiceProvider>
            </ThemeProvider>
        </ReduxProvider>
    );
}

export default AppProvider;
