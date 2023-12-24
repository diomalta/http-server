import http from 'node:http';

export type IRequest = http.IncomingMessage & {
  body?: string | Record<string, unknown>;
};
