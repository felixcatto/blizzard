import getApp from '../main';
import usersFixture from './fixtures/users';
import articlesFixture from './fixtures/articles';
import commentsFixture from './fixtures/comments';
import { getLoginCookie } from './fixtures/utils';

describe('articles', () => {
  const server = getApp();
  let User;
  let Article;
  let Comment;
  let loginCookie;

  beforeAll(async () => {
    await server.ready();
    User = server.objection.User;
    Article = server.objection.Article;
    Comment = server.objection.Comment;
    await User.query().delete();
    await Article.query().delete();
    await User.query().insertGraph(usersFixture);
    await Article.query().insertGraph(articlesFixture);
    loginCookie = await getLoginCookie(server);
  });

  beforeEach(async () => {
    await Comment.query().delete();
    await Comment.query().insertGraph(commentsFixture);
  });

  it('GET /articles/:id/comments/:id/edit', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/articles/-3/comments/-4/edit',
      cookies: loginCookie,
    });
    expect(res.statusCode).toBe(200);
  });

  it('POST /articles/:id/comments', async () => {
    const comment = {
      guest_name: 'guest_name',
      text: 'text',
    };
    const res = await server.inject({
      method: 'post',
      url: '/articles/-1/comments',
      payload: comment,
    });

    const commentFromDb = await Comment.query().findOne('guest_name', comment.guest_name);
    expect(res.statusCode).toBe(302);
    expect(commentFromDb).toMatchObject(comment);
  });

  it('PUT /articles/:id/comments/:id', async () => {
    const comment = {
      ...commentsFixture[0],
      guest_name: 'guest_name',
      text: '(edited)',
    };

    const res = await server.inject({
      method: 'put',
      url: `/articles/${comment.article_id}/comments/${comment.id}`,
      payload: comment,
      cookies: loginCookie,
    });

    const commentFromDb = await Comment.query().findById(comment.id);
    expect(res.statusCode).toBe(302);
    expect(commentFromDb).toMatchObject(comment);
  });

  it('DELETE /articles/:id/comments/:id', async () => {
    const [comment] = commentsFixture;
    const res = await server.inject({
      method: 'delete',
      url: `/articles/${comment.article_id}/comments/${comment.id}`,
      cookies: loginCookie,
    });

    const commentFromDb = await Comment.query().findById(comment.id);
    expect(res.statusCode).toBe(302);
    expect(commentFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
