import React, { useState } from "react";
import API from "../utils/api";

const TaskCard = ({ task, onTaskUpdated, onTaskDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(task.title);
  const [isCompleted, setIsCompleted] = useState(task.completed || false);

  // ✅ Update Task (title or completed)
  const handleUpdateTask = async (updates = {}) => {
    try {
      const taskId = task._id || task.id;
      if (!taskId) throw new Error("Invalid task ID");

      const res = await API.put(`/tasks/${taskId}`, updates);
      const updatedTask = res.data;

      setNewTitle(updatedTask.title);
      setIsCompleted(updatedTask.completed);
      setIsEditing(false);

      onTaskUpdated(updatedTask);
    } catch (err) {
      console.error("Error updating task:", err);
      alert(err.response?.data?.message || "Failed to update task");
    }
  };

  // ✅ Delete Task
  const handleDeleteTask = async () => {
    try {
      const taskId = task._id || task.id;
      if (!taskId) throw new Error("Invalid task ID");

      await API.delete(`/tasks/${taskId}`);
      onTaskDeleted(taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  // ✅ Toggle Complete
  const handleToggleComplete = () => {
    handleUpdateTask({ completed: !isCompleted });
  };

  // ✅ Save edited title
  const handleSaveEdit = () => {
    if (newTitle.trim() === "") {
      alert("Task title cannot be empty");
      return;
    }
    handleUpdateTask({ title: newTitle });
  };

  return (
    <div
      className={`flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2 hover:shadow transition ${
        isCompleted ? "opacity-70" : ""
      }`}
    >
      <div className="flex items-center gap-2 flex-1">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggleComplete}
          className="w-4 h-4 cursor-pointer"
        />
        {isEditing ? (
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleSaveEdit}
            onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
            autoFocus
            className="border-b border-gray-400 bg-transparent flex-1 text-sm outline-none"
          />
        ) : (
          <span
            onDoubleClick={() => setIsEditing(true)}
            className={`flex-1 text-sm cursor-pointer ${
              isCompleted ? "line-through text-gray-400" : ""
            }`}
          >
            {newTitle}
          </span>
        )}
      </div>

      <button
        onClick={handleDeleteTask}
        className="text-red-500 hover:text-red-700 text-xs font-medium"
      >
        Delete
      </button>
    </div>
  );
};

export default TaskCard;
