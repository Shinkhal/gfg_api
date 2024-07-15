const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios'); 
const getUserData = require('./gfg');


const app = express();
const port = 4000

app.use(cors({
    origin: "*", // Allow any origin
    credentials: true
}));

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to the GeeksforGeeks User Stats API</h1>
    <p>This API allows you to retrieve user statistics from GeeksforGeeks. Simply append a GeeksforGeeks username to the URL to get detailed stats for that user.</p>
    <p>Example Usage:</p>
    <ul>
      <li><code>/username</code> - Replace <code>username</code> with the actual GeeksforGeeks username to fetch the stats.</li>
    </ul>
    <p>Features:</p>
    <ul>
      <li>Fetch user statistics including problems solved, submissions, and more.</li>
      <li>Easy to integrate with your applications and services.</li>
      <li>Supports CORS for cross-origin requests.</li>
    </ul>
    <p>Get started by entering a GeeksforGeeks username in the URL!</p>
  `);
});


app.get('/:userName', async (req, res) => {
    try {
        const userName = req.params.userName;
        const data = await getUserData(userName);
        if (!data) {
            res.send("User name not found!");
        } else {
            res.send(data);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
