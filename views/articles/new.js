import React from 'react';
import Layout from '../common/Layout';
import Form from './form';

export default ({ article }) => (
  <Layout>
    <h3>Create New Article</h3>
    <Form article={article} />
  </Layout>
);
