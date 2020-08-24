import { validate } from '../lib/utils';

export default async app => {
  const { urlFor } = app.ctx;
  const { Article, Comment } = app.objection;

  app.get('/comments/:commentId/edit', { name: 'editComment' }, async (request, reply) => {
    const comment = await Comment.query().findById(request.params.commentId);
    reply.render('comments/edit', { comment });
  });

  app.post(
    '/comments',
    { name: 'comments', preHandler: validate(Comment.yupSchema) },
    async (request, reply) => {
      const articleId = request.params.id;
      if (request.errors) {
        const article = await Article.query()
          .findById(articleId)
          .withGraphFetched('[author, comments.author]');

        return reply.render('articles/show', {
          article,
          newComment: { ...request.body, errors: request.errors },
        });
      }

      const { currentUser, isSignIn } = request;
      const comment = await Comment.query().insert(request.data);
      await comment.$relatedQuery('article').relate(articleId);
      if (isSignIn) {
        await comment.$relatedQuery('author').relate(currentUser.id);
      }
      reply.redirect(urlFor('article', { id: articleId }));
    }
  );

  app.put(
    '/comments/:commentId',
    { name: 'comment', preHandler: validate(Comment.yupSchema) },
    async (request, reply) => {
      const articleId = request.params.id;
      const { commentId } = request.params;
      if (request.errors) {
        return reply.render('comments/edit', {
          comment: {
            ...request.body,
            errors: request.errors,
            id: commentId,
            article_id: articleId,
          },
        });
      }

      await Comment.query().update(request.data).where('id', commentId);
      reply.redirect(urlFor('article', { id: articleId }));
    }
  );

  app.delete('/comments/:commentId', async (request, reply) => {
    const articleId = request.params.id;
    await Comment.query().deleteById(request.params.commentId);
    reply.redirect(urlFor('article', { id: articleId }));
  });
};
