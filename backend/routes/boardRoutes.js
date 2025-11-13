const express = require("express");

const {createBoard ,getBoards, getBoardById, deleteBoard} = require("../controllers/boardController");

const {protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",protect,createBoard);

router.get("/",protect,getBoards);

router.get("/:boardId",protect,getBoardById);

router.delete("/:id", protect ,deleteBoard);

module.exports = router;


