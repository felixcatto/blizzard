import home from './home';
import users from './users';
import articles from './articles';

const controllers = [home, users, articles];

export default async app => {
  controllers.forEach(fn => fn(app));
};
