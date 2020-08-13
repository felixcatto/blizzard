import React from 'react';

export const Link = ({ href, type, children }) => (
  <form method="POST" action={href} className="fake-link">
    <input type="hidden" name="_method" value={type} />
    <button type="submit" className="fake-link__button">
      {children}
    </button>
  </form>
);

export const Error = ({ entity, path }) => {
  const hasError = entity.errors?.find?.(e => e.path === path);
  const errorMsg = hasError?.message;
  return hasError ? <div className="error">{errorMsg}</div> : null;
};
