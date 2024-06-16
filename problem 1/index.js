const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

const BASE_URL = 'http://20.244.56.144/test/';
const MAX_WINDOW_SIZE = 10;

const dataWindows = {
    'primes': [],
    'fibo': [],
    'even': [],
    'rand': []
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


app.get('/numbers/:numberType', async (req, res) => {
    const numberType = req.params.numberType;

    const validTypes = ['primes', 'fibo', 'even', 'rand'];

    if (!validTypes.includes(numberType)) {
        return res.status(400).json({ error: 'Invalid number type' });
    }

    const start_time = Date.now();
    const url = BASE_URL + numberType;

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
        const fetchedNumbers = json.numbers || [];

        dataWindows[numberType] = dataWindows[numberType].concat(fetchedNumbers).slice(MAX_WINDOW_SIZE);

        const prevWindowState = dataWindows[numberType].slice(0, fetchedNumbers.length);
        const currWindowState = dataWindows[numberType];
        const avg = currWindowState.length > 0 ? currWindowState.reduce((a, b) => a + b, 0) / currWindowState.length : 0;

        const responseData = {
            numbers: fetchedNumbers,
            windowPrevState: prevWindowState,
            windowCurrState: currWindowState,
            avg: avg
        };

        const elapsedTime = Date.now() - start_time;
        if (elapsedTime > 500) {
            return res.status(500).json({ error: 'Response time exceeded 500 ms' });
        }

        res.json(responseData);
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);

    await fetchBearerToken();
});
