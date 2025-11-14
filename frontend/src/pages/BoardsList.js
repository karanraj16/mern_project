import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../utils/api";


const BoardsList = () => {
  const [boards, setBoards] = useState([]);

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

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <main className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">All Boards</h1>

          {boards.length === 0 ? (
            <p className="text-gray-500">No boards available.</p>
          ) : (
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              {boards.map((board) => (
                <Link
                  to={`/boards/${board._id}`}
                  key={board._id}
                  className="bg-white p-4 rounded-xl shadow hover:shadow-md transition border border-gray-200"
                >
                  <h2 className="font-semibold text-gray-800 mb-1">
                    {board.title}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    {board.description || "No description"}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BoardsList;
