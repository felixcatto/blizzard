import { omit } from 'lodash';
import getApp from '../main';
import usersFixture from './fixtures/users';
import encrypt from '../lib/secure';

describe('users', () => {
  const server = getApp();
  let User;

  beforeAll(async () => {
    await server.ready();
    User = server.objection.User;
  });

  beforeEach(async () => {
    await User.query().truncate();
    await User.query().insertGraph(usersFixture);
  });

  it('GET /users', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users',
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET /users/new', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users/new',
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET /users/:id/edit', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/users/1/edit',
    });
    expect(res.statusCode).toBe(200);
  });

  it('POST /users', async () => {
    const user = {
      name: 'boris',
      role: 'admin',
      email: 'boris@yandex.ru',
      password: '1',
    };

    const res = await server.inject({
      method: 'post',
      url: '/users',
      payload: user,
    });

    const userFromDb = await User.query().findOne('name', user.name);
    const expectedUser =
      omit(user, 'password') |> (v => ({ ...v, password_digest: encrypt(user.password) }));
    expect(res.statusCode).toBe(302);
    expect(userFromDb).toMatchObject(expectedUser);
  });

  it('POST /users (unique email)', async () => {
    const user = omit(usersFixture[0], 'id');
    const res = await server.inject({
      method: 'post',
      url: '/users',
      payload: user,
    });

    expect(res.statusCode).toBe(200); // 302 for OK redirect, 200 for new page with errors :D
  });

  it('PUT /users/:id', async () => {
    const user = {
      ...usersFixture[0],
      role: 'guest',
    };
    const res = await server.inject({
      method: 'put',
      url: '/users/1',
      payload: user,
    });

    const userFromDb = await User.query().findOne('name', user.name);
    const expectedUser = omit(user, 'password');
    expect(res.statusCode).toBe(302);
    expect(userFromDb).toMatchObject(expectedUser);
  });

  it('DELETE /users/:id', async () => {
    const res = await server.inject({
      method: 'delete',
      url: '/users/1',
    });
    const userFromDb = await User.query().findById(1);
    expect(res.statusCode).toBe(302);
    expect(userFromDb).toBeFalsy();
  });

  afterAll(async () => {
    server.close();
  });
});
