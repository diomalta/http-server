# HTTP Server 🖥️

This is a wrapper do node http server, it's a simple way to create a server.

## How to use

```javascript
import Application from '@diomalta/http-server';

const app = new Application();

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.listen(3000);
```

## API

- `app.get(path, callback)`
- `app.post(path, callback)`
- `app.put(path, callback)`
- `app.delete(path, callback)`
- `app.patch(path, callback)`

## TODO

- [ ] Add tests
- [ ] Support for params
- [ ] Support for middlewares
- [ ] Support for https
- [ ] Support for static files
