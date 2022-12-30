const { Rcon } = require("rcon-client");

const rcon = new Rcon({
  host: "localhost", port: 25575, password: "password"
});
rcon.on("connect", () => console.log("connected"));
rcon.on("authenticated", () => console.log("authenticated"));
rcon.on("end", () => console.log("end"));
rcon.on("error", () => console.log("error"));

module.exports = rcon;