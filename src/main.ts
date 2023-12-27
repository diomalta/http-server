import http from 'node:http';
import cluster from 'node:cluster';
import os from 'node:os';
import process from 'node:process';

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

  constructor(readonly config: IServer.IApplicationConfig) {
    this.#config = config;
    this.#routerService = new RouteService(config);
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

  public get(
    path: string,
    callback: IRequestListener,
    options?: IServer.IRouteOptions,
  ) {
    this.#routerService.setRoute('GET', path, callback, options);
  }

  public post(
    path: string,
    callback: IRequestListener,
    options?: IServer.IRouteOptions,
  ) {
    this.#routerService.setRoute('POST', path, callback, options);
  }

  public put(
    path: string,
    callback: IRequestListener,
    options?: IServer.IRouteOptions,
  ) {
    this.#routerService.setRoute('PUT', path, callback, options);
  }

  public delete(
    path: string,
    callback: IRequestListener,
    options?: IServer.IRouteOptions,
  ) {
    this.#routerService.setRoute('DELETE', path, callback, options);
  }

  public patch(
    path: string,
    callback: IRequestListener,
    options?: IServer.IRouteOptions,
  ) {
    this.#routerService.setRoute('PATCH', path, callback, options);
  }

  #clusterMode({ port, message }: IServer.IHttpServerInput) {
    const numCPUs = os.availableParallelism();

    if (cluster.isPrimary) {
      console.log(`Primary ${process.pid} is running`);

      // Fork workers.
      for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
      }
      cluster.on('exit', (worker) => {
        console.log(`worker ${worker.process.pid} died`);
      });
    } else {
      this.#server.listen(port, () => {
        console.info(message ?? `Server listening on port ${port}`);
      });

      console.log(`Worker ${process.pid} started`);
    }
  }

  public listen({ port, message }: IServer.IHttpServerInput) {
    if (this.#config.clusterMode) {
      this.#clusterMode({ port, message });
    } else {
      this.#server.listen(port, () => {
        console.info(message ?? `Server listening on port ${port}`);
      });
    }
  }

  public getServer() {
    return this.#server;
  }

  public async close() {
    this.#server.close();
  }
}
