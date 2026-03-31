import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from '../components/App.js';
import { REPL } from '../screens/REPL.js';
import { AppStateProvider } from '../state/AppState.js';
import { ThemeProvider } from '../components/design-system/ThemeProvider.js';

// Mocking some globals that might be expected by the app
(window as any).process = {
    env: {
        NODE_ENV: 'development',
        USER_TYPE: 'external'
    },
    platform: 'browser',
    version: 'v18.0.0',
    exit: (code?: number) => console.log('Process exit called with code:', code),
};

const WebApp = () => {
    // These props would normally come from the CLI launcher
    const appProps = {
        getFpsMetrics: () => undefined,
        initialState: {} as any, // This would be synced via WebSocket in a full impl
    };

    const replProps = {
        commands: [],
        initialTools: [],
        initialMessages: [],
        mcpClients: [],
        autoConnectIdeFlag: false,
        mainThreadAgentDefinition: undefined,
        disableSlashCommands: false,
    };

    return (
        <AppStateProvider>
            <ThemeProvider>
                <App {...appProps}>
                    <REPL {...replProps} />
                </App>
            </ThemeProvider>
        </AppStateProvider>
    );
};

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<WebApp />);
}
