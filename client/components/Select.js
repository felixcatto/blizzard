import React, { useState } from 'react';
import Select from 'react-select';

const withTransform = data => {
  const transformTag = tag => ({ value: tag.id, label: tag.name });
  const tags = data.tags.map(transformTag);
  const selectedTags = data.article.tags.map(transformTag);
  return <TagsSelect tags={tags} selectedTags={selectedTags} />;
};

const TagsSelect = ({ tags, selectedTags }) => {
  const [selectedOption, setSelectedOption] = useState(selectedTags);

  return (
    <Select
      name="tagIds"
      defaultValue={selectedOption}
      onChange={setSelectedOption}
      options={tags}
      isMulti
    />
  );
};

export default withTransform;
