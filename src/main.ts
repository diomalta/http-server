import http from 'node:http';

import { HandlerResponseService } from './service/HandlerResponseService.js';

import * as IServer from './interfaces/server.interface.js';
import { IRequestListener } from './interfaces/response.interface.js';
import { RouteService } from './service/RouterService.js';

export default class Application {
  #router: RouteService;
  #config: IServer.IApplicationConfig;
  #server: http.Server = {} as http.Server;

  constructor(config: IServer.IApplicationConfig) {
    this.#config = config;
    this.#router = new RouteService();

    this.#server = new http.Server(async (request, response) => {
      const customResponse = new HandlerResponseService(request, response);

      await this.#router.handler(request, customResponse);
    });
  }

  public get(path: string, callback: IRequestListener) {
    this.#router.setRoute('GET', path, callback);
  }

  public post(path: string, callback: IRequestListener) {
    this.#router.setRoute('POST', path, callback);
  }

  public put(path: string, callback: IRequestListener) {
    this.#router.setRoute('PUT', path, callback);
  }

  public delete(path: string, callback: IRequestListener) {
    this.#router.setRoute('DELETE', path, callback);
  }

  public patch(path: string, callback: IRequestListener) {
    this.#router.setRoute('PATCH', path, callback);
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
