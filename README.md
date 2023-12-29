# HTTP Server 🖥️

This is a wrapper do node http server, it's a simple way to create a server.

## Installation

```bash
npm install @diomalta/http-server
```

## How to use

```javascript
// Import the Application from the package
import Application from '@diomalta/http-server';

// Create a new Application instance
const app = new Application({
  bodyParsers: 'json',
  clusterMode: true,
});

// Define a GET route
app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

// Define a users GET route
app.get('/users/:id', (req, res) => {
  res.status(200).send({ name: 'joe' });
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

## Mode

Node.js is a single-threaded platform, which means that by default, it uses only one CPU core. However, most modern systems have multiple cores. To make the most of these systems, Node.js provides a module called 'cluster' that allows the creation of child processes to handle the workload, each running on its own thread and using its own core.

### Advantages of Cluster Mode

- **Better CPU Utilization**: Cluster mode allows Node.js to utilize all available cores on the machine, leading to improved performance and responsiveness, especially for CPU-intensive applications.
- **Enhanced Performance under Heavy Load**: As demonstrated by load tests conducted with K6, cluster mode was able to handle a significantly higher number of requests per second compared to single mode. Additionally, the average response time was significantly lower in cluster mode.
- **Improved Reliability**: In cluster mode, if one of the worker processes crashes, the master process will automatically restart it. This ensures that the application is always available and reduces the risk of downtime.

### Unique Mode

```bash
checks.........................: 98.89% ✓ 4397      ✗ 49
data_received..................: 730 kB 13 kB/s
data_sent......................: 353 kB 6.3 kB/s
http_req_blocked...............: avg=381.95ms min=0s      med=5.9µs    max=15.63s   p(90)=157.72ms p(95)=1.07s
http_req_connecting............: avg=380.11ms min=0s      med=0s       max=15.63s   p(90)=156.87ms p(95)=1.07s
http_req_duration..............: avg=6.44s    min=0s      med=465.79ms max=53.68s   p(90)=31.75s   p(95)=32.87s
  { expected_response:true }...: avg=6.46s    min=13.14ms med=466.04ms max=53.68s   p(90)=31.82s   p(95)=32.88s
http_req_failed................: 1.10%  ✓ 49        ✗ 4397
http_req_receiving.............: avg=110.48µs min=0s      med=91.09µs  max=4.33ms   p(90)=184.25µs p(95)=230.73µs
http_req_sending...............: avg=1.53ms   min=0s      med=20.89µs  max=152.81ms p(90)=686.26µs p(95)=1.76ms
http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s       p(90)=0s       p(95)=0s
http_req_waiting...............: avg=6.44s    min=0s      med=465.55ms max=53.68s   p(90)=31.75s   p(95)=32.87s
http_reqs......................: 4446   79.606642/s
iteration_duration.............: avg=8.02s    min=1.01s   med=1.46s    max=55.83s   p(90)=33.97s   p(95)=35.79s
iterations.....................: 4446   79.606642/s
vus............................: 110    min=110     max=1000
vus_max........................: 1000   min=1000    max=1000
```

### Cluster Mode

```bash
checks.........................: 100.00% ✓ 14435      ✗ 0
data_received..................: 2.4 MB  74 kB/s
data_sent......................: 1.2 MB  35 kB/s
http_req_blocked...............: avg=4.31ms   min=1.02µs  med=6.77µs   max=168.74ms p(90)=11.18µs  p(95)=8.78ms
http_req_connecting............: avg=4.26ms   min=0s      med=0s       max=168.68ms p(90)=0s       p(95)=7.64ms
http_req_duration..............: avg=1.15s    min=14.77ms med=998.51ms max=4.53s    p(90)=2.53s    p(95)=2.88s
  { expected_response:true }...: avg=1.15s    min=14.77ms med=998.51ms max=4.53s    p(90)=2.53s    p(95)=2.88s
http_req_failed................: 0.00%   ✓ 0          ✗ 14435
http_req_receiving.............: avg=115.63µs min=12.07µs med=79.03µs  max=42.17ms  p(90)=160.91µs p(95)=264.19µs
http_req_sending...............: avg=177.16µs min=3.35µs  med=23.39µs  max=154.04ms p(90)=72.7µs   p(95)=466.34µs
http_req_tls_handshaking.......: avg=0s       min=0s      med=0s       max=0s       p(90)=0s       p(95)=0s
http_req_waiting...............: avg=1.15s    min=14.68ms med=998.33ms max=4.53s    p(90)=2.53s    p(95)=2.88s
http_reqs......................: 14435   442.872259/s
iteration_duration.............: avg=2.15s    min=1.01s   med=1.99s    max=5.53s    p(90)=3.53s    p(95)=3.88s
iterations.....................: 14435   442.872259/s
vus............................: 216     min=216      max=1000
vus_max........................: 1000    min=1000     max=1000
```

### Test Results

Load tests conducted with K6 clearly demonstrate the advantages of cluster mode. In single mode, the server was able to handle around 80 requests per second, with an average response time of 6.44 seconds. However, in cluster mode, the server was able to handle over 440 requests per second, with an average response time of only 1.15 seconds. Furthermore, in cluster mode, all requests were successful, while in single mode, approximately 1.10% of requests failed.

In summary, cluster mode can offer significantly better performance and greater fault resilience compared to single mode, especially in systems with multiple CPU cores. **The tests were performed with intensive CPU usage, utilizing a Fibonacci(30) function for both modes**.

## Roadmap

Here are the upcoming features that we're planning to add:

- [x] Support for route parameters
- [x] Support for middleware functions
- [x] Support for body parser json and text
- [x] Support for streaming
- [x] Support for parallel processing and reliability

Stay tuned for these exciting updates!

## License

This project is licensed under the MIT License - see the [LICENSE](MIT-LICENSE.txt) file for details.
