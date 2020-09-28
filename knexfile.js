const afterCreate = (conn, done) => {
  conn.run('PRAGMA foreign_keys=on', done);
};

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: '1',
      database: 'blizzard',
    },
    useNullAsDefault: true,
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
      user: 'postgres',
      password: '1',
      database: 'blizzard_test',
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
      user: 'postgres',
      password: '1',
      database: 'blizzard',
    },
    useNullAsDefault: true,
  },
};
