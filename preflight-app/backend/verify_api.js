const http = require('http');

const BASE_URL = 'http://localhost:5000/api/checks';

function request(method, path, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: body ? JSON.parse(body) : null });
                } catch (e) {
                    resolve({ status: res.statusCode, body });
                }
            });
        });

        req.on('error', reject);

        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('Starting API Verification...');

    try {
        // 1. GET all checks
        console.log('Testing GET /api/checks...');
        const getRes = await request('GET', '/api/checks');
        if (getRes.status !== 200 || !Array.isArray(getRes.body)) throw new Error('GET failed');

        // Verify specific initial items exist
        const expectedChecks = [
            'Check Digital Sky for airspace clearance',
            'WINDY DATA- at 0m alt, at 100m alt',
            'Anemometer wind speed & Wind Direction'
        ];

        const foundAll = expectedChecks.every(text => getRes.body.some(c => c.description === text));
        if (!foundAll) throw new Error('Initial checks not found');
        console.log('PASS: GET /api/checks (Initial data verified)');

        // 2. POST new check
        console.log('Testing POST /api/checks...');
        const newCheck = { description: 'Test Check' };
        const postRes = await request('POST', '/api/checks', newCheck);
        if (postRes.status !== 201 || postRes.body.description !== 'Test Check') throw new Error('POST failed');
        const newId = postRes.body.id;
        console.log('PASS: POST /api/checks');

        // 3. PUT update check
        console.log(`Testing PUT /api/checks/${newId}...`);
        const updateData = { status: 'Passed', comment: 'Verified' };
        const putRes = await request('PUT', `/api/checks/${newId}`, updateData);
        if (putRes.status !== 200 || putRes.body.status !== 'Passed') throw new Error('PUT failed');
        console.log('PASS: PUT /api/checks/:id');

        // 4. DELETE check
        console.log(`Testing DELETE /api/checks/${newId}...`);
        const delRes = await request('DELETE', `/api/checks/${newId}`);
        if (delRes.status !== 204) throw new Error('DELETE failed');
        console.log('PASS: DELETE /api/checks/:id');

        // 5. Verify deletion
        const getRes2 = await request('GET', '/api/checks');
        if (getRes2.body.find(c => c.id === newId)) throw new Error('Delete verification failed');
        console.log('PASS: Item successfully removed');

        console.log('ALL TESTS PASSED');
    } catch (err) {
        console.error('TEST FAILED:', err.message);
        process.exit(1);
    }
}

runTests();
