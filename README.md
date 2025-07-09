[recording.webm](https://github.com/user-attachments/assets/85528f13-e1c9-4c84-810b-18fa1330f5fc)

## Getting Started

You need a .env file at the root of the project. You can use ```openssl rand -base64 128``` to generate the keys.
```
MONGODB_URI=mongodb://mongodb:27017
SECRET_KEY=secret
SECRET_KEY_REFRESH=refresh
API_KEY=api
DOMAIN=localhost
```

```bash
docker-compose up
```
On startup, the database will read from a file containing candles since 2012, it will take a few minutes to process the file into the database.

An additional server (express) is used to sideload /src/app/server.js to avoid Binance API limit rate. To avoid over-complicating the startup of nextjs, it runs as a standalone instance. A cron job is used to run /api/catchup, /api/execute and /api/agregate.

[http://localhost:3000](http://localhost:3000)

## Introduction

Bitcoin investment simulation. The goal is to produce a SPA (Single Page Applications) which provides a Candle Graph and a standard trading experience.

### Candle Graph

[Apache Echarts](https://echarts.apache.org/en/index.html)

### Wallet Simulation

<ul>
	<li>Selecting an initial amount to invest in selected assets</li>
	<li>Placing orders (market price, limit price)</li>
	<li>Visualization of assets</li>
	<li>No registration system needed to save the wallet in the backend</li>
	<li>Wallet history</li>
</ul>

### API

<ul>
	<li>Binance API</li>
	<li>Near to real-time data</li>
</ul>

## Tech Stack

<ul>
	<li>NextJS/MongoDB</li>
	<li>Tailwind CSS</li>
	<li>100% Typescript</li>
	<li>Pure functions, no class object</li>
	<li>ESLint</li>
	<li>Prettier</li>
	<li>Memory based API rate-limit</li>
</ul>

### WIP

<ul>
	<li>Jest unit tests for the backend</li>
	<li>Offline handling</li>
	<li>PWA Android/iOS</li>
	<li>Blacklist JWT when locking wallet</li>
	<li>100% tests coverage E2E (Cypress or another)</li>
	<li>ZodTS for validation/schemas</li>
	<li>Moving all the authentication in the wallet context</li>
</ul>
