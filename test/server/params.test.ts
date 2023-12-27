import { jest } from '@jest/globals';
import type { App } from 'supertest/types.js';
import request from 'supertest';

import Application from '../../src/main.js';

describe('Body Parser', () => {
  let app;
  let server;

  beforeAll(() => {
    jest.spyOn(console, 'info').mockImplementation(() => {});
    app = new Application({ bodyParser: 'json' });

    app.get('/users/:id', (request, response) => {
      expect(request.params).toEqual({ id: '983180' });
      return response.status(200).send({});
    });

    app.get('/users/:id/transaction ', (request, response) => {
      expect(request.params).toEqual({ id: '983180' });
      return response.status(200).send({});
    });

    server = app.getServer() as unknown as App;
  });

  it('#GET should return route with parameters if exact match does not exist', async () => {
    await request(server).get('/users/983180').expect(200);
  });

  it('should return null if no matching route is found', async () => {
    await request(server).get('/users/983180/transaction/1').expect(404);
  });
});
