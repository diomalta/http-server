import { IRoute } from '../../src/interfaces/server.interface';
import { RouteService } from '../../src/service/RouterService';

describe('RouteService', () => {
  let routeService: RouteService;

  beforeEach(() => {
    routeService = new RouteService({});

    routeService.setRoute('GET', '/users', () => {});
    routeService.setRoute('GET', '/users/:id', () => {});
  });

  it('should return exact match if it exists', () => {
    const route = routeService.getRoute('GET', '/users') as IRoute;
    expect(route).toBeDefined();
    expect(route.params).toBeUndefined();
  });

  it('should return route with parameters if exact match does not exist', () => {
    const route = routeService.getRoute('GET', '/users/1') as IRoute;
    expect(route).toBeDefined();
    expect(route.params).toBeDefined();
    expect(route.params?.id).toEqual('1');
  });

  it('should return null if no matching route is found', () => {
    const route = routeService.getRoute('GET', '/nonexistent');
    expect(route).toBeNull();
  });
});
