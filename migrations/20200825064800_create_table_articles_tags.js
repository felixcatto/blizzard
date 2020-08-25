exports.up = async knex => {
  await knex.schema.createTable('articles_tags', table => {
    table.integer('article_id').unsigned().references('articles.id').onDelete('cascade');
    table.integer('tag_id').unsigned().references('tags.id').onDelete('cascade');
    table.primary(['article_id', 'tag_id']);
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('articles_tags');
};
