import path from 'path';
import fs from 'fs';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import { renderMiddleware } from '../lib/utils';
import addRoutes from '../routes';

// const mode = process.env.NODE_ENV || 'development';
// const isProduction = mode === 'production';
// const isDevelopment = mode === 'development';
const pathPublic = path.resolve(__dirname, '../public');

const setUpStaticAssets = app => {
  app.register(fastifyStatic, { root: pathPublic });
};

export default () => {
  const app = fastify({
    logger: {
      prettyPrint: true,
      level: 'error',
    },
  });
  app.register(fastifyReverseRoutes.plugin);
  setUpStaticAssets(app);

  const template = fs.readFileSync(path.resolve(__dirname, pathPublic, 'html/index.html'), 'utf8');

  app.decorate('ctx', {
    template,
    viewsDir: path.resolve(__dirname, '../views'),
    helpers: {},
  });
  app.addHook('preHandler', renderMiddleware(app));

  addRoutes(app);
  return app;
};
