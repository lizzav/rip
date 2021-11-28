import "./App.css";
import { useState, useEffect } from "react";
import React from "react";
import bin from "./bin.png";
import draw from "./draw.png";
import save from "./save.png";
import {Create, Delete, GetAll, Update} from "./http";

function App() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [addTask, setAddTask] = useState(false);
  const [editTask, setEditTask] = useState("");
  const [update, setUpdate] = useState(false);
  const [tasks, setTask] = useState([
  ]);

  useEffect(() => {
    console.log(update);
    GetAll().then(data => setTask(data));
    setUpdate(false)
  }, [update]);
  const handleChangeName = event => {
    setName(event.target.value);
  };
  const handleChangeDescription = event => {
    setDescription(event.target.value);
  };
  const handleChangeNewName = event => {
    setNewName(event.target.value);
  };
  const handleChangeNewDescription = event => {
    setNewDescription(event.target.value);
  };

  const soldCheckbox = id => {
    const index = tasks.findIndex(el => el.id === id);
    const oldTask = tasks[index];
    Update({id:id,name:oldTask.name,description:oldTask.description,isDone:!oldTask.isDone}).then(data => setUpdate(true));
  };

  const deleteTask = id => {
    Delete({id:id}).then(data =>  setUpdate(true));
  };

  const addNewTask = (name, description) => {
    Create({ name: name, description: description, isDone:false }).then(data => setUpdate(true));
    setNewName("");
    setNewDescription("");
    setAddTask(false);
  };

  const updateTask = id => {
    const index = tasks.findIndex(el => el.id === id);
    const oldTask = tasks[index];
    Update({id:id,name:name,description:description,isDone:oldTask.isDone}).then(data => setUpdate(true));
    setEditTask("");
    setName("");
    setDescription("");
  };

  const editTaskParams = (id, name, description) => {
    setEditTask(id);
    setName(name);
    setDescription(description);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="123">
          <div className="newTask">
            {addTask && (
              <div className="newTask-container">
                <input
                  onChange={handleChangeNewName}
                  placeholder={"Введите название задачи"}
                  value={newName}
                />
                <input
                  onChange={handleChangeNewDescription}
                  placeholder={"Введите описание задачи"}
                  value={newDescription}
                />
                <button onClick={() => addNewTask(newName, newDescription)}>
                  Save
                </button>
              </div>
            )}
          </div>
          <button onClick={() => setAddTask(!addTask)}>
            Добавить новую задачу
          </button>

          <div className="task-item">
            <div />
            <div className="task-item__txt">Название</div>
            <div className="task-item__txt">Описание</div>
          </div>

          {tasks.map(el =>
            editTask !== el.id ? (
              <div key={el.id} className="task-item">
                <input
                  type="checkbox"
                  className="task-item__checkbox"
                  checked={el.isDone}
                  onChange={() => soldCheckbox(el.id)}
                />

                <div className="task-item__txt">{el.name}</div>
                <div className="task-item__txt">{el.description}</div>
                <div>
                  <img
                    src={bin}
                    className={"bin"}
                    alt="bin"
                    onClick={() => deleteTask(el.id)}
                  />
                  <img
                    src={draw}
                    className={"bin"}
                    alt="draw"
                    onClick={() =>
                      editTaskParams(el.id, el.name, el.description)
                    }
                  />
                </div>
              </div>
            ) : (
              <div key={el.id} className="task-item">
                <input
                  type="checkbox"
                  className="task-item__checkbox"
                  checked={el.isDone}
                  onChange={() => soldCheckbox(el.id)}
                />
                <input
                  className="task-item__txt"
                  onChange={handleChangeName}
                  placeholder={"Введите название задачи"}
                  value={name}
                />
                <input
                  className="task-item__txt"
                  onChange={handleChangeDescription}
                  placeholder={"Введите название задачи"}
                  value={description}
                />
                <div>
                  <img
                    src={bin}
                    className={"bin"}
                    alt="bin"
                    onClick={() => deleteTask(el.id)}
                  />
                  <img
                    src={save}
                    className={"bin"}
                    alt="save"
                    onClick={() => updateTask(el.id)}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
