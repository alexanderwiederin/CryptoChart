const express = require('express');
const morgan = require('morgan');
const path = require('path');
const redis = require('redis');
const axios = require('axios');

const PORT = 3000;
const redisClient = redis.createClient();

const app = express();
app.use(morgan());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/v1/bpi/historical/close.json', (req, res) => {
  const { start, end } = req.query;
  redisClient.get(`${start} ${end}`, (error, reply) => {
    if (reply === null || error) {
      axios.get(`https://api.coindesk.com/v1/bpi/historical/close.json?start=${start}&end=${end}`)
        .then((response) => {
          redisClient.set(`${start} ${end}`, JSON.stringify(response.data));
          res.send(response.data);
        })
        .catch(axiosError => console.log(axiosError));
    } else {
      res.send(reply);
    }
  });
});


app.listen(PORT, () => console.log(`listening on http://localhost:${PORT}`));
