import React from 'react';
import cn from 'classnames';
import Context from './context';

export default ({ children }) => {
  const { urlFor, curPath } = React.useContext(Context);
  const linkClass = linkPath =>
    cn('app__nav-link', {
      'app__nav-link_active':
        (linkPath === '/' && curPath === '/') || (linkPath !== '/' && curPath.startsWith(linkPath)),
    });

  return (
    <div className="app">
      <div className="app__header">
        <div className="container app__header-fg">
          <img src="/img/blizzard.svg" className="app__logo mr-30" />
          <div className="d-flex">
            <a href={urlFor('home')} className={linkClass(urlFor('home'))}>
              Home
            </a>
            <a href={urlFor('users')} className={linkClass(urlFor('users'))}>
              Users
            </a>
            <a href={urlFor('articles')} className={linkClass(urlFor('articles'))}>
              Articles
            </a>
          </div>
        </div>
      </div>

      <div className="container app__body">{children}</div>
    </div>
  );
};
