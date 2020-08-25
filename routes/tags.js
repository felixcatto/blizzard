import { emptyObject, validate } from '../lib/utils';

export default async app => {
  const { urlFor } = app.ctx;
  const { Tag } = app.objection;

  app.get('/tags', { name: 'tags' }, async (request, reply) => {
    const tags = await Tag.query();
    reply.render('tags/index', { tags });
  });

  app.get('/tags/new', { name: 'newTag' }, async (request, reply) => {
    reply.render('tags/new', { tag: emptyObject });
  });

  app.get('/tags/:id/edit', { name: 'editTag' }, async (request, reply) => {
    const tag = await Tag.query().findById(request.params.id);
    reply.render('tags/edit', { tag });
  });

  app.post('/tags', { preHandler: validate(Tag.yupSchema) }, async (request, reply) => {
    if (request.errors) {
      return reply.render('tags/new', {
        tag: request.entityWithErrors,
      });
    }

    await Tag.query().insert(request.data);
    reply.redirect(urlFor('tags'));
  });

  app.put(
    '/tags/:id',
    { name: 'tag', preHandler: validate(Tag.yupSchema) },
    async (request, reply) => {
      if (request.errors) {
        return reply.render('tags/edit', {
          tag: request.entityWithErrors,
        });
      }

      await Tag.query().update(request.data).where('id', request.params.id);
      reply.redirect(urlFor('tags'));
    }
  );

  app.delete('/tags/:id', async (request, reply) => {
    await Tag.query().deleteById(request.params.id);
    reply.redirect(urlFor('tags'));
  });
};
