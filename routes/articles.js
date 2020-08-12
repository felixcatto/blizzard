import { uniqueId } from 'lodash';
import { emptyObject } from '../lib/utils';

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
    reply.render('articles/edit', { article, type: 'edit' });
  });

  app.post('/articles', (request, reply) => {
    const { title, text } = request.body;
    const { urlFor } = app.ctx;
    db.articles.push({
      id: uniqueId(),
      title,
      text,
    });
    reply.redirect(urlFor('articles'));
  });

  app.put('/articles/:id', (request, reply) => {
    const { title, text } = request.body;
    const { id } = request.params;
    const { urlFor } = app.ctx;
    const article = db.articles.find(el => el.id === id);
    article.title = title;
    article.text = text;
    reply.redirect(urlFor('articles'));
  });

  app.delete('/articles/:id', (request, reply) => {
    const { id } = request.params;
    db.articles = db.articles.filter(el => el.id !== id);
    const { urlFor } = app.ctx;
    reply.redirect(urlFor('articles'));
  });
};
