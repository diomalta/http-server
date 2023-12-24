# HTTP Server 🖥️

This is a wrapper do node http server, it's a simple way to create a server.

## How to use

```javascript
// Import the Application from the package
import Application from '@diomalta/http-server';

// Create a new Application instance
const app = new Application();

// Define a GET route
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Start the server on port 3000
app.listen({ port: 3000 });
```

## API

Here are the available methods you can use:

- `app.get`: Defines the GET route.
- `app.post`: Defines the POST route.
- `app.put`: Defines the PUT route.
- `app.delete`: Defines the DELETE route.
- `app.patch`: Defines the PATCH route.
- `app.use`: Use the middleware function.

## Roadmap

Here are the upcoming features that we're planning to add:

- [ ] Support for route parameters
- [x] Support for middleware functions
- [x] Support for body parser json and text
- [x] Support for streaming
- [ ] Support for HTTPS
- [ ] Support for serving static files

Stay tuned for these exciting updates!
