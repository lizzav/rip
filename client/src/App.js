import "./App.css";
import { useState, useEffect, useRef } from "react";
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


  const [messages, setMessages] = useState([]);
  const socket = useRef()
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState('')


  useEffect(() => {
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
    sendUpdateTask()
  };

  const deleteTask = id => {
    Delete({id:id}).then(data =>  setUpdate(true));
    sendDeleteTask()
  };

  const addNewTask = (name, description) => {
    Create({ name: name, description: description, isDone:false }).then(data => setUpdate(true));
    setNewName("");
    setNewDescription("");
    setAddTask(false);
    sendTask();
  };

  const updateTask = id => {
    const index = tasks.findIndex(el => el.id === id);
    const oldTask = tasks[index];
    Update({id:id,name:name,description:description,isDone:oldTask.isDone}).then(data => setUpdate(true));
    setEditTask("");
    setName("");
    setDescription("");
    sendUpdateTask()
  };

  const editTaskParams = (id, name, description) => {
    setEditTask(id);
    setName(name);
    setDescription(description);
  };


  function connect() {
    socket.current = new WebSocket('ws://localhost:5000')

    socket.current.onopen = () => {
      setConnected(true)
      const message = {
        event: 'connection',
        username,
        id: Date.now()
      }
      socket.current.send(JSON.stringify(message))
    }
    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setMessages(prev => [message, ...prev])
      GetAll().then(data => setTask(data));
    }
    socket.current.onclose= () => {
      console.log('Socket закрыт')
    }
    socket.current.onerror = () => {
      console.log('Socket произошла ошибка')
    }
  }

  const sendTask = async () => {
    const message = {
      username,
      message: "добавил новую задачу",
      id: Date.now(),
      event: 'change'
    }
    socket.current.send(JSON.stringify(message));
  }
  const sendDeleteTask = async () => {
    const message = {
      username,
      message: "удалил задачу",
      id: Date.now(),
      event: 'change'
    }
    socket.current.send(JSON.stringify(message));
  }
  const sendUpdateTask = async () => {
    const message = {
      username,
      message: "обновил задачу",
      id: Date.now(),
      event: 'change'
    }
    socket.current.send(JSON.stringify(message));
  }
  if (!connected) {
    return (

      <div className="App">
      <div className="center">
        <div className="form">
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            type="text"
            placeholder="Введите ваше имя"/>
          <button onClick={connect}>Войти</button>
        </div>
      </div>
      </div>
    )
  }


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
      <div className="center">
        <div>
          <div className="messages">
            {messages.map(mess =>
              <div key={mess.id}>
                {mess.event === 'connection'
                  ? <div className="connection_message">
                    Пользователь {mess.username} подключился
                  </div>
                  : <div className="message">
                    {mess.username}. {mess.message}
                  </div>
                }
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;
