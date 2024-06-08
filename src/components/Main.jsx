import { useState } from "react";


const Main = () => {
  const [newTask, setNewTask] = useState({ task: "", checked: false, id: "" });
  const [allTasks, setAllTask] = useState([]);
  const [getTasks, setGetTasks] = useState(false);
  const [getSearch, setGetSearch] = useState("");
  const url_BACK= import.meta.env.VITE_APP_URL_BACK
  const handleTask = (event) => {
    setNewTask({ task: event.target.value, checked: false });
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setGetTasks(true);

    if (newTask.task) {
      await axios
        .post(url_BACK, {
          task: newTask.task,
          checked: newTask.checked,
        })
        .then(async (firstResponse) => {
          await axios
            .get(url_BACK) 
            .then((response) => {
              setAllTask(response.data);
              setNewTask({ task: "", checked: false });
            })

            .catch((error) => alert(error));
        })
        .catch((error) => alert("Error"));
    } else {
      alert("Add a task");
    }
  };
  const handleDeleteTask = async (elem) => {
    await axios
      .delete(`${url_BACK}/${elem.target.id}`)
      .then((response) => {
        const allTasksArrayId = allTasks.map((elem) => {
          return elem._id;
        });

        const indexToDelete = allTasksArrayId.indexOf(elem.target.id);
        if (indexToDelete !== 0) {
          setAllTask([
            ...allTasks.splice(0, indexToDelete),
            ...allTasks.splice(indexToDelete),
          ]);
        } else {
          setAllTask([...allTasks.splice(1)]);
        }
      })
      .catch((error) => alert(error));
  };
  const handleChangeTask = async (elem) => {
    await axios
      .put(`${url_BACK}/${elem.target.id}`, {
        checked: elem.target.checked,
      })
      .then(async (response) => {
        setAllTask([...allTasks]);
        await axios
          .get(url_BACK)
          .then((response) => {
            setAllTask(response.data);
            setNewTask({ task: "", checked: false });
          })

          .catch((error) => alert(error));
        elem.target.cheked = !elem.target.checked;
      })
      .catch((error) => alert(error.message));
  };

  const handleGetList = async () => {
    await axios
      .get(url_BACK)
      .then((response) => {
        setAllTask(response.data);
        setGetTasks(true);
      })

      .catch((error) => alert(error));
  };
  const handleSearch = (event) => {
    setGetSearch(event.target.value);
  };
  return (
    <main>
      <div className="container">
        <section className="tasks-list">
          <button
            className={getTasks ? "__loading __hide" : "__loading"}
            onClick={handleGetList}
          >
            <i className="fa-solid fa-calendar-check fa-bounce"></i>
            <p>Charger la liste des tâches</p>
          </button>
          <input
            className={!getTasks ? "__searching __hide" : "__searching"}
            onChange={handleSearch}
            type="search"
            placeholder="Search a task"
          />
          <ul>
            {allTasks.map((elem, index) => {
              let counter = 0;
              const searcher = new RegExp(getSearch, "gi");
              if (elem.task.search(searcher) !== -1) {
                return (
                  <li
                    key={elem.task + index}
                    className={elem.checked ? "__done" : ""}
                  >
                    <input
                      id={elem._id}
                      onChange={handleChangeTask}
                      type="checkbox"
                      checked={elem.checked}
                    />
                    <p className={elem.checked ? "__done" : ""}>{elem.task}</p>
                    <i
                      id={elem._id}
                      className="fa-solid fa-trash"
                      onClick={handleDeleteTask}
                    ></i>
                  </li>
                );
              }
            })}
          </ul>
        </section>
        <section className="add-task">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="newTask"
              onChange={handleTask}
              value={newTask.task}
              placeholder="new task"
            />
            <button type="submit">Add Task</button>
          </form>
        </section>
      </div>
    </main>
  );
};

export default Main;
