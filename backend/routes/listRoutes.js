const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  createList,
  getLists,
  updateList,
  deleteList,
} = require("../controllers/listController");

// ✅ Create list under a specific board
router.post("/boards/:boardId/lists", protect, createList);

// ✅ Get all lists of a board
router.get("/boards/:boardId/lists", protect, getLists);

// ✅ Update list by ID
router.put("/lists/:id", protect, updateList);

// ✅ Delete list by ID
router.delete("/lists/:id", protect, deleteList);

module.exports = router;
