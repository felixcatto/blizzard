exports.up = async knex => {
  await knex.schema.createTable('articles', table => {
    table.increments().primary();
    table.string('title');
    table.text('text');
    table.timestamp('created_at').defaultTo(new Date().toISOString());
    table.timestamp('updated_at').defaultTo(new Date().toISOString());
    table.integer('author_id').unsigned().references('users.id').onDelete('set null');
  });
};

exports.down = async knex => {
  await knex.schema.dropTable('articles');
};
