install:
	npm i

start:
	npx gulp dev

build:
	NODE_ENV=production npx gulp prod

start-production: build
	NODE_ENV=test node dist/bin/server.js

webpack-bundle:
	NODE_ENV=production npx wp

webpack-bundle-analyze:
	NODE_ENV=production ANALYZE=true npx wp

madge:
	madge --exclude '^dist/*' --image g.svg .

madge-depends-on-file:
	madge --exclude '^dist/*' --depends $(arg) .

lint:
	npx eslint --quiet .

lint-fix:
	npx eslint --fix --quiet .

lint-with-warn:
	npx eslint .

test-once:
	npx jest

test:
	npx jest --watch

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
