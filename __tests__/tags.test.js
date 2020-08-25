import getApp from '../main';
import tagsFixture from './fixtures/tags';

describe('tags', () => {
  const server = getApp();
  let Tag;

  beforeAll(async () => {
    await server.ready();
    Tag = server.objection.Tag;
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
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET /tags/:id/edit', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/tags/1/edit',
    });
    expect(res.statusCode).toBe(200);
  });

  it('POST /tags', async () => {
    const tag = { name: 'test' };
    const res = await server.inject({
      method: 'post',
      url: '/tags',
      payload: tag,
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
    });
    const tagFromDb = await Tag.query().findById(tag.id);
    expect(res.statusCode).toBe(302);
    expect(tagFromDb).toBeFalsy();
  });

  afterAll(async () => {
    await server.close();
  });
});
