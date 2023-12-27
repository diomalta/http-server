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

  getRoute(method: string, path: string) {
    const route = this.#routes.get(`${method}:${path}`);
    if (route) {
      return route;
    }

    const [, ...pathParts] = path.split('/');
    const matchingRoutes = [];

    for (const route of this.#routes) {
      const [, ...routeParts] = route[0].split('/');

      if (routeParts.length !== pathParts.length) {
        continue;
      }

      if (
        routeParts.every((part, index) => {
          return part.startsWith(':') || part === pathParts[index];
        })
      ) {
        matchingRoutes.push(route[0]);
      }
    }

    if (matchingRoutes.length === 0) {
      return null;
    }

    const params: Record<string, unknown> = {};
    const [, ...routeParts] = matchingRoutes[0].split('/');

    routeParts.forEach((part, index) => {
      if (part.startsWith(':')) {
        const paramName = part.slice(1);
        params[paramName] = pathParts[index];
      }
    });

    return {
      ...this.#routes.get(matchingRoutes[0]),
      params,
    };
  }

  async handler(request: IRequest, response: HandlerResponseService) {
    const { url, method } = request;

    if (!url || !method) {
      throw new Error('URL or method not defined in request');
    }

    const route = this.getRoute(method, url);

    if (route) {
      try {
        if (!route.options?.stream) {
          await this.#bodyParser.parser(request, this.#config.bodyParser);
        }

        const start = performance.now();
        const result =
          route.callback && (await route.callback(request, response));

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
