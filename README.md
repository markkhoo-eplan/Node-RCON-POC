# Node with RCON POC

## Description
This is a proof of concept for sending **rcon** messages through http requests. 
The decision to use the node package [rcon-client](https://github.com/janispritzkau/rcon-client) 
comes mainly from this packages way of sending and recieving rcon messages as a promise. 
In the case of this proof of concept: 
1)  We want to only connect to the server via rcon only when a rcon message is about to 
    be sent. Then disconnect after the message is sent. This is because the server may not
    be up at all times. Handling it this way mean we don't need to main a persistent 
    connection and handle reconnects. We only need to handle a failed connection.
2)  The rcon-client package allows us to receive an rcon response as a resolved promise.
    This is helpful for validating if a sent rcon message was successful.

### Modularizaing the RCON Object
```js
const { Rcon } = require("rcon-client");

const rcon = new Rcon({
  host: "localhost", port: 25575, password: "password"
});
rcon.on("connect", () => console.log("connected"));
rcon.on("authenticated", () => console.log("authenticated"));
rcon.on("end", () => console.log("end"));
rcon.on("error", () => console.log("error"));

module.exports = rcon;
```

### Sending RCON Messages in an HTTP request
```js
// Separating the connection into a function to be used in other routes
async function rconConnect(res) {
  return rcon.connect().catch(err => {
    return res.status(500).json({
      success: false,
      message: "Error: Not connected",
      data: err
    });
  });
}

app.get('/reload', async (req, res) => {
  // Seperating the rcon message into a function for error handling
  async function reload() {
    try {
      // Sending the rcon message
      const data = (await rcon).send("reload");
      return [data, null];
    } catch (err) {
      return [null, err];
    }
  }

  // Connects to server right before making the request
  await rconConnect(res);

  // Sends the rcon message
  const [reloaded, reloadError] = await reload();

  // Disconnects after the message is sent
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
```

## Packages Tested
* [node-rcon](https://github.com/pushrax/node-rcon) (No Promisify of rcon messages)
* [rcon-client](https://github.com/janispritzkau/rcon-client)