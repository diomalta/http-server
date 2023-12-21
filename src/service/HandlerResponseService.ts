import http from 'node:http';

export class HandlerResponseService extends http.ServerResponse {
  constructor(
    // @ts-expect-error - TODO
    private readonly request: http.IncomingMessage,
    private readonly response: http.ServerResponse,
  ) {
    super(request);
  }

  public status(code: number) {
    this.response.statusCode = code;
    return this;
  }

  public send(body: unknown) {
    this.response.end(JSON.stringify(body));
  }
}
