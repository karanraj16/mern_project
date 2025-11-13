import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../utils/api";
import TaskCard from "../components/TaskCard";

const BoardDetail = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");

  // ✅ Fetch board + lists + tasks
  useEffect(() => {
    const fetchBoardAndLists = async () => {
      try {
        if (!boardId) return;
        const boardRes = await API.get(`/boards/${boardId}`);
        const listsRes = await API.get(`/boards/${boardId}/lists`);
        const listsData = listsRes.data;

        // Fetch tasks for each list
        const listsWithTasks = await Promise.all(
          listsData.map(async (list) => {
            const tasksRes = await API.get(`/lists/${list._id}/tasks`);
            return { ...list, tasks: tasksRes.data };
          })
        );

        setBoard(boardRes.data);
        setLists(listsWithTasks);
      } catch (err) {
        console.error("Error loading board/lists:", err);
      }
    };
    fetchBoardAndLists();
  }, [boardId]);

  // ✅ Create a new list
  const handleAddList = async (e) => {
    e.preventDefault();
    if (!newListName.trim()) {
      alert("Please enter a list name");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        `/boards/${boardId}/lists`,
        { title: newListName },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setLists([...lists, { ...res.data, tasks: [] }]);
      setNewListName("");
    } catch (err) {
      console.error("Error creating list:", err);
      alert(err.response?.data?.message || "Failed to create list");
    }
  };

  // ✅ Add a new task in a specific list
  const handleAddTask = async (listId, title) => {
    if (!title.trim()) return;
    try {
      const res = await API.post(`/lists/${listId}/tasks`, { title });
      const updatedLists = lists.map((l) =>
        l._id === listId ? { ...l, tasks: [...(l.tasks || []), res.data] } : l
      );
      setLists(updatedLists);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  // ✅ Handle task update (edit / toggle complete)
  const handleTaskUpdated = (updatedTask) => {
    const updatedLists = lists.map((list) => ({
      ...list,
      tasks: list.tasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      ),
    }));
    setLists(updatedLists);
  };

  // ✅ Handle task delete
  const handleTaskDeleted = (taskId) => {
    const updatedLists = lists.map((list) => ({
      ...list,
      tasks: list.tasks.filter((task) => task._id !== taskId),
    }));
    setLists(updatedLists);
  };

  if (!board) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading board details...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          <Link
            to="/dashboard"
            className="text-blue-500 hover:underline text-sm mb-4 inline-block"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="text-2xl font-bold mb-1 text-gray-800">
            {board.title}
          </h1>
          <p className="text-gray-500 mb-6">{board.description}</p>

          {/* ✅ Add new list form */}
          <form onSubmit={handleAddList} className="mb-6 flex gap-2">
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="New list name..."
              className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Add List
            </button>
          </form>

          {/* ✅ Lists and tasks */}
          <div className="flex flex-wrap gap-6">
            {lists.length === 0 ? (
              <p className="text-gray-500">No lists yet. Create one above.</p>
            ) : (
              lists.map((list) => (
                <div
                  key={list._id}
                  className="bg-white rounded-xl shadow-md p-4 w-80 border border-gray-200"
                >
                  <h2 className="text-lg font-semibold mb-3 text-gray-800">
                    {list.title}
                  </h2>

                  {/* Tasks */}
                  <div className="flex flex-col gap-2 mb-3">
                    {list.tasks && list.tasks.length > 0 ? (
                      list.tasks.map((task) => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          onTaskUpdated={handleTaskUpdated}
                          onTaskDeleted={handleTaskDeleted}
                        />
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm">No tasks yet.</p>
                    )}
                  </div>

                  <AddTaskForm
                    onAddTask={(title) => handleAddTask(list._id, title)}
                  />
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// ✅ Small inline component for adding new tasks
const AddTaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddTask(title);
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task..."
        className="border border-gray-300 rounded-lg px-2 py-1 text-sm flex-1"
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-600"
      >
        Add
      </button>
    </form>
  );
};

export default BoardDetail;

