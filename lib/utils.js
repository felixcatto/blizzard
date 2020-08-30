import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import fp from 'fastify-plugin';
import knexConnect from 'knex';
import { Model } from 'objection';
import { isUndefined, isString, isEmpty, isObject, has } from 'lodash';
import Context from '../views/common/context';
import knexConfig from '../knexfile';

export const makeUndefinedKeyError = rootObject => {
  const proxyObject = object =>
    new Proxy(object, {
      get(target, key) {
        if (has(target, key)) {
          return target[key];
        }
        console.warn(target);
        throw new Error(`There is no key [${key}] in enum`);
      },
    });

  Object.keys(rootObject).forEach(key => {
    if (isObject(rootObject[key])) {
      rootObject[key] = proxyObject(rootObject[key]);
    }
  });

  return proxyObject(rootObject);
};

export const makeEnum = args =>
  makeUndefinedKeyError(args.reduce((acc, key) => ({ ...acc, [key]: key }), {}));

export const roles = makeEnum(['user', 'admin', 'guest']);

const isAdmin = currentUser => currentUser.role === roles.admin;

export const checkAdmin = async (request, reply) => {
  if (!isAdmin(request.currentUser)) {
    reply.code(403).send({ message: 'Forbidden' });
  }
};

const isBelongsToUser = currentUser => resourceAuthorId =>
  currentUser.id === resourceAuthorId || currentUser.role === roles.admin;

export const checkBelongsToUser = getResourceAuthorId => async (request, reply) => {
  const resourceAuthorId = await getResourceAuthorId(request);
  if (!isBelongsToUser(request.currentUser)(resourceAuthorId)) {
    reply.code(403).send({ message: 'Forbidden' });
  }
};

export const isSignedIn = currentUser => currentUser.role !== roles.guest;

export const checkSignedIn = async (request, reply) => {
  if (!isSignedIn(request.currentUser)) {
    reply.code(401).send({ message: 'Unauthorized' });
  }
};

export const urlForPlugin = fp(async app => {
  app.ctx.urlFor = app.reverse;
});

export const currentUserPlugin = fp(async app => {
  app.addHook('preHandler', async request => {
    const userId = request.session.get('userId');
    const { User } = app.objection;
    let user;
    if (userId) {
      user = await User.query().findById(userId);
    }

    if (user) {
      request.currentUser = user;
    } else {
      request.currentUser = User.guestUser;
    }
  });
});

export const reactRenderPlugin = fp(async app => {
  app.addHook('preHandler', async (request, reply) => {
    reply.render = (pathToView, props = {}) => {
      const { template, viewsDir, urlFor, webpackEntries } = app.ctx;
      const { currentUser } = request;
      const helpers = {
        urlFor,
        curPath: request.url,
        currentUser,
        isSignedIn: isSignedIn(currentUser),
        isAdmin: isAdmin(currentUser),
        isBelongsToUser: isBelongsToUser(currentUser),
      };

      const Component = require(path.resolve(viewsDir, pathToView)).default; // eslint-disable-line
      const renderedComponent = renderToStaticMarkup(
        <Context.Provider value={helpers}>
          <Component {...helpers} {...props} />
        </Context.Provider>
      );

      const entry = webpackEntries.find(el => el === `${pathToView}.client.js`);
      const clientPageScript = entry ? `<script src="/js/${entry}"></script>` : '';
      const html = template
        .replace('{{content}}', renderedComponent)
        .replace('{{clientPageScript}}', clientPageScript);

      reply.type('text/html');
      reply.send(html);
    };
  });
});

export const emptyObject = new Proxy(
  {},
  {
    get() {
      return '';
    },
  }
);

const getYupErrors = e => {
  if (e.inner) {
    return e.inner.reduce(
      (acc, el) => ({
        ...acc,
        [el.path]: el.message,
      }),
      {}
    );
  }

  return e.message; // no object?
};

export const validate = (schema, payloadType = 'body') => async request => {
  const payload = payloadType === 'query' ? request.query : request.body;

  try {
    const newValue = schema.validateSync(payload, {
      abortEarly: false,
      stripUnknown: true,
    });
    request.data = newValue;
  } catch (e) {
    const { id } = request.params;
    request.errors = getYupErrors(e);
    request.entityWithErrors = { ...payload, errors: getYupErrors(e), id };
  }
};

export const requiredIfExists = () => [
  'requiredIfExists',
  'required',
  value => isUndefined(value) || (isString(value) && !isEmpty(value)),
];

export const objectionPlugin = fp(async (app, { mode, models }) => {
  const knex = knexConnect(knexConfig[mode]);
  Model.knex(knex);
  app.objection = { ...models, knex };

  app.addHook('onClose', async (_, done) => {
    await knex.destroy();
    done();
  });
});

export const checkValueUnique = async (Enitity, column, value, id = null) => {
  const existingEntities = await Enitity.query().select(column).whereNot('id', id);
  if (existingEntities.some(entity => entity[column] === value)) {
    return {
      isUnique: false,
      errors: { errors: { [column]: `${column} should be unique` }, id },
    };
  }

  return { isUnique: true, errors: null };
};
