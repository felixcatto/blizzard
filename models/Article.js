import path from 'path';
import { Model } from 'objection';
import * as y from 'yup';

export default class Article extends Model {
  static get tableName() {
    return 'articles';
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: path.resolve(__dirname, 'User.js'),
        join: {
          from: 'articles.author_id',
          to: 'users.id',
        },
      },
    };
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }

  static get yupSchema() {
    return y.object({
      id: y.string(),
      title: y.string().required('required'),
      text: y.string(),
      author_id: y.string(),
      created_at: y.string(),
      updated_at: y.string(),
    });
  }
}
