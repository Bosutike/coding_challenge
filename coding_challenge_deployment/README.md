# Deployment

### Requirements

- It's required that docker is installed in your system.
- It's required to have backend.env up to date.
- Ports 8080, 3000, 5555 not in use in the system.

### Build images locally

_Clone all the required repos_

> git clone https://github.com/Bosutike/coding_challenge_back.git
> git clone https://github.com/Bosutike/coding_challenge_front.git
> git clone https://github.com/Bosutike/coding_challenge_deployment.git

_Build images_

> docker build ./coding_challenge_back/ -t coding_challenge_back
> docker build ./coding_challenge_front/ -t coding_challenge_front

### Run containers

_Go into coding_challenge_deployment folder_

> cd coding_challenge_deployment

_Run the following command to launch the containers._

> docker compose up

_After containers are running, run db migrations._

> docker exec coding_challenge_back npx sequelize db:migrate

_After migrations, run db seed._

> docker exec coding_challenge_back npx sequelize-cli db:seed:all
