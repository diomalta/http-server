import http from 'node:http';

export class HandlerResponseService extends http.ServerResponse {
  constructor(
    private readonly request: http.IncomingMessage,
    private readonly response: http.ServerResponse,
  ) {
    super(request);
  }

  public status(code: number) {
    this.response.statusCode = code;
    return this;
  }

  public header(header: Record<string, string | number | readonly string[]>) {
    for (const [key, value] of Object.entries(header)) {
      this.response.setHeader(key, value);
    }

    return this;
  }

  public send(body: unknown) {
    this.response.write(JSON.stringify(body));
    this.response.end();
  }
}
