import http from 'http';

import { IMiddleware } from '../interfaces/response.interface.js';
import { HandlerResponseService } from './HandlerResponseService.js';

export class MiddlewareService {
  #middlewares: Array<IMiddleware> = [];

  public use(middleware: IMiddleware) {
    this.#middlewares.push(middleware);
  }

  async handleRequest(req: http.IncomingMessage, res: HandlerResponseService) {
    const next = async (currentIndex: number) => {
      if (currentIndex >= this.#middlewares.length) {
        return;
      }

      const middleware = this.#middlewares[currentIndex];
      currentIndex++;

      if (middleware) {
        await middleware(req, res, () => next(currentIndex));
      }
    };

    await next(0);
  }
}
