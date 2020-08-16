import path from 'path';
import fs from 'fs';
import fastify from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyReverseRoutes from 'fastify-reverse-routes';
import fastifyFormbody from 'fastify-formbody';
import fastifyMethodOverride from 'fastify-method-override';
import { reactRenderPlugin, objectionPlugin, urlForPlugin } from '../lib/utils';
import routes from '../routes';
import models from '../models';

const mode = process.env.NODE_ENV || 'development';
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
    urlFor: null,
  });
  app.decorate('objection', null);
  app.decorateReply('render', null);
  app.decorateRequest('data', null);
  app.decorateRequest('errors', null);
  app.decorateRequest('entityWithErr', null);

  app.register(fastifyReverseRoutes.plugin);
  app.register(urlForPlugin);
  app.register(fastifyStatic, { root: pathPublic });
  app.register(fastifyFormbody);
  app.register(fastifyMethodOverride);
  app.register(objectionPlugin, { mode, models });
  app.register(reactRenderPlugin);
  app.register(routes);

  return app;
};
