import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import TaskCard from "../components/TaskCard";

export default function Board() {
  const { id } = useParams(); // boardId
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [listTitle, setListTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [activeList, setActiveList] = useState(null);

  // fetch board + lists
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await API.get(`/boards/${id}`);
        setBoard(res.data);

        const listsRes = await API.get(`/boards/${id}/lists`);
        setLists(listsRes.data);
      } catch (err) {
        console.error("Error fetching board:", err);
      }
    };
    fetchBoard();
  }, [id]);

  // create new list
  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!listTitle) return;

    try {
      const res = await API.post(`/boards/${id}/lists`, { title: listTitle });
      setLists([...lists, res.data]);
      setListTitle("");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating list");
    }
  };

  // create new task in activeList
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle || !activeList) return;

    try {
      const res = await API.post(`/lists/${activeList}/tasks`, {
        title: taskTitle,
      });

      setLists(
        lists.map((list) =>
          list._id === activeList
            ? { ...list, tasks: [...list.tasks, res.data] }
            : list
        )
      );

      setTaskTitle("");
    } catch (err) {
      alert(err.response?.data?.message || "Error creating task");
    }
  };

  // toggle task completed
  const toggleTask = async (taskId, completed) => {
    try {
      const res = await API.put(`/tasks/${taskId}`, { completed });

      setLists(
        lists.map((list) => ({
          ...list,
          tasks: list.tasks.map((t) =>
            t._id === taskId ? res.data : t
          ),
        }))
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  // delete task
  const deleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}`);
      setLists(
        lists.map((list) => ({
          ...list,
          tasks: list.tasks.filter((t) => t._id !== taskId),
        }))
      );
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  if (!board) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{board.title}</h1>
      <p className="text-gray-600 mb-6">{board.description}</p>

      {/* create list form */}
      <form
        onSubmit={handleCreateList}
        className="bg-white shadow p-3 rounded mb-6 flex gap-2"
      >
        <input
          type="text"
          placeholder="New list title"
          value={listTitle}
          onChange={(e) => setListTitle(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add List
        </button>
      </form>

      {/* lists */}
      <div className="grid grid-cols-3 gap-4">
        {lists.map((list) => (
          <div
            key={list._id}
            className="bg-gray-50 shadow rounded p-3 flex flex-col"
          >
            <h2 className="font-semibold text-lg mb-2">{list.title}</h2>

            {/* tasks */}
            <div className="flex-1">
              {list.tasks && list.tasks.length > 0 ? (
                list.tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggle={toggleTask}
                    onDelete={deleteTask}
                  />
                ))
              ) : (
                <p className="text-gray-400 text-sm">No tasks yet</p>
              )}
            </div>

            {/* add task form */}
            <form
              onSubmit={(e) => {
                setActiveList(list._id);
                handleCreateTask(e);
              }}
              className="mt-2 flex gap-2"
            >
              <input
                type="text"
                placeholder="New task"
                value={activeList === list._id ? taskTitle : ""}
                onChange={(e) => {
                  setActiveList(list._id);
                  setTaskTitle(e.target.value);
                }}
                className="border p-2 rounded flex-1 text-sm"
              />
              <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                Add
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
