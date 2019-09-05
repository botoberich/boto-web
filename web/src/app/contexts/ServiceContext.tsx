import React from 'react';
import { IServiceContextValue } from '../interfaces/contexts.interface';

const ServiceContext = React.createContext(null);

const CLIENT = 'client';
const SERVER = 'server';

function useServiceContext(): IServiceContextValue {
    const context = React.useContext(ServiceContext);
    if (!context) {
        throw new Error(`useServiceContext must be used within a ServiceProvider`);
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

export { ServiceProvider, useServiceContext };
export default ServiceContext;
