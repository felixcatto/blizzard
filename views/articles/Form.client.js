import React from 'react';
import { hydrate, render } from 'react-dom';
import TagIdsSelect from '../../client/components/Select';

export default () => {
  render(<TagIdsSelect />, document.querySelector('#tagsSelect'));
};
