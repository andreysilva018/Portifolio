import { renderToString } from 'react-dom/server';
import { App } from './app/App';
export { routeMetadata, publicPaths, renderedPaths, siteUrl } from './content/routes';

export function render(path: string) { return renderToString(<App path={path} />); }
