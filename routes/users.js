import { emptyObject, validate, userRoles, checkValueUnique } from '../lib/utils';

export default app => {
  const { User } = app.objection;
  const { urlFor } = app.ctx;

  app.get('/users', { name: 'users' }, async (request, reply) => {
    const users = await User.query();
    reply.render('users/index', { users });
  });

  app.get('/users/new', { name: 'newUser' }, async (request, reply) => {
    reply.render('users/new', { user: emptyObject, userRoles });
  });

  app.get('/users/:id/edit', { name: 'editUser' }, async (request, reply) => {
    const user = await User.query().findById(request.params.id);
    reply.render('users/edit', { user, userRoles });
  });

  app.post('/users', { preHandler: validate(User.yupSchema) }, async (request, reply) => {
    if (request.errors) {
      return reply.render('users/new', {
        user: request.entityWithErrors,
        userRoles,
      });
    }

    const { isUnique, errors } = await checkValueUnique(User, 'email', request.data.email);
    if (!isUnique) {
      return reply.render('users/new', {
        user: { ...request.data, ...errors },
        userRoles,
      });
    }

    await User.query().insert(request.data);
    reply.redirect(urlFor('users'));
  });

  app.put(
    '/users/:id',
    { name: 'user', preHandler: validate(User.yupSchema) },
    async (request, reply) => {
      const { id } = request.params;
      if (request.errors) {
        return reply.render('users/edit', {
          user: request.entityWithErrors,
          userRoles,
        });
      }

      const { isUnique, errors } = await checkValueUnique(User, 'email', request.data.email, id);
      if (!isUnique) {
        return reply.render('users/edit', {
          user: { ...request.data, ...errors },
          userRoles,
        });
      }

      await User.query().update(request.data).where('id', id);
      reply.redirect(urlFor('users'));
    }
  );

  app.delete('/users/:id', async (request, reply) => {
    await User.query().delete().where('id', request.params.id);
    reply.redirect(urlFor('users'));
  });
};
