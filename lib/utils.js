import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Context from '../views/common/context';

export const addRender = app => async (request, reply) => {
  app.ctx.urlFor = app.reverse;

  reply.render = (pathToView, props = {}) => {
    const { template, viewsDir, urlFor } = app.ctx;
    const helpers = {
      urlFor,
      curPath: request.url,
    };
    const Component = require(path.resolve(viewsDir, pathToView)).default; // eslint-disable-line
    const renderedComponent = renderToStaticMarkup(
      <Context.Provider value={helpers}>
        <Component {...props} />
      </Context.Provider>
    );

    // const script = clientPages.includes(pathToComponent)
    //   ? `<script src="/js/${pathToComponent}.js"></script>`
    //   : '';

    const html = template.replace('{{content}}', renderedComponent);
    // .replace('{{clientPageScript}}', script);

    reply.type('text/html');
    reply.send(html);
  };
};

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
    return e.inner.map(el => ({
      path: el.path,
      message: el.message,
      value: el.value,
    }));
  }

  return e.message;
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
    request.errors = getYupErrors(e);
  }
};
