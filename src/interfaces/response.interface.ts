import http from 'node:http';

import type { HandlerResponseService } from '../service/HandlerResponseService';

export type IRequestListener = (
  req: http.IncomingMessage,
  res: HandlerResponseService,
) => void;
