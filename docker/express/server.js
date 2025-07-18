const express = require('express');
const WebSocket = require('ws');
const cron = require('node-cron');
const fetch = require('node-fetch');

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws/btcusdt@trade';

const app = express();
let price = null;

// Connect to Binance WebSocket once and keep listening
const ws = new WebSocket(BINANCE_WS_URL);

ws.on('message', (data) => {
	try {
		const parsed = JSON.parse(data);
		if (parsed.p) {
			price = parseFloat(parsed.p);
		}
	} catch (err) {
		console.error('Failed to parse WS message:', err);
	}
});

ws.on('error', (err) => {
	console.error('WebSocket error:', err);
});

app.get('/', (req, res) => {
	if (price !== null) {
		const formattedPrice = price.toFixed(2);
		res.json({ formattedPrice });
	} else {
		res.status(503).json({ error: 'Price not available yet' });
	}
});

const API_KEY = process.env.API_KEY;

cron.schedule('30 * * * * *', async () => {
    try {
        const catchupRes = await fetch('http://next:3000/api/catchup', {
            method: 'POST',
            headers: { 'x-api-key': API_KEY }
        });
        console.log('Catchup status:', catchupRes.status);
    } catch (err) {
        console.error('Cron job error:', err);
    }
});

cron.schedule('* * * * * *', async () => {
    try {
        const executeRes = await fetch('http://next:3000/api/execute', {
            method: 'POST',
            headers: { 'x-api-key': API_KEY }
        });
        console.log('Execute status:', executeRes.status);
    } catch (err) {
        console.error('Cron job error:', err);
    }
});

cron.schedule('0 */12 * * *', async () => {
    try {
        const agregateRes = await fetch('http://next:3000/api/agregate', {
            method: 'POST',
            headers: { 'x-api-key': API_KEY }
        });
        console.log('Agregate status:', agregateRes.status);
    } catch (err) {
        console.error('Agregate cron job error:', err);
    }
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server listening on port ${PORT}`);
});
