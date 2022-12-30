const express = require('express');
const app = express();
const port = 3003;

const { Rcon } = require("rcon-client");

const rcon = new Rcon({
  host: "localhost", port: 25575, password: "password"
});
rcon.on("connect", () => console.log("connected"));
rcon.on("authenticated", () => console.log("authenticated"));
rcon.on("end", () => console.log("end"));
rcon.on("error", () => console.log("error"));

async function rconConnect(res) {
  return rcon.connect().catch(err => {
    return res.status(500).json({
      success: false,
      message: "Error: Not connected",
      data: err
    });
  });
}

// routes setting
app.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Success',
    data: {}
  });
});

app.get('/reload', async (req, res) => {
  async function reload() {
    try {
      const data = (await rcon).send("reload");
      return [data, null];
    } catch (err) {
      return [null, err];
    }
  }

  // Connects to server right before making the request then disconnects
  await rconConnect(res);
  const [reloaded, reloadError] = await reload();
  rcon.end();

  const status = reloaded ? 200 : 500;
  const success = reloaded ? true : false;
  const message = reloaded ? "Server Reloading" : "Server FAILED to Reload";

  console.log(reloaded ? await reloaded : await reloadError);
  
  return res.status(status).json({
    success: success,
    message: message,
    data: {
      rconResponse: reloaded ? await reloaded : await reloadError,
    }
  });
});

// start and listen on the Express server
app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`);
});