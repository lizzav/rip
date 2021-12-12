const MicroMQ=require('micromq');
const taskController = require("./controllers/taskController");

const app = new MicroMQ({
  name: 'tasks',
  rabbit: {
    url: process.env.RABBIT_URL,
  },
});

app.get("/api/tasks/", taskController.getAll);
app.post("/api/tasks/", taskController.create);
app.delete("/api/tasks/", taskController.delete);
app.put("/api/tasks/", taskController.update);

app.start();