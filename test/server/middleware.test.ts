import { jest } from '@jest/globals';
import type { App } from 'supertest/types.js';
import request from 'supertest';

import Application from '../../src/main.js';

describe('Middleware', () => {
  let server: App;
  let app: Application;

  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});

    app = new Application({ debug: true });

    app.post('/users', (request, response) => {
      if (request.headers['x-token'] === '123456') {
        return response.status(201).send({ message: 'User created' });
      }

      response.status(400).send({ message: 'Bad request' });
    });

    app.use(async (request, response, next) => {
      if (request.headers['x-token'] !== '123456') {
        return response.status(401).send({ message: 'Unauthorized' });
      }

      await next();
    });

    server = app.getServer() as unknown as App;
  });

  it('#POST should be return status code 201 because passed middleware', async () => {
    const response = await request(server)
      .post('/users')
      .set('x-token', '123456')
      .expect(201);

    expect(response.text).toBe(JSON.stringify({ message: 'User created' }));
  });

  it('#POST should be return status code 401 because not passed middleware', async () => {
    const response = await request(server)
      .post('/users')
      .set('x-token', '654321')
      .expect(401);

    expect(response.text).toBe(JSON.stringify({ message: 'Unauthorized' }));
  });
});
