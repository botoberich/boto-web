import React, { useState, useCallback } from 'react';

const ThemeContext = React.createContext();

const DARK = 'dark';
const LIGHT = 'light';

function useTheme() {
    const context = React.useContext(ThemeContext);
    if (!context) {
        throw new Error(`useTheme must be used within a ThemeProvider`);
    }
    return context;
}

function ThemeProvider(props) {
    const [theme, setTheme] = useState(LIGHT);

    const toggleTheme = useCallback(() => {
        if (theme === LIGHT) {
            setTheme(DARK);
        } else {
            setTheme(LIGHT);
        }
    }, [theme]);

    const value = React.useMemo(() => ({ theme, toggleTheme }), [theme]);

    return <ThemeContext.Provider value={value} {...props}></ThemeContext.Provider>;
}

export { ThemeProvider, useTheme };
export default ThemeContext;
