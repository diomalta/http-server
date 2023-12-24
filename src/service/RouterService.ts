import { performance } from 'perf_hooks';

import {
  IApplicationConfig,
  IRoute,
  IRouteOptions,
} from '../interfaces/server.interface.js';
import { IRequestListener } from '../interfaces/response.interface.js';
import { HandlerResponseService } from './HandlerResponseService.js';
import { IRequest } from '../interfaces/request.interface.js';
import { BodyParserService } from './BodyParserService.js';

export class RouteService {
  #routes: Map<string, IRoute> = new Map();
  #bodyParser: BodyParserService;
  #config: IApplicationConfig;

  constructor(config: IApplicationConfig) {
    this.#config = config;
    this.#bodyParser = new BodyParserService();
  }

  setRoute(
    method: string,
    path: string,
    callback: IRequestListener,
    options?: IRouteOptions,
  ) {
    const routeKey = `${method}:${path}`;
    if (!this.#routes.has(routeKey)) {
      this.#routes.set(routeKey, {
        method,
        path,
        callback,
        options,
      });
    } else {
      throw new Error(`Route ${routeKey} already exists`);
    }
  }

  async handler(request: IRequest, response: HandlerResponseService) {
    const { url, method } = request;

    if (!url || !method) {
      throw new Error('URL or method not defined in request');
    }

    const route = this.#routes.get(`${method}:${url}`);

    if (route) {
      try {
        if (!route.options?.stream) {
          await this.#bodyParser.parser(request, this.#config.bodyParser);
        }

        const start = performance.now();
        const result = await route.callback(request, response);
        const end = performance.now();

        console.info(
          `${new Date().toUTCString()} - ${route.method} ${route.path} ${(
            end - start
          ).toFixed(3)} ms.`,
        );

        return result;
      } catch (err) {
        response.status(500).send({ message: 'Internal Server Error' });
      }
    } else {
      response.status(404).send({ message: 'Not found' });
    }
  }
}
