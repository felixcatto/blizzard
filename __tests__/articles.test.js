import getApp from '../main';
import usersFixture from './fixtures/users';
import articlesFixture from './fixtures/articles';

describe('articles', () => {
  const server = getApp();
  let User;
  let Article;

  beforeAll(async () => {
    await server.ready();
    User = server.objection.User;
    Article = server.objection.Article;
    await User.query().insertGraph(usersFixture);
  });

  beforeEach(async () => {
    await Article.query().truncate();
    await Article.query().insertGraph(articlesFixture);
  });

  it('GET /articles', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/articles',
    });
    expect(Article).toBeDefined();
    expect(res.statusCode).toBe(200);
  });

  it('GET /articles/new', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/articles/new',
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET /articles/:id/edit', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/articles/1/edit',
    });
    expect(res.statusCode).toBe(200);
  });

  it('POST /articles', async () => {
    const article = {
      title: 'test',
      text: 'test',
    };
    const res = await server.inject({
      method: 'post',
      url: '/articles',
      payload: article,
    });

    const articleFromDb = await Article.query().findOne('title', article.title);
    expect(res.statusCode).toBe(302);
    expect(articleFromDb).toMatchObject(article);
  });

  it('PUT /articles/:id', async () => {
    const article = {
      ...articlesFixture[0],
      title: '(edited)',
    };
    const res = await server.inject({
      method: 'put',
      url: '/articles/1',
      payload: article,
    });

    const articleFromDb = await Article.query().findById(article.id);
    expect(res.statusCode).toBe(302);
    expect(articleFromDb).toMatchObject(article);
  });

  it('DELETE /articles/:id', async () => {
    const res = await server.inject({
      method: 'delete',
      url: '/articles/1',
    });
    const articleFromDb = await Article.query().findById(1);
    expect(res.statusCode).toBe(302);
    expect(articleFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await User.query().truncate();
    await server.close();
  });
});
