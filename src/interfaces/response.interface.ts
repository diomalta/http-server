import http from 'node:http';

import type { HandlerResponseService } from '../service/HandlerResponseService.js';

export type IRequestListener = (
  req: http.IncomingMessage,
  res: HandlerResponseService,
) => void;
