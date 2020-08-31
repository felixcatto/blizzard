import React from 'react';
import { hydrate, render } from 'react-dom';
import TagsSelect from '../../client/components/Select';

export default () => {
  const { tags, article } = window.INITIAL_STATE;
  hydrate(<TagsSelect tags={tags} article={article} />, document.querySelector('#tagsSelect'));
};
