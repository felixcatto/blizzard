export default app => {
  app.get('/', { name: 'home' }, (request, reply) => {
    reply.render('common/index');
  });
};
