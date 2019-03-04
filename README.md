# Installation Instructions

Option 3 is the method I personally prefer.

## Option 1 Node.js + pm2

1. Install node.js 11 or greater
2. Install pm1 using `npm i pm2 -g`
3. Clone the project and `cd` into it's folder
4. Copy `.env.example` into `.env` and edit the configuration to your liking
5. Start the app with `pm2 start index.js`

## Option 2 Docker

1. Install Docker
2 Clone the project and `cd` into it's folder
3. Copy `.env.example` into `.env` and edit the configuration to your liking
4. Run `/build.sh`
5. run `/run.sh`

## Option 3 Docker + Docker-compose
1. Install Docker
2 Clone the project and `cd` into it's folder
3. Copy `.env.example` into `.env` and edit the configuration to your liking
4. Run `docker-compose up --build`