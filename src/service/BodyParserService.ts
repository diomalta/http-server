import { IRequest } from '../interfaces/request.interface.js';
import { IApplicationConfig } from '../interfaces/server.interface.js';

export class BodyParserService {
  async #text(request: IRequest): Promise<string> {
    return await new Promise((resolve, reject) => {
      let rawData = '';
      request.on('data', (chunk) => {
        rawData += chunk.toString();
      });

      request.on('end', () => {
        resolve(rawData);
      });

      request.on('error', (err) => {
        reject(err);
      });
    });
  }

  async #json(request: IRequest): Promise<Record<string, unknown>> {
    const rawData = await this.#text(request);
    return JSON.parse(rawData);
  }

  #setBody(request: IRequest, body: string | Record<string, unknown>) {
    Reflect.defineProperty(request, 'body', {
      value: body,
    });
  }

  async parser(
    request: IRequest,
    bodyParser: IApplicationConfig['bodyParser'] = 'text',
  ) {
    switch (bodyParser) {
      case 'json':
        this.#setBody(request, await this.#json(request));
        break;
      case 'text':
        this.#setBody(request, await this.#text(request));
        break;
      default:
        break;
    }
  }
}
