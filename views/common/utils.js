import React from 'react';
import { roles } from '../../lib/utils';

export const Link = ({ href, method, children }) => (
  <form method="POST" action={href} className="fake-link">
    <input type="hidden" name="_method" value={method} />
    <button type="submit" className="fake-link__button">
      {children}
    </button>
  </form>
);

export const Error = ({ entity, path }) => {
  const errorMsg = entity.errors?.[path];
  return errorMsg ? <div className="error">{errorMsg}</div> : null;
};

export const userRolesToIcons = {
  [roles.admin]: 'fa fa-star',
  [roles.user]: 'fa fa-fire',
  [roles.guest]: 'fa fa-ghost',
};
