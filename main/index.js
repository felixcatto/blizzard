import path from 'path';
import fs from 'fs';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import fastifyFormbody from 'fastify-formbody';
import fastifyMethodOverride from 'fastify-method-override';
import { addRender } from '../lib/utils';
import addRoutes from '../routes';

// const mode = process.env.NODE_ENV || 'development';
// const isProduction = mode === 'production';
// const isDevelopment = mode === 'development';
const pathPublic = path.resolve(__dirname, '../public');

export default () => {
  const app = fastify({
    logger: {
      prettyPrint: true,
      level: 'error',
    },
  });
  app.decorate('ctx', {
    template: fs.readFileSync(path.resolve(__dirname, pathPublic, 'html/index.html'), 'utf8'),
    viewsDir: path.resolve(__dirname, '../views'),
    helpers: {},
    urlFor: null,
  });
  app.decorateReply('render', null);
  app.decorateRequest('data', null);
  app.decorateRequest('errors', null);

  app.register(fastifyReverseRoutes.plugin);
  app.register(fastifyStatic, { root: pathPublic });
  app.register(fastifyFormbody);
  app.register(fastifyMethodOverride);
  app.addHook('preHandler', addRender(app));

  addRoutes(app);
  return app;
};
