import React from 'react';
import Context from '../common/context';
import { Error } from '../common/utils';

export default ({ article, tags, method = 'post' }) => {
  const { urlFor } = React.useContext(Context);
  const action = method === 'put' ? urlFor('article', { id: article.id }) : urlFor('articles');

  return (
    <form action={action} method="post">
      <input type="hidden" name="_method" value={method} />
      <div className="row mb-20">
        <div className="col-6">
          <div className="mb-15">
            <label>Title</label>
            <input type="text" className="form-control" name="title" defaultValue={article.title} />
            <Error entity={article} path="title" />
          </div>
          <div className="mb-25">
            <label>Text</label>
            <textarea className="form-control" name="text" defaultValue={article.text} />
          </div>
          <div>
            <select
              name="tagIds"
              className="form-control"
              multiple
              defaultValue={article.tagIds || []}
            >
              <option value=""></option>
              {tags.map(tag => (
                <option key={tag.id} value={tag.id}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
          <div id="tagsSelect"></div>
        </div>
      </div>

      <a href={urlFor('articles')} className="mr-10">
        Back
      </a>
      <button className="btn btn-primary" type="submit">
        Save
      </button>
    </form>
  );
};
