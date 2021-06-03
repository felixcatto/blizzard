import { emptyObject, validate, checkSignedIn, cacheControlStates } from '../lib/utils';

export default async app => {
  const { urlFor } = app.ctx;
  const { Tag } = app.objection;

  app.get('/tags', { name: 'tags' }, async (request, reply) => {
    const tags = await Tag.query();
    reply.render('tags/Index', { tags });
  });

  app.get('/tags/new', { name: 'newTag', preHandler: checkSignedIn }, async (request, reply) => {
    reply.render('tags/New', { tag: emptyObject, turboCacheControl: cacheControlStates.noPreview });
  });

  app.get(
    '/tags/:id/edit',
    { name: 'editTag', preHandler: checkSignedIn },
    async (request, reply) => {
      const tag = await Tag.query().findById(request.params.id);
      reply.render('tags/Edit', { tag });
    }
  );

  app.post(
    '/tags',
    { preHandler: [checkSignedIn, validate(Tag.yupSchema)] },
    async (request, reply) => {
      if (request.errors) {
        return reply.code(422).render('tags/New', {
          tag: request.entityWithErrors,
        });
      }

      await Tag.query().insert(request.data);
      reply.redirect(urlFor('tags'));
    }
  );

  app.put(
    '/tags/:id',
    { name: 'tag', preHandler: [checkSignedIn, validate(Tag.yupSchema)] },
    async (request, reply) => {
      if (request.errors) {
        return reply.code(422).render('tags/Edit', {
          tag: request.entityWithErrors,
        });
      }

      await Tag.query().update(request.data).where('id', request.params.id);
      reply.redirect(urlFor('tags'));
    }
  );

  app.delete('/tags/:id', { preHandler: checkSignedIn }, async (request, reply) => {
    await Tag.query().deleteById(request.params.id);
    reply.redirect(urlFor('tags'));
  });
};
