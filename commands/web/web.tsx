import React, { useEffect, useState } from 'react';
import { Box, Text } from '../../ink.js';
import { exec } from 'child_process';
import { join } from 'path';

export default function WebCommand() {
    const [status, setStatus] = useState('Starting web server...');
    const [url, setUrl] = useState('');

    useEffect(() => {
        // This is a bit of a hack since we're inside a React component
        // In a real implementation, this would be handled more cleanly
        const serverPath = join(process.cwd(), 'server', 'webServer.ts');
        const proc = exec(`bun run ${serverPath}`);
        
        const port = 3000;
        const webUrl = `http://localhost:${port}`;
        setUrl(webUrl);
        setStatus(`Web server running at ${webUrl}`);
        
        // Open browser
        const openCmd = process.platform === 'darwin' ? 'open' : process.platform === 'win32' ? 'start' : 'xdg-open';
        exec(`${openCmd} ${webUrl}`);

        return () => {
            proc.kill();
        };
    }, []);

    return (
        <Box flexDirection="column" padding={1} borderStyle="round" borderColor="cyan">
            <Text bold color="cyan">Claude Code Web Interface</Text>
            <Box marginTop={1}>
                <Text>{status}</Text>
            </Box>
            {url && (
                <Box marginTop={1}>
                    <Text dim>Press Ctrl+C to stop the server and return to terminal.</Text>
                </Box>
            )}
        </Box>
    );
}
