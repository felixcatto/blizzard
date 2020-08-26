import React from 'react';
import cn from 'classnames';
import Layout from '../common/Layout';
import { Link, userRolesToIcons } from '../common/utils';

const userIconClass = role => cn('mr-5', userRolesToIcons[role]);

export default ({ urlFor, users, isAdmin }) => (
  <Layout>
    <h3>Users List</h3>

    {isAdmin && (
      <a href={urlFor('newUser')} className="d-inline-block mb-30">
        <button className="btn btn-primary">Create new user</button>
      </a>
    )}

    <table className="table">
      <tr>
        <th>Name</th>
        <th>Role</th>
        <th>Email</th>
        {isAdmin && <th className="text-right">Actions</th>}
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
          {isAdmin && (
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
          )}
        </tr>
      ))}
    </table>
  </Layout>
);
