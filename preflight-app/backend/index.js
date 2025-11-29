const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// In-memory data store
let checks = [
    { id: 1, description: 'Check Digital Sky for airspace clearance', status: 'Pending', comment: '' },
    { id: 2, description: 'WINDY DATA- at 0m alt, at 100m alt', status: 'Pending', comment: '' },
    { id: 3, description: 'Anemometer wind speed & Wind Direction', status: 'Pending', comment: '' },
    { id: 4, description: 'Inform the GC to power up the aircraft', status: 'Pending', comment: '' },
    { id: 5, description: 'Choose the respective mission', status: 'Pending', comment: '' },
    { id: 6, description: 'Write and read the mission', status: 'Pending', comment: '' },
    { id: 7, description: 'Reconfirm UAV heading and WP heading', status: 'Pending', comment: '' },
    { id: 8, description: 'Check WP numbering & altitudes', status: 'Pending', comment: '' }
];

let nextId = 9;

// GET /api/checks
app.get('/api/checks', (req, res) => {
    res.json(checks);
});

// POST /api/checks
app.post('/api/checks', (req, res) => {
    const { description } = req.body;
    if (!description) {
        return res.status(400).json({ error: 'Description is required' });
    }
    const newCheck = {
        id: nextId++,
        description,
        status: 'Pending',
        comment: ''
    };
    checks.push(newCheck);
    res.status(201).json(newCheck);
});

// PUT /api/checks/:id
app.put('/api/checks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const checkIndex = checks.findIndex(c => c.id === id);

    if (checkIndex === -1) {
        return res.status(404).json({ error: 'Check not found' });
    }

    const { description, status, comment } = req.body;

    // Update fields if provided
    if (description !== undefined) checks[checkIndex].description = description;
    if (status !== undefined) checks[checkIndex].status = status;
    if (comment !== undefined) checks[checkIndex].comment = comment;

    res.json(checks[checkIndex]);
});

// DELETE /api/checks/:id
app.delete('/api/checks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const checkIndex = checks.findIndex(c => c.id === id);

    if (checkIndex === -1) {
        return res.status(404).json({ error: 'Check not found' });
    }

    checks.splice(checkIndex, 1);
    res.status(204).send();
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
