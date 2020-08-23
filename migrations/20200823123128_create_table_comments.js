exports.up = async knex => {
  await knex.schema.createTable('comments', table => {
    table.increments().primary();
    table.string('guest_name');
    table.text('text');
    table.timestamp('created_at').defaultTo(new Date().toISOString());
    table.timestamp('updated_at').defaultTo(new Date().toISOString());
    table.integer('author_id').unsigned().references('users.id').onDelete('set null');
    table.integer('article_id').unsigned().references('articles.id').onDelete('cascade');
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('comments');
};
