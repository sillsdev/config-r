import { createRoot } from 'react-dom/client';

import { PrototyperApp } from './PrototyperApp';

// No StrictMode here: ContentPane calls onChange during render, and double-invoked renders
// make the console useless for verifying this tool. src/main.tsx keeps its StrictMode.
const root = createRoot(document.getElementById('root')!);
root.render(<PrototyperApp />);
