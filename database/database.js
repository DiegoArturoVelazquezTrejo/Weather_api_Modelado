const mongoose = require('mongoose');

const DB_NAME = 'Nebula_COVID';
const DB_PWD = "kiXCHnrz84UhX0dV";
const CONNECTION_STRING = 'mongodb+srv://Guernica:' + DB_PWD + '@nebula.8ogck.mongodb.net/' + DB_NAME + '?retryWrites=true&w=majority'

const OPTIONS = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

class Database {
  constructor() {
    this.connect()
  }

  connect() {
    let connection = mongoose.createConnection(CONNECTION_STRING, OPTIONS)

    this.connection = connection

    mongoose.Promise = global.Promise;

    mongoose.connection.on("connected", () => {
        console.log("Connection Established");
    });
    mongoose.connection.on("reconnected", () => {
        console.log("Connection Reestablished");
    });
    mongoose.connection.on("disconnected", () => {
        console.log("Connection Disconnected");
    });
    mongoose.connection.on("close", () => {
        console.log("Connection Closed");
    });
    mongoose.connection.on("error", (error) => {
        console.error("ERROR: " + error);
    });
  }

  getConnection(){
    return this.connection
  }
}

const db = new Database()
module.exports = db
