import type { HandlerResponseService } from '../service/HandlerResponseService.js';
import { IRequest } from './request.interface.js';

export type IRequestListener = (
  req: IRequest,
  res: HandlerResponseService,
) => void;

export type IMiddleware = (
  req: IRequest,
  res: HandlerResponseService,
  next: () => Promise<void>,
) => Promise<void>;
