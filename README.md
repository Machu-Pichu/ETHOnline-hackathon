# Machu-Picchu hackathon dApp

This repository contains a bootstrap project for Machu-Picchu hackathon dApp, with:
* Solidity Smart contracts in `contracts/` folder
* React UI in `src/` folder

## Init the project

Requirements: `node >= v14`

```
# clone the project, and then
npm install
```

## Smart Contracts

Smart Contracts are built & tested with [Buidler tool](http://buidler.dev/).

```
# Lint Solidity files
npm run contracts:lint

# Compile Solidity Smart Contracts
npm run contracts:compile

# Run unit tests
npm run contracts:test
```

## Frontend

Frontend is a React app, based on [Material-UI](http://material-ui.com) components.

```
# Linter
npm run frontend:lint

# Run locally
npm run frontend:start

# Build
npm run frontend:build
```

With `npm run frontend:start`, a local development server is started and the app is accessible on [http://localhost:8080](http://localhost:8080).