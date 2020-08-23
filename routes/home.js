export default async app => {
  app.get('/', { name: 'home' }, (request, reply) => {
    reply.render('common/index');
  });
};
