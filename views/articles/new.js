import React from 'react';
import Layout from '../common/Layout';
import Form from './Form';

export default ({ article, tags }) => (
  <Layout>
    <h3>Create New Article</h3>
    <Form article={article} tags={tags} />
  </Layout>
);
