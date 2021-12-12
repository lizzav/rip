require("dotenv").config();
const express = require("express");
const app = express();
const WSServer = require("express-ws")(app);
const aWss = WSServer.getWss();
const sequelize = require("./db");
const modules = require("./models/models");
const cors = require("cors");
const router = require("./routes/index");

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use("/api", router);


app.ws("/", (ws, req) => {
  ws.on("message", msg => {
    msg = JSON.parse(msg);
    switch (msg.event) {
      case "connection":
        connectionHandler(ws,msg);
        break;
      case "message":
        broadcastConnection(ws, msg);
        break;
        case "change":
        broadcastConnection(ws, msg);
        break;
    }
  });
});

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
};

start();

const connectionHandler = (ws, msg) => {
  ws.id = msg.id;
  broadcastConnection(ws, msg);
};

const broadcastConnection = (ws, msg) => {
  aWss.clients.forEach(client => {
      client.send(JSON.stringify(msg));
  });
};
