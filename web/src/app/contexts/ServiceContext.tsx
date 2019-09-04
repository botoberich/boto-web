import React from 'react';

const ServiceContext = React.createContext(null);

const CLIENT = 'client';
const SERVER = 'server';

function useService() {
    const context = React.useContext(ServiceContext);
    if (!context) {
        throw new Error(`useService must be used within a ServiceProvider`);
    }
    return context;
}

function ServiceProvider(props) {
    const [service, setService] = React.useState(CLIENT);

    const setServer = React.useCallback(() => setService(SERVER), []);
    const setClient = React.useCallback(() => setServer(CLIENT), []);

    const value = React.useMemo(() => ({ service, setServer, setClient }), [service]);

    return <ServiceContext.Provider value={value} {...props}></ServiceContext.Provider>;
}

export { ServiceProvider, useService };
export default ServiceContext;
