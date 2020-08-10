import path from 'path';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fs from 'fs';

// const mode = process.env.NODE_ENV || 'development';
// const isProduction = mode === 'production';
// const isDevelopment = mode === 'development';
const pathPublic = path.resolve(__dirname, '../public');

const setUpStaticAssets = app => {
  app.register(fastifyStatic, { root: pathPublic });
};

export default () => {
  // const app = fastify({ logger: { prettyPrint: true } });
  const app = fastify();
  setUpStaticAssets(app);

  const template = fs.readFileSync(path.resolve(__dirname, pathPublic, 'html/index.html'), 'utf8');

  app.get('/', (req, res) => {
    res.type('text/html');
    return template;
  });

  return app;
};
