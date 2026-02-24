import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr';
import * as express from 'express';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import AppServerModule from './src/main.server';

const mockStorage = {
  getItem: () => null,
  setItem: () => { },
  removeItem: () => { },
  clear: () => { }
};

const mockWindow = {
  navigator: { userAgent: 'ssr' },
  document: { body: {}, documentElement: {} },
  localStorage: mockStorage,
  sessionStorage: mockStorage,
  addEventListener: () => { },
  removeEventListener: () => { },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval
};

if (!(global as any).window) {
  (global as any).window = mockWindow;
}
if (!(global as any).document) {
  (global as any).document = mockWindow.document;
}
if (!(global as any).navigator) {
  (global as any).navigator = mockWindow.navigator;
}
if (!(global as any).localStorage) {
  (global as any).localStorage = mockStorage;
}
if (!(global as any).sessionStorage) {
  (global as any).sessionStorage = mockStorage;
}
if (!(global as any).Configuration) {
  (global as any).Configuration = { SERVER_API_URL: 'http://localhost/' };
}

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/stroyka/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // Example Express Rest API endpoints
  // server.get('/api/**', (req, res) => { });
  // Serve static files from /browser
  server.get('*.*', express.static(distFolder, {
    maxAge: '1y'
  }));

  // All regular routes use the Angular engine
  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;

    commonEngine
      .render({
        bootstrap: AppServerModule,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: distFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export default AppServerModule;
