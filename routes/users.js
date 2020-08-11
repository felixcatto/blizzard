export default app => {
  app.get('/users', { name: 'users' }, (request, reply) => {
    reply.render('users/index');
  });
};
