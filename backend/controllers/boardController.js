const Board = require("../models/Board");

// @desc Create board
exports.createBoard = async (req, res) => {
  try {
    const board = new Board({ ...req.body, createdBy: req.user.id });
    await board.save();
    res.status(201).json(board);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get boards for logged-in user
exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find({ createdBy: req.user.id });
    res.status(200).json(boards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }
    res.json(board);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete board
exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    if ( !board.createdBy || board.createdBy.toString() !== req.user.id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await board.deleteOne();
    res.status(200).json({ message: "Board deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
