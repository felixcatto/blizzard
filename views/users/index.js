import React from 'react';
import cn from 'classnames';
import Layout from '../common/Layout';
import Context from '../common/context';
import { Link, userRolesToIcons } from '../common/utils';

export default ({ users }) => {
  const { urlFor } = React.useContext(Context);
  const userIconClass = role => cn('mr-5', userRolesToIcons[role]);

  return (
    <Layout>
      <h3>Users List</h3>

      <a href={urlFor('newUser')} className="d-inline-block mb-20">
        <button className="btn btn-primary">Create new user</button>
      </a>

      <table className="table">
        <tr>
          <th>Name</th>
          <th>Role</th>
          <th>Email</th>
          <th></th>
        </tr>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              <div className="d-flex align-items-center">
                <i className={userIconClass(user.role)}></i>
                <div>{user.role}</div>
              </div>
            </td>
            <td>{user.email}</td>
            <td>
              <div className="d-flex justify-content-end">
                <a href={urlFor('editUser', { id: user.id })} className="mr-10">
                  <button className="btn btn-sm btn-outline-primary">Edit user</button>
                </a>
                <Link href={urlFor('user', { id: user.id })} method="delete">
                  <div className="btn btn-sm btn-outline-primary">Remove user</div>
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </table>
    </Layout>
  );
};
