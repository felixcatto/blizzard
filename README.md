# Description

MVC app using fastify + react + objection orm

### Features

* Server router
* React views
* SSR. I.e. despite it is not SPA (no client router), the whole page rendered on server and hydrated on client. Which means you can use all power of javascript in "server" views :fire:
* Postgres database
* Nginx in front of Node for serving static content
* One button deploy via Docker
* Requirements: Docker, Git. No need to install Postgres, Nginx. In production server you don't even need Node :blush:

### Commands

*Development*
```
make database-up
make start
```

*Deploy*
```
git clone https://github.com/felixcatto/blizzard.git
cd blizzard
make compose-build
make compose-up
make compose-seed # for prepopulate database, can be skipped
```
then go to `http://localhost/`
