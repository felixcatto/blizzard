import path from 'path';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Context from './context';

export const renderMiddleware = app => {
  app.decorateReply('render', '');
  return async (request, reply) => {
    reply.render = (pathToView, props = {}) => {
      const { template, viewsDir } = app.ctx;
      const helpers = {
        urlFor: app.reverse,
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
};
