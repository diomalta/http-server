import { jest } from '@jest/globals';
import type { App } from 'supertest/types.js';
import request from 'supertest';

import Application from '../../src/main.js';

describe('Body Parser', () => {
  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  it('#POST should handle JSON body when bodyParser is set to json', async () => {
    const app = new Application({ bodyParser: 'json' });

    app.post('/users', (request, response) => {
      expect(request.body).toBeInstanceOf(Object);
      expect(request.body).toEqual({ name: 'John Doe' });
      return response.status(201).send({});
    });

    const server = app.getServer() as unknown as App;

    await request(server).post('/users').send({ name: 'John Doe' }).expect(201);
  });

  it('#POST should handle string body when bodyParser is not set', async () => {
    const app = new Application({});

    app.post('/users', (request, response) => {
      expect(typeof request.body).toEqual('string');
      expect(request.body).toEqual('{"name":"John Doe"}');
      return response.status(201).send({});
    });

    const server = app.getServer() as unknown as App;
    await request(server).post('/users').send({ name: 'John Doe' }).expect(201);
  });

  it('#POST should handle empty body when bodyParser is not set', async () => {
    const app = new Application({});

    app.post('/users', (request, response) => {
      expect(request.body).toEqual('');
      return response.status(201).send({});
    });

    const server = app.getServer() as unknown as App;
    await request(server).post('/users').expect(201);
  });

  it('#OST should handle empty JSON body when bodyParser is set to json', async () => {
    const app = new Application({ bodyParser: 'json' });

    app.post('/users', (request, response) => {
      expect(request.body).toEqual({});
      return response.status(201).send({});
    });

    const server = app.getServer() as unknown as App;
    await request(server).post('/users').expect(201);
  });
});
