FROM node:12.18.4

RUN mkdir blizzard
WORKDIR blizzard
COPY package.json package-lock.json /blizzard/
RUN npm i
COPY . .
RUN make build
EXPOSE 4000

CMD ["node", "dist/bin/server.js"]
