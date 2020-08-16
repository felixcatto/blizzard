import React from 'react';
import Layout from '../common/Layout';
import Form from './form';

export default props => (
  <Layout>
    <h3>Edit User</h3>
    <Form {...props} method="put" />
  </Layout>
);
