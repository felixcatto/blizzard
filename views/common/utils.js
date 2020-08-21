import React from 'react';
import { userRoles } from '../../lib/utils';

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
  [userRoles.admin]: 'fa fa-star',
  [userRoles.user]: 'fa fa-fire',
  [userRoles.guest]: 'fa fa-ghost',
};
