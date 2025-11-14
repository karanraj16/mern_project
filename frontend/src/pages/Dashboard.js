import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const Dashboard = () => {

  const [boards, setBoards] = useState([]);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardDescription, setNewBoardDescription] = useState("");
  const navigate = useNavigate();

  // ✅ Fetch all boards
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await API.get("/boards");
        setBoards(res.data);
      } catch (err) {
        console.error("Error loading boards:", err);
      }
    };
    fetchBoards();
  }, []);

  // ✅ Create new board
  const handleCreateBoard = async (e) => {
    e.preventDefault();
    if (!newBoardTitle.trim()) return alert("Enter a board title");

    try {
      const token = localStorage.getItem("token");
      const res = await API.post(
        "/boards",
        {
          title: newBoardTitle,
          description: newBoardDescription,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setBoards([...boards, res.data]);
      setNewBoardTitle("");
      setNewBoardDescription("");
    } catch (err) {
      console.error("Error creating board:", err);
      alert(err.response?.data?.message || "Failed to create board");
    }
  };

  // ✅ Delete a board
  const handleDeleteBoard = async (boardId) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    try {
      await API.delete(`/boards/${boardId}`);
      setBoards(boards.filter((b) => b._id !== boardId));
    } catch (err) {
      console.error("Error deleting board:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">

        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Boards</h1>

          {/* ✅ Create new board form */}
          <form
            onSubmit={handleCreateBoard}
            className="bg-white shadow-md rounded-lg p-4 mb-6 flex flex-col sm:flex-row gap-3"
          >
            <input
              type="text"
              placeholder="Board Title"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newBoardDescription}
              onChange={(e) => setNewBoardDescription(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 flex-1"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              + Create Board
            </button>
          </form>

          {/* ✅ Board List */}
          {boards.length === 0 ? (
            <p className="text-gray-500">No boards yet. Create one above.</p>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {boards.map((board) => (
                <div
                  key={board._id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition border border-gray-200"
                >
                  <h2 className="text-lg font-semibold text-gray-800 mb-1">
                    {board.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                    {board.description || "No description"}
                  </p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => navigate(`/boards/${board._id}`)}
                      className="text-blue-600 text-sm hover:underline"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDeleteBoard(board._id)}
                      className="text-red-500 text-sm hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

