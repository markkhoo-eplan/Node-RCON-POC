const { Rcon } = require("rcon-client");

class RconWrapper {
  rconState = {
    connectionState: false
  };

  constructor(host, port, password) {
    this.rcon = new Rcon({
      host: host,
      port: port,
      password: password,
    });

    this.rcon.on("connect", () => {
      this.rconState.connectionState = true;
      console.log("connected");
    });
    this.rcon.on("authenticated", () => {
    
      console.log("authenticated");
    });
    this.rcon.on("end", () => {
      this.rconState.connectionState = false;
      console.log("end");
    });
    this.rcon.on("error", (e) => {
      this.rconState.connectionState = false;
      console.log("An error occured in the rcon server: " + (e ? e.message : 'No error message'), e);
    });
  }

  async connect() {
    if (!this.rconState.connectionState) {
      await this.rcon.connect().then(()=> {
        this.rconState.connectionState = true;
      }).catch(err => {
        console.log(err)
        this.rconState.connectionState = false;
        throw new Error(err.message);
      });
    } else {
      throw new Error('Already connected to RCON server');
    }
  }

  async end() {
    if (this.rconState.connectionState) {
      await this.rcon.end().then(() => {
        this.rconState.connectionState = false;
      });
    } else {
      throw new Error('Already disconnected to RCON server');
    }
  }

  async send(command) {
    if (this.rconState.connectionState) {
      try {
        return await this.rcon.send(command);
      } catch (err) {
        throw new Error('Failed to send to RCON server');
      }
    } else {
      throw new Error('Not connected to RCON server');
    }
  }

  async isConnected() {
    return this.rconState.connectionState;
  }
}

module.exports = RconWrapper;