import home from './home';
import users from './users';
import articles from './articles';

const controllers = [home, users, articles];

export default app => {
  controllers.forEach(fn => fn(app));
};
