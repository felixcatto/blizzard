import { uniqueId } from 'lodash';
import * as y from 'yup';
import { emptyObject, validate } from '../lib/utils';

const db = {
  articles: [
    {
      id: uniqueId(),
      title: 'Lead Article',
      text: 'it begins :)',
    },
    {
      id: uniqueId(),
      title: 'All went wrong',
      text: 'vasa eto boroda',
    },
    {
      id: uniqueId(),
      title: 'Spell',
      text: 'Molten boulder',
    },
  ],
};

export default app => {
  const articleSchema = y.object({
    id: y.string(),
    title: y.string().required('required'),
    text: y.string(),
  });

  app.get('/articles', { name: 'articles' }, (request, reply) => {
    reply.render('articles/index', { articles: db.articles });
  });

  app.get('/articles/new', { name: 'newArticle' }, (request, reply) => {
    reply.render('articles/new', { article: emptyObject });
  });

  app.get('/articles/:id', { name: 'article' }, (request, reply) => {
    const { id } = request.params;
    const article = db.articles.find(el => el.id === id);
    reply.render('articles/show', { article });
  });

  app.get('/articles/:id/edit', { name: 'editArticle' }, (request, reply) => {
    const { id } = request.params;
    const article = db.articles.find(el => el.id === id);
    reply.render('articles/edit', { article });
  });

  app.post('/articles', { preHandler: validate(articleSchema) }, (request, reply) => {
    if (request.errors) {
      return reply.render('articles/new', {
        article: request.entityWithErr,
      });
    }
    const { urlFor } = app.ctx;
    db.articles.push({ ...request.data, id: uniqueId() });
    reply.redirect(urlFor('articles'));
  });

  app.put('/articles/:id', { preHandler: validate(articleSchema) }, (request, reply) => {
    const { id } = request.params;
    if (request.errors) {
      return reply.render('articles/edit', {
        article: request.entityWithErr,
      });
    }

    const { urlFor } = app.ctx;
    const article = db.articles.find(el => el.id === id);
    article.title = request.data.title;
    article.text = request.data.text;
    reply.redirect(urlFor('articles'));
  });

  app.delete('/articles/:id', (request, reply) => {
    const { id } = request.params;
    db.articles = db.articles.filter(el => el.id !== id);
    const { urlFor } = app.ctx;
    reply.redirect(urlFor('articles'));
  });
};
