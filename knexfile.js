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
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'felixcatto',
      password: '1',
      database: 'postgres',
    },
    useNullAsDefault: true,
  },

  sandbox: {
    client: 'sqlite3',
    connection: ':memory:',
    useNullAsDefault: true,
    pool: { afterCreate },
  },

  production: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'felixcatto',
      password: '1',
      database: 'postgres',
    },
    useNullAsDefault: true,
  },
};
