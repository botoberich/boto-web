import React from 'react';
import { IHeaderContextValue } from '../interfaces/contexts.interface';

const HeaderContext = React.createContext(null);

function useHeaderContext(): IHeaderContextValue {
    const context: IHeaderContextValue = React.useContext(HeaderContext);
    if (!context) {
        throw new Error(`useHeaderContext must be used within a HeaderProvider`);
    }
    return context;
}

function HeaderProvider(props) {
    const [title, setTitle] = React.useState('');
    const [subTitle, setSubtitle] = React.useState('');

    const value = {
        title,
        setTitle,
        subTitle,
        setSubtitle,
    };
    return <HeaderContext.Provider value={value} {...props} />;
}

export { HeaderProvider, useHeaderContext };
export default HeaderContext;
