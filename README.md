# Forum backend project

Hi! <br />
This project is a backend for a forum platform. Think about the actors in a school forum.
In this case, we have users, which can be students or instructors who can create a topic and the students can write an answer and answer comments.
A professor can select an answer as the best answer for that topic, and both topics or answers can have attachments in his content.

Another important point about this project is the notification module. So when a question has a new answer or comments the author should be notified. And when an answer is selected as best the author also should be notified.

## the strategy
- The authentication is jwt.
- For notification, I use a partner named pubSub.
- To list question endpoint was decided to use cache strategy.


## the stack
- nodejs
- typescript
- nestjs
- docker
- vite
- zod
- prisma
- postgres
- Cloudflare R2
- redis

## Start this project
first download this repo:
```shell 
git clone git@github.com:mfatima5bc/05-nest-clean.git
```
install the dependences:
```shell
npm i
```
configure you R2 bucket and enviroments variables, based on .env.example
> TODO

run tests 
```shell
npm run test
```
Generate migrations
```shell
npx prisma generate
```
Rum migrations
```shell
npx prisma migrate deploy
```
Run your docker compose 
```shell
docker compose build
```
start the services with docker
```shell
docker compose up -d
```
_You can use the client.http to try the api endpoints, just download __REST Cliente__ vscode extension_

Enjoy!