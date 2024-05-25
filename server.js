const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const PASSPHRASE = process.env.PASSPHRASE || 'simplePassphrase';
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(bodyParser.json());

app.post('/login', (req, res) => {
    const { passphrase } = req.body;
    if (passphrase === PASSPHRASE) {
        res.status(200).send({ success: true });
    } else {
        res.status(403).send({ success: false });
    }
});

app.get('/projects', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: 'Failed to read data' });
        } else {
            res.send(JSON.parse(data));
        }
    });
});

app.post('/projects', (req, res) => {
    const updatedData = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), (err) => {
        if (err) {
            res.status(500).send({ error: 'Failed to save data' });
        } else {
            res.send({ success: true });
        }
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
