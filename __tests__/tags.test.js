import getApp from '../main';
import tagsFixture from './fixtures/tags';
import usersFixture from './fixtures/users';
import { getLoginCookie } from './fixtures/utils';

describe('tags', () => {
  const server = getApp();
  let Tag;
  let User;
  let loginCookie;

  beforeAll(async () => {
    await server.ready();
    User = server.objection.User;
    Tag = server.objection.Tag;
    await User.query().delete();
    await User.query().insertGraph(usersFixture);
    loginCookie = await getLoginCookie(server);
  });

  beforeEach(async () => {
    await Tag.query().delete();
    await Tag.query().insertGraph(tagsFixture);
  });

  it('GET /tags', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/tags',
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET /tags/new', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/tags/new',
      cookies: loginCookie,
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET /tags/:id/edit', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/tags/-1/edit',
      cookies: loginCookie,
    });
    expect(res.statusCode).toBe(200);
  });

  it('POST /tags', async () => {
    const tag = { name: 'test' };
    const res = await server.inject({
      method: 'post',
      url: '/tags',
      payload: tag,
      cookies: loginCookie,
    });

    const tagFromDb = await Tag.query().findOne('name', tag.name);
    expect(res.statusCode).toBe(302);
    expect(tagFromDb).toMatchObject(tag);
  });

  it('PUT /tags/:id', async () => {
    const tag = {
      ...tagsFixture[0],
      name: '(edited)',
    };
    const res = await server.inject({
      method: 'put',
      url: `/tags/${tag.id}`,
      payload: tag,
      cookies: loginCookie,
    });

    const tagFromDb = await Tag.query().findById(tag.id);
    expect(res.statusCode).toBe(302);
    expect(tagFromDb).toMatchObject(tag);
  });

  it('DELETE /tags/:id', async () => {
    const [tag] = tagsFixture;
    const res = await server.inject({
      method: 'delete',
      url: `/tags/${tag.id}`,
      cookies: loginCookie,
    });
    const tagFromDb = await Tag.query().findById(tag.id);
    expect(res.statusCode).toBe(302);
    expect(tagFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
