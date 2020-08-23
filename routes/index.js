import fastifyFormbody from 'fastify-formbody';
import fastifyMethodOverride from 'fastify-method-override';
import { currentUserPlugin } from '../lib/utils';
import home from './home';
import session from './session';
import users from './users';
import articles from './articles';

const controllers = [home, users, articles, session];

export default async app => {
  app.register(fastifyFormbody);
  app.register(fastifyMethodOverride);
  app.register(currentUserPlugin);
  controllers.forEach(route => app.register(route));
};
