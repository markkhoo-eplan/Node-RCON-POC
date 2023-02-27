require("dotenv").config();
const express = require('express');
const app = express();
const port = 3003;

const RconWrapper = require("./config/rcon-wrapper");
const rcon = new RconWrapper('localhost', 25575, 'password');

app.get('/connect', (req, res) => {
  rcon.connect().then(rs => {
    return res.status(200).json({
      success: true,
      message: rs
    })
  }).catch(err => {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  })
});

app.get('/end', (req, res) => {
  rcon.end().then(rs => {
    return res.status(200).json({
      success: true,
      message: rs
    })
  }).catch(err => {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  })
});

app.get('/connectionstate', (req, res) => {
  rcon.isConnected().then(rs => {
    return res.status(200).json({
      success: true,
      state: rs
    })
  })
})

app.get('/whitelist', (req, res) => {
  rcon.send("whitelist list").then(rs => {
    return res.status(200).json({
      success: true,
      message: rs
    })
  }).catch(err => {
    return res.status(500).json({
      success: false,
      message: err.message
    })
  })
});

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});