# Description

MVC app using  react + fastify + objection orm. Traditional blog with ability to add articles, tags and comments. Also have users and authentification

### Features

* Server router
* React views
* SSR. I.e. despite it is not SPA (no client router), the whole page rendered on server and hydrated on client. Which means you can use all power of javascript in "server" views :fire:
* Turbolinks. Feel the smooth transitions between pages, like in SPA :fire:
* Postgres database
* Nginx in front of Node for caching and serving static content
* One button deploy via Docker
* Requirements: Docker, Git. No need to install Postgres, Nginx. In production server you don't even need Node :blush:

### Cons
* need to do some meta programming for generating client scripts. Not a big problem, but still

### Commands

*Development*
```
make database-build # only first time
make database-up 
make database-seed # for prepopulate database, only first time
make start
```

*Deploy*
```
git clone https://github.com/felixcatto/blizzard.git
cd blizzard
make compose-build
make compose-up
make compose-seed # for prepopulate database, only first time
```
then go to `http://localhost/`
