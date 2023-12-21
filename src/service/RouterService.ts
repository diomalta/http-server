import type { IncomingMessage } from 'node:http';

import { IServer } from '../interfaces';
import { IRequestListener } from '../interfaces/response.interface';
import { HandlerResponseService } from './HandlerResponseService';

export class RouteService {
  #routes: Map<string, IServer.IRoute> = new Map();

  setRoute(method: string, path: string, callback: IRequestListener) {
    if (!this.#routes.has(path)) {
      this.#routes.set(`${method}:${path}`, { method: 'get', path, callback });
    }
  }

  async handler(req: IncomingMessage, res: HandlerResponseService) {
    const { url, method } = req;

    if (!url || !method) {
      return;
    }

    const route = this.#routes.get(`${method}:${url}`);

    if (route) {
      const start = performance.now();
      const result = await route.callback(req, res);
      const end = performance.now();

      console.info(
        `${new Date().toUTCString()} - ${route.method.toUpperCase()} ${
          route.path
        } ${(end - start).toFixed(3)} ms.`,
      );

      return result;
    }

    res.status(404).send({ message: 'Not found' });
  }
}
