import http from 'node:http';

import type { HandlerResponseService } from '../service/HandlerResponseService.js';

export type IRequestListener = (
  req: http.IncomingMessage,
  res: HandlerResponseService,
) => void;

export type IMiddleware = (
  req: http.IncomingMessage,
  res: HandlerResponseService,
  next: () => Promise<void>,
) => Promise<void>;
