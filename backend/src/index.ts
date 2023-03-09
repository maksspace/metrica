import { startServer } from './server.js';
import { startCollection } from './datadog.js';

(async () => {
  await startServer();
  await startCollection();
})();
