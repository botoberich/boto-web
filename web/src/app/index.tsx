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

function AppProvider() {
    return (
        <ReduxProvider store={store}>
            <ThemeProvider>
                <ServiceProvider>
                    <ProgressProvider>
                        <OverlayProvider>
                            <FormProvider>
                                <SelectionProvider>
                                    {/** not ideal since photo states will bleed through all screen components under app 
                     But needed since the header needs to be aware of photo states | Possibly refactor later */}
                                    <App />
                                </SelectionProvider>
                            </FormProvider>
                        </OverlayProvider>
                    </ProgressProvider>
                </ServiceProvider>
            </ThemeProvider>
        </ReduxProvider>
    );
}

export default AppProvider;
