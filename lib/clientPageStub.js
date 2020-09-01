/* eslint-disable */
import React from 'react';
import { hydrate } from 'react-dom';
import Page from '{{page}}';
import Context from '../../../views/common/context';
import { makeUrlFor, isBelongsToUser } from '../../../views/common/utils';

const { routes, currentUser } = window.INITIAL_STATE;
window.INITIAL_STATE.urlFor = makeUrlFor(routes);
window.INITIAL_STATE.isBelongsToUser = isBelongsToUser(currentUser);

hydrate(
  <Context.Provider value={window.INITIAL_STATE}>
    <Page {...window.INITIAL_STATE} />
  </Context.Provider>,
  document.querySelector('#page')
);
