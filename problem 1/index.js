const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

const BASE_URL = 'http://20.244.56.144/test/';

const SERVER_URLS = {
    'p': 'primes',
    'f': 'fibo',
    'e': 'even',
    'r': 'rand'
};

const MAX_WINDOW_SIZE = 10;

const dataWindows = {
    'p': [],
    'f': [],
    'e': [],
    'r': []
};

let BEARER_TOKEN = null;

async function fetchBearerToken() {
    try {
        const response = await fetch(BASE_URL + 'auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                companyName: "KL University",
                clientID: "220910fe-c3dd-496a-98a6-5335a5181725",
                clientSecret: "CIPjRpuZYrVOZLMB",
                ownerName: "KOTI CHOHAN",
                ownerEmail: "chohankoti333@gmail.com",
                rollNo: "2100031265"
            })
        });

        if (!response.ok) {
            throw new Error(`Failed to obtain bearer token: ${response.status}`);
        }

        const data = await response.json();
        BEARER_TOKEN = data.access_token;
    } catch (error) {
        console.error('Failed to obtain bearer token:', error.message);
    }
}

app.use(express.json());

app.get('/numbers/:numberid', async (req, res) => {
    const numberid = req.params.numberid;

    if (!(numberid in SERVER_URLS)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    const start_time = Date.now();
    const url = BASE_URL + SERVER_URLS[numberid];

    try {
        const headers = {
            'Authorization': `Bearer ${BEARER_TOKEN}`
        };

        const response = await fetch(url, {
            method: 'GET',
            headers: headers,
            timeout: 500
        });

        if (!response.ok) {
            throw new Error(`Request to test server failed: ${response.status}`);
        }

        const json = await response.json();
        const fetched_numbers = json.numbers || [];

        dataWindows[numberid] = dataWindows[numberid].concat(fetched_numbers).slice(-MAX_WINDOW_SIZE);

        const prev_window_state = dataWindows[numberid].slice(0, -fetched_numbers.length);
        const curr_window_state = dataWindows[numberid];
        const avg = curr_window_state.length > 0 ? curr_window_state.reduce((a, b) => a + b, 0) / curr_window_state.length : 0;

        const response_data = {
            numbers: fetched_numbers,
            windowPrevState: prev_window_state,
            windowCurrState: curr_window_state,
            avg: avg
        };

        const elapsed_time = Date.now() - start_time;
        if (elapsed_time > 500) {
            return res.status(500).json({ error: 'Response time exceeded 500 ms' });
        }

        res.json(response_data);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    await fetchBearerToken();
});
