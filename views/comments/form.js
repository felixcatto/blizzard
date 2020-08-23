import React from 'react';
import Context from '../common/context';
import { Error } from '../common/utils';

export default ({ comment, action, backUrl, method = 'post' }) => {
  const { isSignIn } = React.useContext(Context);
  const isNewComment = method === 'post';
  const canShowGuestName = isNewComment ? !isSignIn : !comment.author_id;

  return (
    <form action={action} method="post">
      <input type="hidden" name="_method" value={method} />
      <div className="row mb-20">
        <div className="col-6">
          {canShowGuestName && (
            <div className="mb-15">
              <label>Guest name</label>
              <input
                type="text"
                className="form-control"
                name="guest_name"
                defaultValue={comment.guest_name}
              />
              <Error entity={comment} path="guest_name" />
            </div>
          )}
          <div>
            <label>Text</label>
            <textarea className="form-control" name="text" defaultValue={comment.text} />
            <Error entity={comment} path="text" />
          </div>
        </div>
      </div>

      <a href={backUrl} className="mr-10">
        Back
      </a>
      <button className="btn btn-primary" type="submit">
        Save
      </button>
    </form>
  );
};
