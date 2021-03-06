install:
	npm i

start:
	npx gulp dev

start-production:
	NODE_ENV=production node dist/bin/server.js

build:
	NODE_ENV=production npx gulp build

webpack-bundle:
	NODE_ENV=production npx webpack

webpack-bundle-analyze:
	NODE_ENV=production ANALYZE=true npx webpack

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

database-build:
	docker build -t blizzard_database services/database

database-up:
	docker run --rm -d -e POSTGRES_PASSWORD=1 \
	-p 5432:5432 \
	-v blizzard_database:/var/lib/postgresql/data \
	--name=blizzard_database \
	blizzard_database

database-down:
	docker stop blizzard_database

database-seed:
	npx knex --esm seed:run

database-seed-new:
	npx knex seed:make $(arg)

compose-build:
	docker-compose build

compose-up:
	docker-compose up -d
	docker-compose run app make migrate

compose-down:
	docker-compose down

compose-seed:
	docker-compose run app make database-seed
