exports.seed = async knex => {
  await knex('table_name').truncate();
  await knex('table_name').insert('?');
};
