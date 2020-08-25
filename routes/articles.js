import { isEmpty, difference } from 'lodash';
import comments from './comments';
import { emptyObject, validate } from '../lib/utils';

export default async app => {
  const { urlFor } = app.ctx;
  const { Article, Tag } = app.objection;

  app.get('/articles', { name: 'articles' }, async (request, reply) => {
    const articles = await Article.query().withGraphFetched('[author, tags]');
    reply.render('articles/index', { articles });
  });

  app.get('/articles/new', { name: 'newArticle' }, async (request, reply) => {
    const tags = await Tag.query();
    reply.render('articles/new', { article: emptyObject, tags });
  });

  app.get('/articles/:id', { name: 'article' }, async (request, reply) => {
    const article = await Article.query()
      .findById(request.params.id)
      .withGraphFetched('[author, comments.author, tags]');
    reply.render('articles/show', { article, newComment: emptyObject });
  });

  app.get('/articles/:id/edit', { name: 'editArticle' }, async (request, reply) => {
    const article = await Article.query().findById(request.params.id).withGraphFetched('tags');
    const tags = await Tag.query();
    reply.render('articles/edit', { article, tags });
  });

  app.post('/articles', { preHandler: validate(Article.yupSchema) }, async (request, reply) => {
    if (request.errors) {
      const tags = await Tag.query();
      return reply.render('articles/new', {
        article: request.entityWithErrors,
        tags,
      });
    }

    const { currentUser, isSignIn } = request;
    const { tagIds, ...articleData } = request.data;
    const article = await Article.query().insert(articleData);
    if (isSignIn) {
      await article.$relatedQuery('author').relate(currentUser.id);
    }
    if (!isEmpty(tagIds)) {
      await Promise.all(tagIds.map(tagId => article.$relatedQuery('tags').relate(tagId)));
    }
    reply.redirect(urlFor('articles'));
  });

  app.put('/articles/:id', { preHandler: validate(Article.yupSchema) }, async (request, reply) => {
    if (request.errors) {
      const tags = await Tag.query();
      return reply.render('articles/edit', {
        article: request.entityWithErrors,
        tags,
      });
    }

    const article = await Article.query()
      .updateAndFetchById(request.params.id, request.data)
      .withGraphFetched('tags');
    const tagIdsToDelete = difference(article.tagIds, request.data.tagIds);
    const tagIdsToInsert = difference(request.data.tagIds, article.tagIds);

    await article.$relatedQuery('tags').unrelate().where('id', 'in', tagIdsToDelete);
    await Promise.all(tagIdsToInsert.map(tagId => article.$relatedQuery('tags').relate(tagId)));

    reply.redirect(urlFor('articles'));
  });

  app.delete('/articles/:id', async (request, reply) => {
    await Article.query().deleteById(request.params.id);
    reply.redirect(urlFor('articles'));
  });

  app.register(comments, { prefix: '/articles/:id' });
};
