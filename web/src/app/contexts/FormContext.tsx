import React from 'react';
import { IFormContextValue } from '../interfaces/contexts.interface';

const FormContext = React.createContext(null);

function useFormContext(): IFormContextValue {
    const context: IFormContextValue = React.useContext(FormContext);
    if (!context) {
        throw new Error(`useFormContext must be used within a FormProvider`);
    }
    return context;
}

function FormProvider(props) {
    const [albumForm, setAlbumForm] = React.useState({ title: '', description: '' });

    const value = {
        albumForm,
        setAlbumForm,
    };
    return <FormContext.Provider value={value} {...props} />;
}

export { FormProvider, useFormContext };
export default FormContext;
