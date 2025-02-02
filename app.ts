import http from 'http';
import actualPrometheusExporter from './src/container';

const server = http.createServer((req, res) => {
  if (req.url === '/metrics') {
    (async () => {
      const metrics = await actualPrometheusExporter.getMetrics();
      res.writeHead(200, { 'Content-Type': metrics.contentType });
      res.end(metrics.metrics);
    })().catch((err) => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      console.error(err);
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

const PORT = process.env.PORT ?? 3001;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
