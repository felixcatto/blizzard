import comments from './comments';
import { emptyObject, validate } from '../lib/utils';

export default async app => {
  const { urlFor } = app.ctx;
  const { Article } = app.objection;

  app.get('/articles', { name: 'articles' }, async (request, reply) => {
    const articles = await Article.query().withGraphFetched('author');
    reply.render('articles/index', { articles });
  });

  app.get('/articles/new', { name: 'newArticle' }, async (request, reply) => {
    reply.render('articles/new', { article: emptyObject });
  });

  app.get('/articles/:id', { name: 'article' }, async (request, reply) => {
    const article = await Article.query()
      .findById(request.params.id)
      .withGraphFetched('[author, comments.author]');
    reply.render('articles/show', { article, newComment: emptyObject });
  });

  app.get('/articles/:id/edit', { name: 'editArticle' }, async (request, reply) => {
    const article = await Article.query().findById(request.params.id);
    reply.render('articles/edit', { article });
  });

  app.post('/articles', { preHandler: validate(Article.yupSchema) }, async (request, reply) => {
    if (request.errors) {
      return reply.render('articles/new', {
        article: request.entityWithErrors,
      });
    }

    const { currentUser, isSignIn } = request;
    const article = await Article.query().insert(request.data);
    if (isSignIn) {
      await article.$relatedQuery('author').relate(currentUser.id);
    }
    reply.redirect(urlFor('articles'));
  });

  app.put('/articles/:id', { preHandler: validate(Article.yupSchema) }, async (request, reply) => {
    if (request.errors) {
      return reply.render('articles/edit', {
        article: request.entityWithErrors,
      });
    }

    await Article.query().update(request.data).where('id', request.params.id);
    reply.redirect(urlFor('articles'));
  });

  app.delete('/articles/:id', async (request, reply) => {
    await Article.query().deleteById(request.params.id);
    reply.redirect(urlFor('articles'));
  });

  app.register(comments, { prefix: '/articles/:id' });
};
