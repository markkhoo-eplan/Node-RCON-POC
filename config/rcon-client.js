require("dotenv").config();
const { Rcon } = require("rcon-client");

const rcon = new Rcon({
  host: process.env.RCON_HOST, port: process.env.RCON_PORT, password: process.env.RCON_PASS
});
rcon.on("connect", () => console.log("connected"));
rcon.on("authenticated", () => console.log("authenticated"));
rcon.on("end", () => console.log("end"));
rcon.on("error", () => console.log("error"));

module.exports = rcon;