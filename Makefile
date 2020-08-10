install:
	npm install

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

generate-dependencies:
	madge --exclude '^dist/*' --image g.svg .

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
