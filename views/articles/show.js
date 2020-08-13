import React from 'react';
import Layout from '../common/Layout';
import Context from '../common/context';

export default ({ article }) => {
  const { urlFor } = React.useContext(Context);
  return (
    <Layout>
      <h3>{article.title}</h3>
      <p>{article.text}</p>
      <a href={urlFor('articles')}>Back</a>
    </Layout>
  );
};
