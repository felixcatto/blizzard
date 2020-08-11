import React from 'react';
import Context from '../../lib/context';

export default ({ children }) => {
  const { urlFor } = React.useContext(Context);
  return (
    <div className="container app__container">
      <h1>Blizzard</h1>

      <div className="mb-20">
        <a href={urlFor('home')} className="mr-20">
          Home
        </a>
        <a href={urlFor('users')} className="mr-20">
          Users
        </a>
        <a href="#">Articles</a>
      </div>

      {children}
    </div>
  );
};
