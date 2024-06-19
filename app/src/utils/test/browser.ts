import {setupWorker} from 'msw/browser';
import {handlers as profileHandlers} from './handlers/profile';

export const worker = setupWorker(...profileHandlers);

export const enableMocking = async () => {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }

  // `worker.start()` returns a Promise that resolves
  // once the Service Worker is up and ready to intercept requests.
  return worker.start({
    onUnhandledRequest(req, print) {
      // Ignore any requests from these URLs.
      const excludedRoutes = [
        '/api/auth/user',
        '/api/auth/session',
        '/api/auth/refresh',
      ];

      const isExcluded = excludedRoutes.some(route => req.url.includes(route));

      if (isExcluded || !req.url.includes('/api/')) {
        return;
      }

      // Otherwise, print an unhandled request warning.
      print.warning();
    },
  });
};
