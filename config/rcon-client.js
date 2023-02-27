require("dotenv").config();
const { Rcon } = require("rcon-client");

const rconState = {
  connectionState: false
};

const rcon = new Rcon({
  host: process.env.RCON_HOST, port: process.env.RCON_PORT, password: process.env.RCON_PASS
});

rcon.on("connect", () => {
  rconState.connectionState = true;
  console.log("connected");
});
rcon.on("authenticated", () => {

  console.log("authenticated");
});
rcon.on("end", () => {
  rconState.connectionState = false;
  console.log("end");
});
rcon.on("error", (e) => {
  rconState.connectionState = false;
  console.log("An error occured in the rcon server: " + (e ? e.message : 'No error message'), e);
});

module.exports = rcon;