const { Task } = require("../models/models");
const ApiError = require("../error/ApiError");

class TaskController {
  async create(req, res) {
    const { name, description, isDone } = req.body;
    const tasks  = await Task.create({ name, description, isDone });
    return res.json(tasks );
  }

  async getAll(req, res) {
    const tasks  = await Task.findAll();
    return res.json(tasks );
  }
  async getOne(req, res) {
    const { id } = req.body;
    const tasks  = await Task.findByPk(id);
    return res.json(tasks );
  }
  async delete(req, res) {
    const { id } = req.body;
    const tasks  = await Task.destroy({
      where: { id: id }
    });
    return res.json("task was deleted");
  }
  async update(req, res) {
    const { id } = req.body;
    const tasks  = await Task.update(req.body, {
      where: { id: id }
    });
    return res.json("task was updated");
  }
}

module.exports = new TaskController();
