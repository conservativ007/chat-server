# Project: Chat Service

## [ChatService](http://85.209.148.189:3000/)

## Description

I introduce a Chat Service, you can create a user and communicate with another people. Send messages, send emoticons, like messages, edit and delete messages, there is a general chat and a private chat

## Server side application

This is the server side of the application
The frontend side you can find [here](https://github.com/conservativ007/chat-client)

## Downloading

⚠️ The project uses docker images, you must have a docker application in your local machine

```
git clone git@github.com:conservativ007/nodejs2022Q4-service.git
```

```
cd chat-server
```

## Installing NPM modules

```
npm install
```

## Run application in Docker container

```
npm run docker:build
```

after this command will start four services:
:one: server (NestJS)
:two: frontend (ReactJS)
:three: postgres (DB)
:four: adminer (view to DB in browser)

## Insomnia

For easy verification, the Insomnia json file is at the root of the project.

## Logging

Logs are written to logs folder, you can see it in the docker container,
select: conservativ/chat-app-server :arrow_right: app :arrow_right: logs

## Testing

After application running you can use tests:

```
npm run test:e2e
```

#### Technology stack

NestJS, TypeScript, Socket.io, postgres + typeorm
