import http from 'node:http';

import { HandlerResponseService } from './service/HandlerResponseService.js';
import { RouteService } from './service/RouterService.js';
import { MiddlewareService } from './service/MiddlewareService.js';

import * as IServer from './interfaces/server.interface.js';
import {
  IMiddleware,
  IRequestListener,
} from './interfaces/response.interface.js';

export default class Application {
  #config: IServer.IApplicationConfig;
  #middlewareService: MiddlewareService;
  #routerService: RouteService;
  #server: http.Server = {} as http.Server;

  constructor(config: IServer.IApplicationConfig) {
    this.#config = config;
    this.#routerService = new RouteService();
    this.#middlewareService = new MiddlewareService();

    this.#server = new http.Server(async (request, response) => {
      const customResponse = new HandlerResponseService(request, response);
      await this.#middlewareService.handleRequest(request, customResponse);
      await this.#routerService.handler(request, customResponse);
    });
  }

  public use(middleware: IMiddleware) {
    this.#middlewareService.use(middleware);
  }

  public get(path: string, callback: IRequestListener) {
    this.#routerService.setRoute('GET', path, callback);
  }

  public post(path: string, callback: IRequestListener) {
    this.#routerService.setRoute('POST', path, callback);
  }

  public put(path: string, callback: IRequestListener) {
    this.#routerService.setRoute('PUT', path, callback);
  }

  public delete(path: string, callback: IRequestListener) {
    this.#routerService.setRoute('DELETE', path, callback);
  }

  public patch(path: string, callback: IRequestListener) {
    this.#routerService.setRoute('PATCH', path, callback);
  }

  public listen({ port, message }: IServer.IHttpServerInput) {
    this.#server.listen(port, () => {
      console.info(message ?? `Server listening on port ${port}`);
    });
  }

  public getServer() {
    return this.#server;
  }

  public async close() {
    this.#server.close();
  }
}
