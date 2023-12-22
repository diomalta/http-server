import { jest } from '@jest/globals';
import request from 'supertest';

import { Server } from 'node:http';
import type { App } from 'supertest/types.js';

import Application from '../../src/main.js';

describe('Application', () => {
  let server: App;
  let app: Application;

  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});

    app = new Application({ debug: true });
    app.get('/', (_request, response) => {
      response
        .status(200)
        .header({
          'content-type': 'application/json',
        })
        .send({ message: 'Hello World' });
    });

    app.get('/not-found', (_request, response) => {
      response.status(404).send({ message: 'Not Found' });
    });

    app.post('/users', (_request, response) => {
      response.status(201).send({ name: 'joe' });
    });

    app.put('/users', (_request, response) => {
      response.status(201).send({ name: 'john' });
    });

    app.patch('/users', (_request, response) => {
      response.status(200).send({ name: 'james' });
    });

    app.delete('/users', (_request, response) => {
      response.status(200).send({ message: 'user deleted' });
    });

    server = app.getServer() as unknown as App;
  });

  it('#GET / should be respond with status code 200 and content-type application/json', async () => {
    const response = await request(server).get('/').expect(200);

    expect(response.header['content-type']).toBe('application/json');
    expect(response.text).toBe(JSON.stringify({ message: 'Hello World' }));
  });

  it('#GET /not-found should be respond with status code 404', async () => {
    const response = await request(server).get('/not-found').expect(404);

    expect(response.text).toBe(JSON.stringify({ message: 'Not Found' }));
  });

  it('#POST / should be respond with status code 201', async () => {
    const payload = { name: 'joe' };
    const response = await request(server)
      .post('/users')
      .send(payload)
      .expect(201);

    expect(response.text).toBe(JSON.stringify(payload));
  });

  it('#PUT / should be respond with status code 201', async () => {
    const payload = { name: 'john' };
    const response = await request(server)
      .put('/users')
      .send(payload)
      .expect(201);

    expect(response.text).toBe(JSON.stringify(payload));
  });

  it('#PATCH / should be respond with status code 200', async () => {
    const payload = { name: 'james' };
    const response = await request(server)
      .patch('/users')
      .send(payload)
      .expect(200);

    expect(response.text).toBe(JSON.stringify(payload));
  });

  it('#DELETE / should be respond with status code 200', async () => {
    const payload = { name: 'james' };
    const response = await request(server)
      .delete('/users')
      .send(payload)
      .expect(200);

    expect(response.text).toBe(JSON.stringify({ message: 'user deleted' }));
  });

  it('Should be return server instance', () => {
    expect(app.getServer()).toBeInstanceOf(Server);
  });

  it('should call server listen', () => {
    const serverSpy = jest
      .spyOn(app.getServer(), 'listen')
      .mockImplementation(() => {
        return {} as unknown as Server;
      });

    app.listen({ port: 3000, message: 'Server listening on port 3000' });

    expect(serverSpy).toHaveBeenCalled();
    expect(serverSpy).toHaveBeenCalledWith(3000, expect.any(Function));
  });

  it('Should be close server', () => {
    const spy = jest.spyOn(app, 'close');
    app.close();
    expect(spy).toHaveBeenCalled();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
