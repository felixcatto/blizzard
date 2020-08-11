import home from './home';
import users from './users';

const controllers = [home, users];

export default app => {
  controllers.forEach(fn => fn(app));
};
