import { IRequestListener } from './response.interface.js';

export interface IHttpServerInput {
  port: number;
  message?: string;
}

export interface IApplicationConfig {
  debug: boolean;
}

export interface IRoute {
  path: string;
  method: string;
  callback: IRequestListener;
}
