const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 8080; // Choose your desired port

// MongoDB Connection
const uri = 'mongodb://localhost/hodlinfo'; // Replace with your MongoDB URI
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Define your Mongoose Model (for storing data)
const CryptoSchema = new mongoose.Schema({
    name: String,
    last: Number,
    buy: Number,
    sell: Number,
    volume: Number,
    base_unit: String
});

const Crypto = mongoose.model('Crypto', CryptoSchema);

// Middleware
app.use(bodyParser.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route for serving the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API Route to Fetch and Store Data
app.get('/api/crypto', async (req, res) => {
    try {
        // Fetch data from WazirX API
        const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
        const top10 = Object.entries(response.data).slice(0, 10);

        await Crypto.deleteMany({});/***** */

        // Store data in MongoDB
        await Crypto.insertMany(top10.map(([name, data]) => ({
            name: name,
            last: data.last,
            buy: data.buy,
            sell: data.sell,
            volume: data.volume,
            base_unit: data.base_unit
        })));

        // Send stored data back to the client
        res.json(top10.map(([name, data]) => ({
            name: name,
            last: data.last,
            buy: data.buy,
            sell: data.sell,
            volume: data.volume,
            base_unit: data.base_unit
        })));

    } catch (error) {
        console.error('Error fetching or storing data:', error);
        res.status(500).send('Error fetching data');
    }
    
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    console.log(`click http://localhost:${port}/`);
});