import { currentUserPlugin } from '../lib/utils';
import home from './home';
import users from './users';
import articles from './articles';
import session from './session';

const controllers = [home, users, articles, session];

export default async app => {
  app.register(currentUserPlugin);
  controllers.forEach(fn => fn(app));
};
