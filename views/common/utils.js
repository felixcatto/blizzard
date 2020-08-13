import React from 'react';

export const Link = ({ href, type, children }) => (
  <form method="POST" action={href} className="fake-link">
    <input type="hidden" name="_method" value={type} />
    <button type="submit" className="fake-link__button">{children}</button>
  </form>
);
