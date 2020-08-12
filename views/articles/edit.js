import React from 'react';
import Layout from '../common/Layout';
import Form from './form';

export default ({ article }) => (
  <Layout>
    <h3>Edit Article</h3>
    <Form article={article} method="put" />
  </Layout>
);
