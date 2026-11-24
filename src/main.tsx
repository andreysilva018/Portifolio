import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { App } from './app/App';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import './styles/index.css';

const container = document.getElementById('root');
if (!container) throw new Error('Application root was not found');
document.documentElement.classList.add('has-js');
const application = <StrictMode><App path={window.location.pathname} /></StrictMode>;
if (container.childElementCount > 0) hydrateRoot(container, application);
else createRoot(container).render(application);
