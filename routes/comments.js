import { validate, isSignedIn, checkBelongsToUser } from '../lib/utils';

export default async app => {
  const { urlFor } = app.ctx;
  const { Article, Comment } = app.objection;

  const isCommentBelongsToUser = checkBelongsToUser(async request => {
    const comment = await Comment.query().findById(request.params.commentId);
    return comment.author_id;
  });

  app.get(
    '/comments/:commentId/edit',
    { name: 'editComment', preHandler: isCommentBelongsToUser },
    async (request, reply) => {
      const comment = await Comment.query().findById(request.params.commentId);
      reply.render('comments/Edit', { comment });
    }
  );

  app.post(
    '/comments',
    { name: 'comments', preHandler: validate(Comment.yupSchema) },
    async (request, reply) => {
      const articleId = request.params.id;
      if (request.errors) {
        const article = await Article.query()
          .findById(articleId)
          .withGraphFetched('[author, comments.author]');

        return reply.code(422).render('articles/Show', {
          article,
          newComment: { ...request.body, errors: request.errors },
        });
      }

      const { currentUser } = request;
      const comment = await Comment.query().insert(request.data);
      await comment.$relatedQuery('article').relate(articleId);
      if (isSignedIn(currentUser)) {
        await comment.$relatedQuery('author').relate(currentUser.id);
      }
      reply.redirect(urlFor('article', { id: articleId }));
    }
  );

  app.put(
    '/comments/:commentId',
    { name: 'comment', preHandler: [isCommentBelongsToUser, validate(Comment.yupSchema)] },
    async (request, reply) => {
      const articleId = request.params.id;
      const { commentId } = request.params;
      if (request.errors) {
        return reply.code(422).render('comments/Edit', {
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

  app.delete(
    '/comments/:commentId',
    { preHandler: isCommentBelongsToUser },
    async (request, reply) => {
      const articleId = request.params.id;
      await Comment.query().deleteById(request.params.commentId);
      reply.redirect(urlFor('article', { id: articleId }));
    }
  );
};
