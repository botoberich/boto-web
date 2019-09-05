import React from 'react';

interface ServiceContextValue {
    service: string;
    toggleService: () => void;
    setServer: () => void;
    setClient: () => void;
    isServer: boolean;
}

const ServiceContext = React.createContext(null);

const CLIENT = 'client';
const SERVER = 'server';

function useService(): ServiceContextValue {
    const context = React.useContext(ServiceContext);
    if (!context) {
        throw new Error(`useService must be used within a ServiceProvider`);
    }
    return context;
}

function ServiceProvider(props) {
    const [service, setService] = React.useState(CLIENT);

    const setServer = React.useCallback(() => setService(SERVER), []);
    const setClient = React.useCallback(() => setService(CLIENT), []);
    const toggleService = React.useCallback(() => {
        if (service === CLIENT) {
            setServer();
        } else {
            setClient();
        }
    }, [service]);

    const value = React.useMemo(
        () => ({ service, setServer, setClient, toggleService, isServer: service === SERVER }),
        [service]
    );

    return <ServiceContext.Provider value={value} {...props}></ServiceContext.Provider>;
}

export { ServiceProvider, useService };
export default ServiceContext;
