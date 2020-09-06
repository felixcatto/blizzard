install:
	npm i

start:
	npx gulp dev

start-production:
	NODE_ENV=test node dist/bin/server.js

build:
	NODE_ENV=production npx gulp build
	NODE_ENV=production make migrate
	NODE_ENV=production make al-seed

webpack-bundle:
	NODE_ENV=production npx wp

webpack-bundle-analyze:
	NODE_ENV=production ANALYZE=true npx wp

madge: madge-build
	madge --image g.svg dist

madge-build:
	npx gulp buildForMadge

madge-depends-on-file:
	madge --exclude '^dist/*' --depends $(arg) .

lint:
	npx eslint --quiet .

lint-fix:
	npx eslint --fix --quiet .

lint-with-warn:
	npx eslint .

test:
	npx jest --runInBand --watch

test-one-file:
	npx jest --watch $(arg)

migrate:
	npx knex migrate:latest

migrate-new:
	npx knex migrate:make $(arg)

migrate-rollback:
	npx knex migrate:rollback

migrate-list:
	npx knex migrate:list

al-seed:
	npx knex --esm seed:run

al-seed-new:
	npx knex seed:make $(arg)
