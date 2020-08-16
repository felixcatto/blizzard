const afterCreate = (conn, done) => {
  conn.run('PRAGMA foreign_keys=on', done);
};

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: 'database.sqlite',
      // 'database.sqlite' -> migrations + test
      // '../database.sqlite' -> development?
    },
    useNullAsDefault: true,
    pool: { afterCreate },
    migrations: {
      stub: 'lib/migrationStub.js',
    },
    seeds: {
      stub: 'lib/seedStub.js',
    },
  },

  test: {
    client: 'sqlite3',
    connection: 'database.test.sqlite',
    useNullAsDefault: true,
    pool: { afterCreate },
  },

  sandbox: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    pool: { afterCreate },
  },

  production: {
    client: 'sqlite3',
    connection: {
      filename: './database.sqlite',
    },
    useNullAsDefault: true,
    pool: { afterCreate },
  },
};
