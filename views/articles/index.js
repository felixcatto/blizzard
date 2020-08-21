import React from 'react';
import Layout from '../common/Layout';
import Context from '../common/context';
import { Link } from '../common/utils';

export default ({ articles }) => {
  const { urlFor } = React.useContext(Context);
  return (
    <Layout>
      <h3>Articles List</h3>

      <a href={urlFor('newArticle')} className="d-inline-block mb-20">
        <button className="btn btn-primary">Create new article</button>
      </a>

      <table className="table">
        <tr>
          <th>Title</th>
          <th>Text</th>
          <th></th>
        </tr>
        {articles.map(article => (
          <tr key={article.id}>
            <td>{article.title}</td>
            <td>{article.text}</td>
            <td>
              <div className="d-flex justify-content-end">
                <a href={urlFor('article', { id: article.id })} className="mr-10">
                  <button className="btn btn-sm btn-outline-primary">Show Article</button>
                </a>
                <a href={urlFor('editArticle', { id: article.id })} className="mr-10">
                  <button className="btn btn-sm btn-outline-primary">Edit Article</button>
                </a>
                <Link href={urlFor('article', { id: article.id })} method="delete">
                  <div className="btn btn-sm btn-outline-primary">
                    Remove Article
                  </div>
                </Link>
              </div>
            </td>
          </tr>
        ))}
      </table>
    </Layout>
  );
};
